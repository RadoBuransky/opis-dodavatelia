// Loads data from Google spreadsheet.
function Spreadsheet(onLoaded) {
    var SPREADSHEET_KEY = "1TAVF5meqnFLqwNlttUj1cLEP4WmLzpO_DWyYCWudctM";

    function loadSheets(spreadsheet, documentKey) {
        function load3() { return loadSheet(spreadsheet, documentKey, 3); }
        function load2(data, textStatus, jqXHR) { return loadSheet(spreadsheet, documentKey, 2); }
        function load1(data, textStatus, jqXHR) { return loadSheet(spreadsheet, documentKey, 1); }
        function ready(data, textStatus, jqXHR) {
            processLoadedData(spreadsheet);
            onLoaded(spreadsheet);
        }

        load3()
            .then(load2)
            .then(load1)
            .then(ready);
    }

    function processLoadedData(spreadsheet) {
        $.each(spreadsheet.contracts, function(i, c) {
            c.companies = [];
            if (c.company1Id != null)
                c.companies.push(c.company1Id);
            if (c.company2Id != null)
                c.companies.push(c.company2Id);
            if (c.company3Id != null)
                c.companies.push(c.company3Id);
            if (c.company4Id != null)
                c.companies.push(c.company4Id);
            if (c.company5Id != null)
                c.companies.push(c.company5Id);

            delete c.company1Id;
            delete c.company2Id;
            delete c.company3Id;
            delete c.company4Id;
            delete c.company5Id;
        });
    }

    function loadSheet(spreadsheet, documentKey, sheetIndex) {
        return getSheet(documentKey, sheetIndex, function(response) {
            var COLUMN_INDEX_NAME = [];
            var data = spreadsheet[response.feed.title.$t] = [];

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