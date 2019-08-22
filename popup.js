$(document).ready(function () {
    $('body').on('click', 'a', function () {
        chrome.tabs.create({ url: $(this).attr('href') });
        return false;
    });
    $("#textbox").keypress(function (event) {
        if (event.keyCode === 13) {
            let search = $("#textbox").val();
            var caseChecked = document.getElementById("case").checked;
            var wordsChecked = document.getElementById("words").checked;
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        searchTerm: search,
                        checkboxStatus: [caseChecked,wordsChecked],
                        color: document.getElementById("color").style.backgroundColor
                    },
                    function (response) {
                        document.getElementById("putLinksHere").innerHTML = "<center>Links Containing Keyword:</center>";
                        let forEachRan = false;
                        var winhref = response.pop();
                        response.forEach(async function (link, index) {
                            forEachRan = true;
                            if (!link.href.includes("#") && !link.href.includes("mailto")) {
                                    var regex = new RegExp('(?<!<[^>]*)' + (wordsChecked? "\b"+search+"\b": search), (caseChecked ? "g" : "gi"))
                                    $.get(link.href, null, function (text) {
                                        if (null !== text.match(regex)) {
                                            document.getElementById("putLinksHere").innerHTML += "<br> <a id = 'link" + index + "' href = '" + link.href + "'>" + link.innerHTML + "</a> <br>";
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