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
                    doLinks
                );
            });
        }

    });
});
processLinks = (linkList, numIterations) => {//linklist is what the jquery selector for tags returned
    if(numIterations>0) {
        let linkList2=[];
        $('#linksHolder').innerHTML+='<div>'
        Array.from(linkList).forEach(function(link,index) {
            $.get(winhref+link2.pathname,null,function(text){
                let wordRegex = new RegExp('(?<!<[^>]*)' + (wordsChecked? "\b"+search+"\b": search), (caseChecked ? "g" : "gi"));
                if(null!==text.matches(wordRegex)){
                    $("#linksHolder").innerHTML+="<br> <a id = 'link" + index + "' href = '" + link.href + "'>" + link.innerHTML + "</a> <br>";
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

function doLinks(linkList, iterations) {
    if(iterations>0) {
        Array.from(linkList).forEach(function(link) {
            window.open(link.href);
            break;
        });
    }
}