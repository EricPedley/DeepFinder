
$(document).ready(function () {

    // chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //     if (changeInfo.status == 'complete') {
    //         chrome.tabs.executeScript(
    //             tabId,
    //             { file: 'content.js' }
    //         );

    //     }
    // });

    $("#textbox").keypress(function (event) {
        if (event.keyCode === 13) {
            let search = $("#textbox").val();
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { greeting: search }, function (response) {
                    if ("response" in window)
                        console.log(response.ey);
                    else {
                        chrome.tabs.executeScript(
                            tabs[0].id,
                            { file: 'content.js' },
                            function () {
                                chrome.tabs.sendMessage(tabs[0].id, { greeting: search }, function (response) {
                                    console.log(response.ey);
                                });
                            }
                        );
                    }
                });
            });
        }

    });


});