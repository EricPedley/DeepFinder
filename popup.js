$(document).ready(function () {

    $('body').on('click', 'a', function () {//makes all a tags open new tab when clicked on
        chrome.tabs.create({ url: $(this).attr('href') });
        return false;
    });
    $("#textbox").keypress(function (event) {
        if (event.keyCode === 13) {
            let search = $("#textbox").val();
            var caseChecked = document.getElementById("case").checked;
            var wordsChecked = document.getElementById("words").checked;
            var iterations = document.getElementById("recursionNum").value;
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        searchTerm: search,
                        checkboxStatus: [caseChecked, wordsChecked],
                        color: document.getElementById("color").style.backgroundColor
                    },
                    function (response) {//response is an array containing the hrefs and innerhtmls of all the links on the page
                        let wordRegex = new RegExp('(?<!<[^>]*)' + (wordsChecked ? "\b" + search + "\b" : search), (caseChecked ? "g" : "gi"));
                        let winhref = response.pop();
                        console.log("iterations: " + iterations);
                        processLinks(response, winhref, wordRegex, iterations);
                    });
            });
        }

    });
});
processLinks = (linkList, winhref, wordRegex, numIterations) => {//linklist is what the jquery selector for tags returned
    
    if (numIterations > 0) {
        console.log(numIterations);
        document.getElementById("linksHolder").innerHTML += "<br>BRuh work already smh</br>";
        let alreadyTested = [];
        Array.from(linkList).forEach(function (link, index) {//for each link on the page
            console.log(winhref);
            let linkNoHash = rmvHash(link.href);
            if (winhref !== linkNoHash) {
                $.get(link.href, null, function (text) {//get website html code as variable text
                    let noHash = rmvHash(link.href);//the link without the hash at the end and the stuff after
                    console.log("get called"+noHash);
                    if(alreadyTested[noHash]) {//if this link has already been gone over don't do it again
                        return;
                    }
                    if (link.href != winhref && wordRegex.test(text)) {//if the website html contains the keyword
                        document.getElementById("linksHolder").innerHTML += "<br> <a id = 'link" + index + "' href = '" + link.href + "'>" + link.innerHTML + "</a> <br>";//add to html of popup
                    }
                    alreadyTested[noHash]=true;
                    let linkList2 = [];
                    let matches = text.matchAll(/<a.+?href="([^"]+)".*?>(.+?)<\/a>/sg);//regex tester: https://regex101.com/r/fMMH7H/1/
                    for(const match of matches) {
                        linkList2.push({href: match[1], innerHTML: match[2]});
                    }
                    console.log(linkList2);
                    processLinks(linkList2, winhref, wordRegex, numIterations - 1);//take a recursive step using the list of all a tags from this page
                });
            }
        });



    }
};

function rmvHash(string) {//removes everything following a "#" in a string, including the "#" itself
    return string.substring(0, string.indexOf("#"));
}