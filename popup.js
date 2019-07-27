$(document).ready(function () {
    $("#textbox").keypress(function (event) {
        if (event.keyCode === 13) {
            let search = $("#textbox").val();
            var checked = document.getElementById("case").checked;
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        greeting: search,
                        checkboxStatus: checked,
                        color: document.getElementById("color").style.backgroundColor
                    },
                    function (response) {
                        console.log(response);
                        document.getElementById("putLinksHere").innerHTML = "<center>Links Containing Keyword:</center>";
                        let forEachRan = false;
                        var winhref = response.pop();
                        response.forEach(async function (link, index) {
                            forEachRan=true;
                            if (!link.includes("#")) {

                                console.log(link);
                                var regex = new RegExp('(?<!<[^>]*)' + search, (checked ? "g" : "gi"))
                                $.get(link, null, function (text) {
                                    if (null !== text.match(regex)) {
                                        document.getElementById("putLinksHere").innerHTML += "<br> <a id = 'link" + index + "' href = '" + link + "'>" + link + "</a> <br>";
                                    }
                                });
                            }
                        });
                        if (!forEachRan)
                            document.getElementById("putLinksHere").innerHTML = "<center>Keyword not found in links</center>";
                    });
            });
        }

    });
});