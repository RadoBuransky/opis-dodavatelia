var TYPE_OPIS = "opis";
var TYPE_PROJECT = "project";

$(function(){
    var $container = $('#container'),
        width = $container.width(),
        height = $container.height();

    var fill = d3.scale.category20();

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
        .on("tick", onTick);

    var opisNode = {
        type: TYPE_OPIS,
        itms: "123",
        name: "aaa"
    };

    nodes.push(opisNode);

    d3.json("js/projects.json", function(error, json) {
        if (error) return console.warn(error);

        // Add type to all nodes
        $.map(json.nodes, function(val, i) {
            val.type = TYPE_PROJECT;
        });

        nodes.push.apply(nodes, json.nodes);
        restart();
    });

    var node = svg.selectAll(".node"),
        link = svg.selectAll(".link");

    function restart() {
        link = link.data(links)
            .enter().append("line")
            .attr("class", "link");

        node = node.data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        node.append("circle")
            .attr("r", nodeRAttr)
            .attr("fill", nodeFillAttr);

        node.append("text")
            .attr("dx", 20)
            .attr("dy", ".35em")
            .text(nodeText);

        force.start();
    }

    function nodeText(n) {
        switch (n.type) {
            case TYPE_OPIS:
                return "OPIS";
            case TYPE_PROJECT:
                return n.itms;
        }

        return "";
    }

    function nodeRAttr(n) {
        switch (n.type) {
            case TYPE_OPIS:
                return 16;
            case TYPE_PROJECT:
                return 8;
        }

        return 4.5;
    }

    function nodeFillAttr(n, i) {
        switch (n.type) {
            case TYPE_OPIS:
                return fill(TYPE_OPIS);
            case TYPE_PROJECT:
                return fill(TYPE_PROJECT);
        }

        return fill("");
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