
$(document).ready(function () {
    $("#textbox").keypress(function (event) {
        if (event.keyCode === 13) {
            let search = $("#textbox").val();
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { greeting: search }, function (response) {
                    if ("response" in window)
                        console.log(response);
                    else {
                        console.log("no response");
                        // chrome.tabs.executeScript(
                        //     tabs[0].id,
                        //     { file: 'content.js' },
                        //     function () {
                        //         chrome.tabs.sendMessage(tabs[0].id, { greeting: search }, async function (response) {
                        //             console.log(response);
                        //         });
                        //     }
                        // );
                    }
                });
            });
        }

    });
});