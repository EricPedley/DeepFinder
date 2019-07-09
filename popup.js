$(document).ready(function () {
    $("#textbox").keypress(function (event) {
        if (event.keyCode === 13) {
            let search = $("#textbox").val();
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { greeting: search }, function (response) {
                    console.log(response);
                    response.forEach(function (linkItem,index) {
                        document.getElementById("putLinksHere").innerHTML += "<a id = 'link"+index+"' href = '"+linkItem+"'>"+linkItem+"</a><br>";
                        $("#link"+index).on('click',function() {
                            window.open(linkItem);
                            console.log("onclick event fired for "+index);
                        });
                    });
                });
            });
        }

    });
});