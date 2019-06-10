
var results;
$(document).ready(function() {
    $("#textbox").keydown(function(event) {
        if (event.keyCode === 13) {
            chrome.tabs.getSelected(null,function(tab) {
                chrome.tabs.executeScript(
                    tab.id,
                    {code: 'var x=document.getElementsByTagName("html")[0].innerText; x',},
                    function(r) {
                        results=r;
                        let search = $("#textbox").val();
                        let replacement = "<span style='background-color:yellow'>"+search+"</span>";
                        let replaced = (""+results).replace(new RegExp(search,"g"),replacement);
                        chrome.tabs.executeScript(
                            tab.id,
                            {file:'content.js'}
                        );
                        chrome.tabs.sendMessage(tab.id,replaced);
                    }
                );
            });
        }
    });
    

});