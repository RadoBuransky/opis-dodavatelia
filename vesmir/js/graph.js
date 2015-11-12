$(function(){
    var $container = $('.container'),
        width = $container.width(),
        height = $container.height();

    var fill = d3.scale.category20();

    var force = d3.layout.force()
        .size([width, height])
        .nodes([]) // initialize with a single node
        .linkDistance(100)
        .charge(-300)
        .gravity(0.1)
        .on("tick", tick);

    var svg = d3.select(".container").append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
        .attr('viewBox','0 0 '+width+' '+height)
        .attr('preserveAspectRatio','xMinYMin');

    svg.append("rect")
        .attr("width", width)
        .attr("height", height);

    var nodes = force.nodes(),
        links = force.links(),
        node = svg.selectAll(".node"),
        link = svg.selectAll(".link");

    n1 = {x: 10, y: 10};
    n2 = {x: 10, y: 20};
    n3 = {x: 30, y: 20};
    nodes.push(n1, n2, n3);
    links.push({source: n1, target: n2});
    links.push({source: n1, target: n3});

    restart();

    function tick() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

    function restart() {
      link = link.data(links);

      link.enter().insert("line", ".node")
          .attr("class", "link");

      node = node.data(nodes);

      node.enter().insert("circle", ".cursor")
          .attr("class", "node")
          .attr("r", 5);

      force.start();
    }
});