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
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        searchTerm: search,
                        checkboxStatus: [caseChecked,wordsChecked],
                        color: document.getElementById("color").style.backgroundColor
                    },
                    function (response) {//response is an array containing the hrefs and innerhtmls of all the links on the page
                        document.getElementById("putLinksHere1").innerHTML = "<center>Links Containing Keyword:</center>";
                        let forEachRan = false;
                        var winhref = response.pop();
                        winhref = winhref.substring(0,winhref.indexOf("/",winhref.indexOf("//")+2));
                        console.log(winhref);
                        response.forEach(async function (link, index) {//this loop uses get method of jquery to get innerhtml of each link in the outer loop
                            forEachRan = true;
                            if (!link.href.includes("#") && !link.href.includes("mailto")) {
                                    let wordRegex = new RegExp('(?<!<[^>]*)' + (wordsChecked? "\b"+search+"\b": search), (caseChecked ? "g" : "gi"));
                                    $.get(link.href, null, function (text) {
                                        var docObj = $('<div></div>');//start of recursive step
                                        docObj.html(text);
                                        let links2 = $('a', docObj);
                                        console.log(links2);
                                        Array.from(links2).forEach(function(link2, index2) {
                                            let openableLink = winhref+link2.pathname;
                                            if(!openableLink.includes("#") && !openableLink.includes("mailto")) {
                                                $.get(openableLink,null,function(text2) {
                                                    if (null !== text2.match(wordRegex)) {
                                                        document.getElementById("putLinksHere2").innerHTML += "<br> <a id = 'link2" + index2 + "' href = '" + openableLink + "'>" + link2.innerHTML + "</a> <br>";
                                                    }
                                                });
                                            }
                                        });//end of recursive step
                                        if (null !== text.match(wordRegex)) {
                                            document.getElementById("putLinksHere1").innerHTML += "<br> <a id = 'link" + index + "' href = '" + link.href + "'>" + link.innerHTML + "</a> <br>";
                                        }
                                    });
                            }
                        });
                        if (!forEachRan)
                            document.getElementById("putLinksHere1").innerHTML = "<center>Keyword not found in links</center>";
                    });
            });
        }

    });
});
processLinks = (linkList, numIterations) => {//linklist is what the jquery selector for tags returned
    if(numIterations>0) {
        let linkList2=[];
        $('#linksHolder').innerHTML+='<div id = ">'
        Array.from(linkList).forEach(function(link,index) {
            $.get(winhref+link2.pathname,null,function(text){
                let wordRegex = new RegExp('(?<!<[^>]*)' + (wordsChecked? "\b"+search+"\b": search), (caseChecked ? "g" : "gi"));
                if(null!==text.matches(wordRegex)){
                    //add link to list
                }
                var docObj = $('<div></div>');//start of recursive step
                docObj.html(text);
                processLinks($('a', docObj),numIterations-1);
            });
        });
        
    
    
        return linkList2;
    }
};