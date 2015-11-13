function View() {
    handleShowCheckboxClick("project");
    handleShowCheckboxClick("contract");
    handleShowCheckboxClick("company");
    handleShowCheckboxClick("institution");

    function handleShowCheckboxClick(name) {
        $("#show-" + name).click(function() {
            $(".node-" + name + " text").toggle();
        });
    }
}