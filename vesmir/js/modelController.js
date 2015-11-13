function ModelController() {
    $(".info-content").hide();
}

ModelController.prototype.showInfo = function(node) {
    $(".info-content").hide();
    $("#info-" + node.type).show();

    switch (node.type) {
        case Model.prototype.TYPE_PROJECT:
            ModelController.prototype.projectToView(node);
            break;
        case Model.TYPE_COMPANY:
            break;
        case Model.TYPE_CONTRACT:
            break;
        case Model.TYPE_INSTITUTION:
            break;
    }
}

ModelController.prototype.projectToView = function(project) {
    var parent = $("#info-project");
    $("h2", parent).text(project.name);
    $("#info-project-itms", parent).text(project.id);
    $("#info-project-link", parent).text(project.link).attr("href", project.link);
}