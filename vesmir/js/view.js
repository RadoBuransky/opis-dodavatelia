function View() {
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