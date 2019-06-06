
var results;
$(document).ready(function() {
    $("#textbox").keydown(function(event) {
        if (event.keyCode === 13) {
            chrome.tabs.getCurrent(function(tab) {
                chrome.tabs.executeScript(
                    tab,
                    {code: 'var x=document.getElementsByTagName("html")[0].innerText; x',},
                    function(r) {
                        results=r;
                        let search = $("#textbox").val();
                        let replacement = "<span style='background-color:yellow'>"+search+"</span>";
                        let replaced = (""+results).replace(new RegExp(search,"g"),replacement);
                        chrome.tabs.executeScript(
                            tab,
                            {code: 'document.getElementsByTagName("html")[0].innerText='+
                                    replaced+';'}
                        );
                        document.write(replaced);
                    }
                );
            });
            // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            //     chrome.tabs.executeScript(
            //         tabs[0].id,
            //         {code: 'console.log(document.getElementsByTagName("html")[0].innerText);'});
            //   });
        }
    });
    

});