
$(document).ready(function () {

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            chrome.tabs.executeScript(
                tabId,
                { file: 'content.js' }
            );

        }
    });

    $("#textbox").keypress(function (event) {
        if (event.keyCode === 13) {
            let search = $("#textbox").val();
            chrome.tabs.getSelected(null, function (tab) {
                chrome.tabs.sendMessage(tab.id, search);
            });
        }
    });


});