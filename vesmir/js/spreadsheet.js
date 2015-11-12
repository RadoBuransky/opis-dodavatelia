function Spreadsheet() {
    var SPREADSHEET_KEY = "1TAVF5meqnFLqwNlttUj1cLEP4WmLzpO_DWyYCWudctM";

    function loadSheets(spreadsheet, documentKey) {
        function load3() { return loadSheet(spreadsheet, documentKey, 3); }
        function load2(data, textStatus, jqXHR) { return loadSheet(spreadsheet, documentKey, 2); }
        function load1(data, textStatus, jqXHR) { return loadSheet(spreadsheet, documentKey, 1); }
        function ready(data, textStatus, jqXHR) { console.log(spreadsheet); }

        load3()
            .then(load2)
            .then(load1)
            .then(ready);
    }

    function loadSheet(spreadsheet, documentKey, sheetIndex) {
        return getSheet(documentKey, sheetIndex, function(response) {
            var COLUMN_INDEX_NAME = [];

            var data = spreadsheet[response.feed.title.$t] = {};
                        console.log(sheetIndex);

            $.each(response.feed.entry, function(i, e) {
                if (e.gs$cell.row == 1) {
                    COLUMN_INDEX_NAME[e.gs$cell.col] = e.content.$t;
                }
                else {
                    var index = e.gs$cell.row - 2;
                    if (data[index] == null) {
                        data[index] = {};
                    }
                    data[index][COLUMN_INDEX_NAME[e.gs$cell.col]] = e.content.$t;
                }
            });
        });
    }

    function loadContracts(documentKey) {
        loadSheet(documentKey, 1, function(response) {
            //console.log(response);
        });
    }

    function getSheet(documentKey, sheetIndex, onSuccess) {
        return $.ajax({
            url: "https://spreadsheets.google.com/feeds/cells/" + documentKey + "/" + sheetIndex + "/public/values?alt=json-in-script",
            jsonp: "callback",
            dataType: "jsonp",
            success: onSuccess
        });
    }

    loadSheets(this, SPREADSHEET_KEY);
}