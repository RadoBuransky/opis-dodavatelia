function Graph(containerId) {
    var nodes = [],
        node = [],
        links = [],
        link = [],
        svg = {},
        force = {},
        model = {};

    init();

    function init() {
        var $container = $(containerId),
            width = $container.width(),
            height = $container.height();

        var fill = d3.scale.category10();

        svg = d3.select(containerId).append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
            .attr('viewBox','0 0 '+width+' '+height)
            .style("background-color", "black");

        var rect = svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "black");

        force = d3.layout.force()
            .size([width, height])
            .linkDistance(30)
            .charge(-5000)
            .gravity(0.5)
            .nodes(nodes)
            .links(links)
            .on("tick", onTick);

        // Load model from spreadsheet and restart graph
        model = new Model();
        model.loadFromSpreadsheet(function(model) {
            modelToGraph(model);
        });
    }

    function modelToGraph(model) {
        var opisNode = {
            id: model.TYPE_OPIS,
            type: model.TYPE_OPIS
        };
        nodes.push(opisNode);

        projectsToGraph(model.projects);
        companiesToGraph(model.companies);
        institutionsToGraph(model.institutions);
        contractsToGraph(model.contracts);

        node = svg.selectAll(".node");
        link = svg.selectAll(".link");

        restart();

        function contractsToGraph(contracts) {
            $.each(contracts, function(i, val) {
                var contractIndex = nodes.push(val) - 1;

                // Connect contracts and suppliers
                var suppliers = $.grep(nodes, function(n) { return (n.type === model.TYPE_COMPANY) && (val.companies.indexOf(n.id) > -1) } );
                $.each(suppliers, function(j, supplier) {
                    var supplierIndex = nodes.indexOf(supplier);
                    links.push({source: contractIndex, target: supplierIndex});
                });

                // Connect contracts and projects
                var projects = $.grep(nodes, function(n) { return (n.type === model.TYPE_PROJECT) && (val.projectId == n.id) } );
                $.each(projects, function(j, project) {
                    var projectIndex = nodes.indexOf(project);
                    links.push({source: contractIndex, target: projectIndex});
                });

                // Connect contracts and institutions
                var institutions = $.grep(nodes, function(n) { return (n.type === model.TYPE_INSTITUTION) && (val.institutionId.indexOf(n.id) > -1) } );
                $.each(institutions, function(j, institution) {
                    var institutionIndex = nodes.indexOf(institution);
                    links.push({source: contractIndex, target: institutionIndex});
                });
            });
        }

        function institutionsToGraph(institutions) {
            nodes.push.apply(nodes, institutions);
        }

        function companiesToGraph(companies) {
            nodes.push.apply(nodes, companies);
        }

        function projectsToGraph(projects) {
            nodes.push.apply(nodes, projects);

            // Connect projects with the main OPIS node
            $.each(projects, function(i, val) {
                links.push({source: 0, target: i + 1});
            });
        }
    }

    function restart() {
        link = link.data(links)
            .enter().append("line")
            .attr("class", "link");

        node = node.data(nodes)
            .enter().append("g")
            .attr("class", nodeClass)
            .attr("x", 0)
            .attr("y", 0)
            .call(force.drag);

        var circle = node.append("circle");

        node.append("text")
            .attr("dx", "-35")
            .attr("dy", ".35em")
            .style("display", nodeDisplayStyle)
            .text(nodeText);

        node = svg.selectAll(".node"),
        link = svg.selectAll(".link");

        force.start();
    }

    function nodeClass(n) {
        var specific = "";
        switch (n.type) {
            case model.TYPE_OPIS:
                specific = "node-opis";
                break;

            case model.TYPE_PROJECT:
                specific = "node-project";
                break;

            case model.TYPE_COMPANY:
                specific = "node-company";
                break;

            case model.TYPE_CONTRACT:
                specific = "node-contract";
                break;

            case model.TYPE_INSTITUTION:
                specific = "node-institution";
                break;
        }

        return "node " + specific;
    }

    function nodeDisplayStyle(n) {
        switch (n.type) {
            case model.TYPE_OPIS:
                return "block";
        }

        return "none";
    }

    function nodeMouseOut(n) {
        switch (n.type) {
            case model.TYPE_PROJECT:
            case model.TYPE_COMPANY:
            case model.TYPE_CONTRACT:
            case model.TYPE_INSTITUTION:
                d3.select(this.parentNode).select("text").style({display: "none"});
        }
    }

    function nodeMouseOver(n) {
        switch (n.type) {
            case model.TYPE_PROJECT:
            case model.TYPE_COMPANY:
            case model.TYPE_CONTRACT:
            case model.TYPE_INSTITUTION:
                d3.select(this.parentNode).select("text").style({display: "block"});
        }
    }

    function nodeText(n) {
        var formatter = new Intl.NumberFormat('sk-SK', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0,
        });

        switch (n.type) {
            case model.TYPE_OPIS:
                return "OPIS";
            case model.TYPE_PROJECT:
                return n.name;
            case model.TYPE_COMPANY:
                return n.name;
            case model.TYPE_CONTRACT:
                return formatter.format(n.priceEur);
            case model.TYPE_INSTITUTION:
                return n.name;
        }

        return "";
    }

    function onTick() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    }
}

$(function(){
    new Graph("#vesmir-container");
});