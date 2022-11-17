(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "I_was_satisfied_with_the_level_of_support_received_from_my_manager",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "What_could_we_have_done_differently_to_have_encouraged_you_to_stay_at_easyJet_",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "lastName",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "I_was_rewarded_fairly_for_my_role",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "Exit_Interview",
            alias: "Interview Questions",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };
	
	
	
    // Download the data
    myConnector.getData = function(table, doneCallback) {
	$.ajaxSetup({
            headers: {
                "Authorization": "Basic SVNVX1RhYmxlYXVfV2Vic2VydmljZTpoWGxUZWUwZVpTZkdMJE1l"
            }
        });
        $.getJSON("https://wd3-impl-services1.workday.com/ccx/service/customreport2/easyjet2/ISU_Tableau_Webservice/EJ_-_Exit_Interview_Questionnaire_Extract_-_RaaS_Test?format=json", function(resp) {
            var feat = resp.features,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "I_was_satisfied_with_the_level_of_support_received_from_my_manager": feat[i].I_was_satisfied_with_the_level_of_support_received_from_my_manager,
                    "What_could_we_have_done_differently_to_have_encouraged_you_to_stay_at_easyJet_": feat[i].What_could_we_have_done_differently_to_have_encouraged_you_to_stay_at_easyJet_,
                    "lastName": feat[i].lastName,
                    "I_was_rewarded_fairly_for_my_role": feat[i].I_was_rewarded_fairly_for_my_role
                });
            }
            // add the data 
            chunkData(table, tableData);
            doneCallback();
        });
    };

    // add the data in manageable chunks
    function chunkData(table, tableData){
       var row_index = 0;
       var size = 100;
       while (row_index < tableData.length){
            table.appendRows(tableData.slice(row_index, size + row_index));
            row_index += size;
            tableau.reportProgress("Getting row: " + row_index);
        }
    }

    tableau.registerConnector(myConnector);

     // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
