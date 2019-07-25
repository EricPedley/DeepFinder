$(document).ready(function () {
    $("#textbox").keypress(function (event) {
        if (event.keyCode === 13) {
            let search = $("#textbox").val();
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, 
                    { greeting: search,
                      checkboxStatus: document.getElementById("case").checked 
                      color: document.getElementById("color").value}, function (response) {
                    console.log(response);
                    document.getElementById("putLinksHere").innerHTML = "<center>Links Containing Keyword:</center>";
                    let forEachRan = false;
                    response.forEach(function (linkItem,index) {
                        forEachRan=true;
                        document.getElementById("putLinksHere").innerHTML += "<a id = 'link"+index+"' href = '"+linkItem+"'>"+linkItem+"</a><br>";
                        $("#link"+index).on('click',function() {
                            window.open(linkItem);
                            console.log("onclick event fired for "+index);
                        });
                    });
                    if(!forEachRan)
                        document.getElementById("putLinksHere").innerHTML = "<center>Keyword not found in links</center>";
                });
            });
        }

    });
});