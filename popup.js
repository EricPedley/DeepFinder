
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
    
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
      chrome.tabs.executeScript(
        tabId,
        { file: 'content.js' }
    );
  
    }
  })
        // chrome.tabs.getSelected(null, function (tab) {
        //     chrome.tabs.executeScript(
        //         tab.id,
        //         { file: 'content.js' }
        //     );
        // });
    
    $("#textbox").keypress(function (event) {
        if (event.keyCode === 13) {
            let search = $("#textbox").val();
            chrome.tabs.getSelected(null, function(tab) {
                alert("message sent");
                chrome.tabs.sendMessage(tab.id,search);
            });
        }
    });


});