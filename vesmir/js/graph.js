function Graph(containerId) {
    var nodes = [],
        node = [],
        links = [],
        link = [],
        svg = {},
        force = {},
        model = new Model(),
        modelController = new ModelController(),
        view = new View();

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
        tendersToGraph(model.tenders);
        subcontractorsToGraph(model.subcontractors);

        // Define adjacent function for all nodes
        $.each(nodes, function(i, n) {
            n.adjacent = function() {
                var result = [];
                $.each(links, function(i, val) {
                    var other = null;
                    if (val.source.index == n.index)
                        other = val.target;
                    else
                        if (val.target.index == n.index)
                            other = val.source;

                    if (other != null)
                        result.push(other);
                });

                return result;
            };
        })

        node = svg.selectAll(".node");
        link = svg.selectAll(".link");

        restart();

        function subcontractorsToGraph(subcontractors) {
            $.each(subcontractors, function(i, subcontractor) {
                var subcontractorIndex = findById(subcontractor.subcontractorId);
                connectToCompanies(subcontractorIndex, [subcontractor.forCompanyId] );
            });
        }

        function tendersToGraph(tenders) {
            $.each(tenders, function(i, tender) {
                var tenderIndex = nodes.push(tender) - 1;

                connectToProjects(tenderIndex, tender.projectId);
                connectToCompanies(tenderIndex, tender.winners);
                connectToInstitution(tenderIndex, tender.institutionId);
            });
        }

        function contractsToGraph(contracts) {
            $.each(contracts, function(i, val) {
                var contractIndex = nodes.push(val) - 1;

                // Connect contracts and suppliers
                connectToCompanies(contractIndex, val.companies);

                // Connect contracts and projects
                connectToProjects(contractIndex, val.projectId);

                // Connect contracts and institutions
                connectToInstitution(contractIndex, val.institutionId);
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

        function findById(id) {
            var result = $.grep(nodes, function(n) { return (n.id == id); });
            if (result == null)
                return -1;
            return nodes.indexOf(result[0]);
        }

        function connectToInstitution(index, institutionId) {
            var institutions = $.grep(nodes, function(n) { return (n.type === model.TYPE_INSTITUTION) && (institutionId.indexOf(n.id) > -1) } );
            $.each(institutions, function(j, institution) {
                var institutionIndex = nodes.indexOf(institution);
                links.push({source: index, target: institutionIndex});
            });
        }

        function connectToProjects(index, projectId) {
            var projects = $.grep(nodes, function(n) { return (n.type === model.TYPE_PROJECT) && (projectId == n.id) } );
            $.each(projects, function(j, project) {
                var projectIndex = nodes.indexOf(project);
                links.push({source: index, target: projectIndex});
            });
        }

        function connectToCompanies(index, companyIds) {
            var suppliers = $.grep(nodes, function(n) { return (n.type === model.TYPE_COMPANY) && (companyIds.indexOf(n.id) > -1) } );
            $.each(suppliers, function(j, supplier) {
                var supplierIndex = nodes.indexOf(supplier);
                links.push({source: index, target: supplierIndex});
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
            .attr("id", nodeId)
            .call(force.drag)
            .on("click", function(node) {
                modelController.showInfo(node, model);
                view.selectNode(node);
            });

        var circle = node.append("circle")
            .attr("r", view.SELECTED_R);

        node.append("text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(nodeText);

        node = svg.selectAll(".node"),
        link = svg.selectAll(".link");

        force.start();
    }

    function nodeId(n) {
        return n.id;
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

            case model.TYPE_TENDER:
                specific = "node-tender";
                break;
        }

        return "node " + specific;
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
            case model.TYPE_TENDER:
                return formatter.format(n.finalPriceEur);
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