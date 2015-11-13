function View() {
    var selected = null;

    handleShowCheckboxClick("project");
    handleShowCheckboxClick("contract");
    handleShowCheckboxClick("company");
    handleShowCheckboxClick("institution");

    $("#hide-all").click(function() {
        $("#show-project").attr("checked", false);
        $("#show-contract").attr("checked", false);
        $("#show-company").attr("checked", false);
        $("#show-institution").attr("checked", false);

        updateView(this);
    });

    this.selectNode = function(node) {
        selected = node;
        updateView(this);
    }

    function handleShowCheckboxClick(name) {
        $("#show-" + name).click(function() {
            updateView();
        });
    }

    function updateView(view) {
        showHideText("project");
        showHideText("contract");
        showHideText("company");
        showHideText("institution");

        showSelected();

        function showSelected() {
            if (selected != null) {
                showNode(selected.id);
                $.each(selected.adjacent(), function(i, val) {
                    showNode(val.id);
                });
            }

            function showNode(id) {
                if (id == "opis")
                    return;

                $("#" + id + " text").show();
                $("#" + id + " circle").css("r", View.prototype.SELECTED_R);
            }
        }

        function showHideText(name) {
            var isVisible = $("#show-" + name).is(":checked");
            $(".node-" + name + " text").toggle(isVisible);

            var r = 15;
            if (isVisible)
                r = View.prototype.SELECTED_R;

            $(".node-" + name + " circle").css("r", r);
        }
    }
}

View.prototype = {
    SELECTED_R: 30
}