var openedIDs = [];

function searchOnTab(searchTerm, tab) {
    chrome.tabs.executeScript(
        tab.id,
        {file:'content.js'},
        function(results) {
            chrome.tabs.sendMessage(tab.id,searchTerm);
        }
    );
};

$(document).ready(function () {
    $("#textbox").keypress(function (event) {
        if (event.keyCode === 13) {
            chrome.tabs.getSelected(null, function (tab) {
                let search = $("#textbox").val();
                searchOnTab(search,tab);
            });
        }
    });


});