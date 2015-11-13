function ModelController() {
    $(".info-content").hide();
}

ModelController.prototype.showInfo = function(node, model) {
    $(".info-content").hide();
    $("#info-" + node.type).show();

    switch (node.type) {
        case Model.prototype.TYPE_PROJECT:
            ModelController.prototype.projectToView(node);
            break;
        case Model.prototype.TYPE_COMPANY:
            ModelController.prototype.companyToView(node);
            break;
        case Model.prototype.TYPE_CONTRACT:
            ModelController.prototype.contractToView(node, model);
            break;
        case Model.prototype.TYPE_INSTITUTION:
            ModelController.prototype.institutionToView(node);
            break;
    }
}

ModelController.prototype.institutionToView = function(institution) {
    $("#info-institution-name h2").text(institution.name);
}

ModelController.prototype.companyToView = function(company) {
    $("#info-company-name h2").text(company.name);
}

ModelController.prototype.contractToView = function(contract, model) {
    var parent = $("#info-contract");
    $("h2", parent).text(contract.name);
    $("#info-contract-price", parent).text(ModelController.prototype.priceEurToView(contract.priceEur));
    $("#info-contract-link", parent).text(contract.link).attr("href", contract.link);

    $.each(model.institutions, function(i, val) {
        if (val.id == contract.institutionId) {
            $("#info-contract-institution", parent).text(val.name);
        }
    });

    var companiesUl = $("#info-contract-companies", parent);
    companiesUl.empty();
    $.each(model.companies, function(i, val) {
        if (contract.companies.indexOf(val.id) > -1) {
            companiesUl.append("<li>" + val.name + "</li>");
        }
    });
}

ModelController.prototype.projectToView = function(project) {
    var parent = $("#info-project");
    $("h2", parent).text(project.name);
    $("#info-project-itms", parent).text(project.id);
    $("#info-project-link", parent).text(project.link).attr("href", project.link);
}

ModelController.prototype.priceEurToView = function(priceEur) {
    var formatter = new Intl.NumberFormat('sk-SK', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
    });

    return formatter.format(priceEur);
}