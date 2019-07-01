var openedIDs = [];

function searchOnTab(searchTerm, tab) {//sends messasge to tab and if the listener isn't there it adds the listener and sends the message again 
    // chrome.tabs.sendMessage(tab.id,searchTerm,function(response){
    //     if(!response){
    //         chrome.tabs.executeScript(
    //             tab.id,
    //             {file:'content.js'},
    //             function(){
    //                 chrome.tabs.sendMessage(tab.id,searchTerm);
    //             }
    //         );
    //     }
    // });
    
};

$(document).ready(function () {
    chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.executeScript(
            tab.id,
            {file:'content.js'}
        );
    });
    $("#textbox").keypress(function (event) {
        if (event.keyCode === 13) {
            chrome.tabs.getSelected(null, function (tab) {
                let search = $("#textbox").val();
                chrome.tabs.sendMessage(tab.id,search);
            });
        }
    });


});