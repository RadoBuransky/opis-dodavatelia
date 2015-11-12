var TYPE_OPIS = "opis";
var TYPE_PROJECT = "project";
var TYPE_COMPANY = "company";
var TYPE_CONTRACT = "contract";

$(function(){
    var $container = $('#container'),
        width = $container.width(),
        height = $container.height();

    var fill = d3.scale.category10();

    var svg = d3.select("#container").append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
        .attr('viewBox','0 0 '+width+' '+height)
        .attr('preserveAspectRatio','xMinYMin');

    var nodes = [],
        links = [];

    var force = d3.layout.force()
        .size([width, height])
        .linkDistance(100)
        .charge(-300)
        .gravity(0.1)
        .nodes(nodes)
        .links(links)
        .on("tick", onTick);

    var opisNode = {
        id: TYPE_OPIS,
        type: TYPE_OPIS
    };

    nodes.push(opisNode);

    // Load projects
    d3.json("js/projects.json", function(error, json) {
        if (error) return console.warn(error);

        // Add type to all nodes
        $.map(json.nodes, function(val, i) {
            val.type = TYPE_PROJECT;
        });

        $.each(json.nodes, function(i, val) {
            links.push({source: 0, target: i + 1});
        });

        nodes.push.apply(nodes, json.nodes);
        restart();
    });

    // Load companies
    d3.json("js/companies.json", function(error, json) {
        if (error) return console.warn(error);

        // Add type to all nodes
        $.map(json.companies, function(val, i) {
            val.type = TYPE_COMPANY;
        });

        $.each(json.companies, function(i, val) {
            //links.push({source: 0, target: i + 1});
        });

        nodes.push.apply(nodes, json.companies);
        restart();
    });

    // Load contracts
    d3.json("js/contracts.json", function(error, json) {
        if (error) return console.warn(error);

        // Add type to all nodes
        $.map(json.contracts, function(val, i) {
            val.type = TYPE_CONTRACT;
        });

        $.each(json.contracts, function(i, val) {
            var contractIndex = nodes.push(val) - 1;

            // Connect contracts and suppliers
            var suppliers = $.grep(nodes, function(n) { return (n.type === TYPE_COMPANY) && (val.suppliers.indexOf(n.id) > -1) } );
            $.each(suppliers, function(j, supplier) {
                var supplierIndex = nodes.indexOf(supplier);
                links.push({source: contractIndex, target: supplierIndex});
            });

            // Connect contracts and projects
            var projects = $.grep(nodes, function(n) { return (n.type === TYPE_PROJECT) && (val.projects.indexOf(n.id) > -1) } );
            $.each(projects, function(j, project) {
                var projectIndex = nodes.indexOf(project);
                links.push({source: contractIndex, target: projectIndex});
            });
        });

        restart();
    });

    // Load data from spreadsheet
    var spreadsheet = new Spreadsheet();

    var node = svg.selectAll(".node"),
        link = svg.selectAll(".link");

    function restart() {
        link = link.data(links)
            .enter().append("line")
            .attr("class", "link");

        node = node.data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("x", 0)
            .attr("y", 0)
            .call(force.drag);

        var circle = node.append("circle")
            .attr("r", nodeRAttr)
            .attr("fill", nodeFillAttr)
            .on("mouseover", nodeMouseOver)
            .on("mouseout", nodeMouseOut);

        node.append("text")
            .attr("dx", 20)
            .attr("dy", ".35em")
            .style("display", nodeDisplayStyle)
            .text(nodeText);

        node = svg.selectAll(".node"),
        link = svg.selectAll(".link");

        force.start();
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
                d3.select(this.parentNode).select("text").style({display: "none"});
        }
    }

    function nodeMouseOver(n) {
        switch (n.type) {
            case TYPE_PROJECT:
            case TYPE_COMPANY:
            case TYPE_CONTRACT:
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
        }

        return "";
    }

    function nodeRAttr(n) {
        switch (n.type) {
            case TYPE_OPIS:
                return 16;
        }

        return 8;
    }

    function nodeFillAttr(n, i) {
        return fill(n.type);
    }

    function onTick() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    //restart();
});