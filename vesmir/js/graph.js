var TYPE_OPIS = "opis";

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

    //
//    d3.json("js/projects.json", function(error, json) {
//        if (error) return console.warn(error);
//
//        force
//          .nodes(json.nodes)
//          .links(json.links)
//          .start();
//
//        var link = svg.selectAll(".link")
//            .data(json.links)
//            .enter().append("line")
//            .attr("class", "link");
//
//        var node = svg.selectAll(".node")
//            .data(json.nodes)
//            .enter().append("g")
//            .attr("class", "node")
//            .call(force.drag);
//
//        node.append("circle")
//            .attr("r", 4.5);
//
//        node.append("text")
//            .attr("dx", 12)
//            .attr("dy", ".35em")
//            .text(function(project) { return project.itms + ": " + project.name });
//
//        force.on("tick", function() {
//            link.attr("x1", function(d) { return d.source.x; })
//                .attr("y1", function(d) { return d.source.y; })
//                .attr("x2", function(d) { return d.target.x; })
//                .attr("y2", function(d) { return d.target.y; });
//
//            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
//        });
//    });

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
            .attr("r", nodeRAttr);

        node.append("text")
            .attr("dx", 20)
            .attr("dy", ".35em")
            .text(nodeText);

        force.start();
    }

    function nodeText(n) {
        switch (n.type) {
            case TYPE_OPIS :
                return "OPIS";
                break;
        }

        return "";
    }

    function nodeRAttr(n) {
        switch (n.type) {
            case TYPE_OPIS :
                return 16;
                break;
        }


        return 4.5;
    }

    function onTick() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    restart();
});