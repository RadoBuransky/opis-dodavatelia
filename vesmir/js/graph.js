var TYPE_OPIS = "opis";
var TYPE_PROJECT = "project";
var TYPE_COMPANY = "company";
var TYPE_CONTRACT = "contract";
var TYPE_INSTITUTION = "institution";

$(function(){
    var $container = $('#vesmir-container'),
        width = $container.width(),
        height = $container.height();

    var fill = d3.scale.category10();

    var svg = d3.select("#vesmir-container").append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
        .attr('viewBox','0 0 '+width+' '+height)
        .style("background-color", "black");

    var rect = svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "black");

    var nodes = [],
        links = [];

    var force = d3.layout.force()
        .size([width, height])
        .linkDistance(30)
        .charge(-5000)
        .gravity(0.5)
        .nodes(nodes)
        .links(links)
        .on("tick", onTick);

    var opisNode = {
        id: TYPE_OPIS,
        type: TYPE_OPIS
    };

    nodes.push(opisNode);

    // Load data from spreadsheet
    new Spreadsheet(function(spreadsheet) {
        loadProjects(spreadsheet.projects);
        loadCompanies(spreadsheet.companies);
        loadInstitutions(spreadsheet.institutions);
        loadContracts(spreadsheet.contracts);

        restart();
    });

    function loadInstitutions(institutions) {
        //Add type to all nodes
        $.map(institutions, function(val, i) {
            val.type = TYPE_INSTITUTION;
        });

        nodes.push.apply(nodes, institutions);
    }

    function loadContracts(contracts) {
        //Add type to all nodes
        $.map(contracts, function(val, i) {
            val.type = TYPE_CONTRACT;
        });

        $.each(contracts, function(i, val) {
            var contractIndex = nodes.push(val) - 1;

            // Connect contracts and suppliers
            var suppliers = $.grep(nodes, function(n) { return (n.type === TYPE_COMPANY) && (val.companies.indexOf(n.id) > -1) } );
            $.each(suppliers, function(j, supplier) {
                var supplierIndex = nodes.indexOf(supplier);
                links.push({source: contractIndex, target: supplierIndex});
            });

            // Connect contracts and projects
            var projects = $.grep(nodes, function(n) { return (n.type === TYPE_PROJECT) && (val.projectId == n.id) } );
            $.each(projects, function(j, project) {
                var projectIndex = nodes.indexOf(project);
                links.push({source: contractIndex, target: projectIndex});
            });

            // Connect contracts and institutions
            var institutions = $.grep(nodes, function(n) { return (n.type === TYPE_INSTITUTION) && (val.institutionId.indexOf(n.id) > -1) } );
            $.each(institutions, function(j, institution) {
                var institutionIndex = nodes.indexOf(institution);
                links.push({source: contractIndex, target: institutionIndex});
            });
        });
    }

    function loadProjects(projects) {
        // Add type to all nodes
        $.map(projects, function(val, i) {
            val.type = TYPE_PROJECT;
        });

        nodes.push.apply(nodes, projects);

        // Connect projects with the main OPIS node
        $.each(projects, function(i, val) {
            links.push({source: 0, target: i + 1});
        });
    }

    function loadCompanies(companies) {
        // Add type to all nodes
        $.map(companies, function(val, i) {
            val.type = TYPE_COMPANY;
        });

        nodes.push.apply(nodes, companies);
    }

    var node = svg.selectAll(".node"),
        link = svg.selectAll(".link");

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
//            .on("mouseover", nodeMouseOver)
//            .on("mouseout", nodeMouseOut);

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
            case TYPE_OPIS:
                specific = "node-opis";
                break;

            case TYPE_PROJECT:
                specific = "node-project";
                break;

            case TYPE_COMPANY:
                specific = "node-company";
                break;

            case TYPE_CONTRACT:
                specific = "node-contract";
                break;

            case TYPE_INSTITUTION:
                specific = "node-institution";
                break;
        }

        return "node " + specific;
    }

    function nodeDisplayStyle(n) {
        switch (n.type) {
            case TYPE_OPIS:
                return "block";
        }

        return "none";
    }

    function nodeMouseOut(n) {
        switch (n.type) {
            case TYPE_PROJECT:
            case TYPE_COMPANY:
            case TYPE_CONTRACT:
            case TYPE_INSTITUTION:
                d3.select(this.parentNode).select("text").style({display: "none"});
        }
    }

    function nodeMouseOver(n) {
        switch (n.type) {
            case TYPE_PROJECT:
            case TYPE_COMPANY:
            case TYPE_CONTRACT:
            case TYPE_INSTITUTION:
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
            case TYPE_OPIS:
                return "OPIS";
            case TYPE_PROJECT:
                return n.name;
            case TYPE_COMPANY:
                return n.name;
            case TYPE_CONTRACT:
                return formatter.format(n.priceEur);
            case TYPE_INSTITUTION:
                return n.name;
        }

        return "";
    }

    function onTick() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }
});