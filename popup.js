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
            try {
                $.get(href, null, function (text) {
                    console.log("got there");
                    //do stuff to add keyword to popup html
                    if (wordRegex.test(text)) {//if the website html contains the keyword
                        console.log("ok wtf");
                        document.getElementById("linksHolder").innerHTML += "<br> <a href = '" + link.href + "'>" + link.innerHTML + "</a> <br>";//add to html of popup
                    }
                    if (link.iteration > 1) {
                        let matches = text.matchAll(/<a.+?href="([^"]+)".*?>(.+?)<\/a>/sg);//regex tester: https://regex101.com/r/fMMH7H/1/
                        for (const match of matches) {
                            let newhref = processLink(match[1]);
                            if(!newhref.includes("http")) {
                                newhref=winhref+newhref;
                            }
                            if (testedlist.indexOf(newhref) === -1) 
                                untestedlist.push({ href: newhref, innerHTML: match[2] });
                        }
                        getRecursive(href, untestedlist, testedlist, wordRegex);
                    } else {
                        getRecursive(winhref, untestedlist, testedlist, wordRegex);
                    }
                });
            } catch (err) {
                console.log("caught an error!");
                getRecursive(href, untestedlist, testedlist, wordRegex);
            }
        } else {
            getRecursive(winhref, untestedlist, testedlist, wordRegex);
        }
    }
}



processLinks = (linkList, winhref, wordRegex, numIterations, alreadyOpened) => {//linklist is what the jquery selector for tags returned

    if (numIterations > 0) {
        //console.log(numIterations);
        document.getElementById("linksHolder").innerHTML += "<br>Links from iteration " + numIterations + " at " + winhref + "</br>";
        Array.from(linkList).forEach(function (link, index) {//for each link on the page
            //console.log(winhref);
            let linkNoHash = processLink(link.href);//one of the links on the page
            if (winhref !== linkNoHash && !linkNoHash.includes("mailto") && !alreadyOpened.includes(linkNoHash)) {//tests whether to consider opening this link on the open page
                if (!link.href.includes("http")) {
                    link.href = winhref + link.href;
                }
                $.get(link.href, null, function (text) {//get website html code as variable text
                    alreadyOpened.push(link.href);
                    let noHash = processLink(link.href);//the link being opened from the webpage without the hash at the end and the stuff after
                    //console.log(noHash+"is getting a get request from" + winhref + "on recursive iteration" + numIterations +", index "+index);
                    if (wordRegex.test(text)) {//if the website html contains the keyword
                        document.getElementById("linksHolder").innerHTML += "<br> <a id = 'link" + index + "' href = '" + link.href + "'>" + link.innerHTML + "</a> <br>";//add to html of popup
                    }
                    let linkList2 = [];
                    let matches = text.matchAll(/<a.+?href="([^"]+)".*?>(.+?)<\/a>/sg);//regex tester: https://regex101.com/r/fMMH7H/1/
                    for (const match of matches) {
                        linkList2.push({ href: match[1], innerHTML: match[2] });
                    }
                    //console.log(linkList2);
                    console.log(alreadyOpened);
                    processLinks(linkList2, linkNoHash, wordRegex, numIterations - 1, alreadyOpened);//take a recursive step using the list of all a tags from this page
                });
            }
        });



    }
};

function processLink(string) {//removes everything following a "#" in a string, including the "#" itself
	let i = string.indexOf("#");
	if (!string.includes("http")) {
		string = processLink(window.location.href) + string;
		console.log("doing my job");
		console.log(string);
	}
	if(string.charAt(string.length-1)==="/") {
		string=string.substring(0,string.length-1);
	}
	if (i === -1) {
		return string
	} else {
		return string.substring(0, i);
	}
}