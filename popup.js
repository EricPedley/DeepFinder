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
                        response.map(function (element) { element["iteration"] = iterations });
                        console.log(response);
                        getRecursive(winhref, response, [winhref], wordRegex);
                        //processLinks(response, winhref, wordRegex, iterations, []);
                    });
            });
        }
    });
});


getRecursive = (winhref, untestedlist, testedlist, wordRegex) => {
    if (untestedlist.length > 0) {
        console.log("length greater than zero");
        let link = untestedlist.pop();
        let href = link.href;
        if (testedlist.indexOf(href) === -1) {
            console.log("got here");
            testedlist.push(href);
            console.log(testedlist);
            $.get(href,null, function (text) {
                console.log("got there");
                //do stuff to add keyword to popup html
                if (wordRegex.test(text)) {//if the website html contains the keyword
                    console.log("ok wtf");
                    document.getElementById("linksHolder").innerHTML += "<br> <a href = '" + link.href + "'>" + link.innerHTML + "</a> <br>";//add to html of popup
                }
                if (link.iteration > 1) {
                    let matches = text.matchAll(/<a.+?href="([^"]+)".*?>(.+?)<\/a>/sg);//regex tester: https://regex101.com/r/fMMH7H/1/
                    for (const match of matches) {
                        let newhref = processLink(match[1], winhref);
                        if (!newhref.includes("http")) {
                            newhref = winhref + newhref;
                        }
                        if (testedlist.indexOf(newhref) === -1)
                            untestedlist.push({ href: newhref, innerHTML: match[2] });
                    }
                    return getRecursive(href, untestedlist, testedlist, wordRegex);
                } else {
                    return getRecursive(winhref, untestedlist, testedlist, wordRegex);
                }
            }).fail(function(error) {
                console.log(error);
                return getRecursive(winhref, untestedlist, testedlist, wordRegex);
            });

        } else {
            return getRecursive(winhref, untestedlist, testedlist, wordRegex);
        }
    } else {
        return "finished recursing";
    }
}

function processLink(string, winhref) {//removes everything following a "#" in a string, including the "#" itself
    console.log(string + "|" + winhref);
    let i = string.indexOf("#");
    if (!string.includes("http")&&!string.includes("#")) {
        console.log("process link recursing");
        string = processLink(winhref,"") + string;
        console.log("doing my job");
        console.log(string);
    }
    if (string.charAt(string.length - 1) === "/") {
        string = string.substring(0, string.length - 1);
    }
    if (i === -1) {
        return string;
    } else {
        return string.substring(0, i);
    }
}