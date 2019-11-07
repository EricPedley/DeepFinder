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
                        //inhref = ("" + winhref).substring(0, winhref.indexOf("#"));
                        console.log("iterations: " + iterations);
                        processLinks(response, winhref, wordRegex, iterations);
                        // document.getElementById("putLinksHere1").innerHTML = "<center>Links Containing Keyword:</center>";
                        // let forEachRan = false;
                        // var winhref = response.pop();
                        // winhref = winhref.substring(0,winhref.indexOf("/",winhref.indexOf("//")+2));
                        // console.log(winhref);
                        // response.forEach(async function (link, index) {//this loop uses get method of jquery to get innerhtml of each link in the outer loop
                        //     forEachRan = true;
                        //     if (!link.href.includes("#") && !link.href.includes("mailto")) {
                        //             let wordRegex = new RegExp('(?<!<[^>]*)' + (wordsChecked? "\b"+search+"\b": search), (caseChecked ? "g" : "gi"));
                        //             $.get(link.href, null, function (text) {
                        //                 var docObj = $('<div></div>');//start of recursive step
                        //                 docObj.html(text);
                        //                 let links2 = $('a', docObj);
                        //                 console.log(links2);
                        //                 Array.from(links2).forEach(function(link2, index2) {
                        //                     let openableLink = winhref+link2.pathname;//link that is usable by the jquery get function
                        //                     if(!openableLink.includes("#") && !openableLink.includes("mailto")) {
                        //                         $.get(openableLink,null,function(text2) {
                        //                             if (null !== text2.match(wordRegex)) {
                        //                                 document.getElementById("putLinksHere2").innerHTML += "<br> <a id = 'link2" + index2 + "' href = '" + openableLink + "'>" + link2.innerHTML + "</a> <br>";
                        //                             }
                        //                         });
                        //                     }
                        //                 });//end of recursive step
                        //                 if (null !== text.match(wordRegex)) {
                        //                     document.getElementById("putLinksHere1").innerHTML += "<br> <a id = 'link" + index + "' href = '" + link.href + "'>" + link.innerHTML + "</a> <br>";
                        //                 }
                        //             });
                        //     }
                        // });
                        // if (!forEachRan)
                        //     document.getElementById("putLinksHere1").innerHTML = "<center>Keyword not found in links</center>";
                    });
            });
        }

    });
});
processLinks = (linkList, winhref, wordRegex, numIterations) => {//linklist is what the jquery selector for tags returned
    
    if (numIterations > 0) {
        console.log(numIterations);
        document.getElementById("linksHolder").innerHTML += "<br>BRuh work already smh</br>";
        let alreadyListed = [];
        Array.from(linkList).forEach(function (link, index) {//for each link on the page
            console.log(winhref);
            let linkNoHash = rmvHash(link.href);
            if (winhref !== linkNoHash) {
                $.get(link.href, null, function (text) {//get website html code as variable text
                    let noHash = rmvHash(link.href);//the link without the hash at the end and the stuff after
                    if (link.href != winhref && wordRegex.test(text) && !alreadyListed[noHash]) {//if the website html contains the keyword
                        alreadyListed[noHash] = true;
                        document.getElementById("linksHolder").innerHTML += "<br> <a id = 'link" + index + "' href = '" + link.href + "'>" + link.innerHTML + "</a> <br>";//add to html of popup
                    }
                    doc = document.implementation.createHTMLDocument("");
                    doc.open("replace");
                    doc.write(text);
                    doc.close();
                    let linkList2=doc.getElementsByTagName("a");
                    console.log(linkList2);
                    processLinks(linkList2, numIterations - 1);//take a recursive step using the list of all a tags from this page
                });
            }
        });



    }
};

function rmvHash(string) {//removes everything following a "#" in a string, including the "#" itself
    return string.substring(0, string.indexOf("#"));
}