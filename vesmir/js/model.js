function Model() {
    this.TYPE_OPIS = "opis";
    this.TYPE_PROJECT = "project";
    this.TYPE_COMPANY = "company";
    this.TYPE_CONTRACT = "contract";
    this.TYPE_INSTITUTION = "institution";

    this.projects = [];
    this.contracts = [];
    this.institutions = [];
    this.companies = [];
}

Model.prototype = {
    TYPE_OPIS: "opis",
    TYPE_PROJECT: "project",
    TYPE_COMPANY: "company",
    TYPE_CONTRACT: "contract",
    TYPE_INSTITUTION: "institution",
    loadFromSpreadsheet: function(onReady) {
        var model = this;

        // Load data from spreadsheet
        new Spreadsheet(function(spreadsheet) {
            copyAndType(spreadsheet.projects, model.projects, model.TYPE_PROJECT);
            copyAndType(spreadsheet.companies, model.companies, model.TYPE_COMPANY);
            copyAndType(spreadsheet.institutions, model.institutions, model.TYPE_INSTITUTION);
            copyAndType(spreadsheet.contracts, model.contracts, model.TYPE_CONTRACT);

            onReady(model);
        });

        function copyAndType(src, dst, type) {
            //Add type to all nodes
            $.each(src, function(i, val) {
                val.type = type;
                dst.push(val);
            });
        }
    }
}