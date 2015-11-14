// Loads data from Google spreadsheet.
function Spreadsheet(onLoaded) {
    var SPREADSHEET_KEY = "1TAVF5meqnFLqwNlttUj1cLEP4WmLzpO_DWyYCWudctM";

    function loadSheets(spreadsheet, documentKey) {
        var SHEET_COUNT = 5;
        var loadedSheetCount = 0;
        for (i = 1; i <= SHEET_COUNT; i++) {
            loadSheet(spreadsheet, documentKey, i).then(function() {
                loadedSheetCount += 1;
                if (loadedSheetCount == SHEET_COUNT) {
                    processLoadedData(spreadsheet);
                    onLoaded(spreadsheet);
                }
            })
        }
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

        $.each(spreadsheet.tenders, function(i, c) {
            c.winners = [];
            if (c.winner1Id != null)
                c.winners.push(c.winner1Id);
            if (c.winner2Id != null)
                c.winners.push(c.winner2Id);
            if (c.winner3Id != null)
                c.winners.push(c.winner3Id);
            if (c.winner4Id != null)
                c.winners.push(c.winner4Id);
            if (c.winner5Id != null)
                c.winners.push(c.winner5Id);

            delete c.winner1Id;
            delete c.winner2Id;
            delete c.winner3Id;
            delete c.winner4Id;
            delete c.winner5Id;
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