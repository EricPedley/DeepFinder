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
                        console.log(response);
                        response.map(function (element) { element["iteration"] = iterations });
                        
                        getRecursive(winhref, response, [winhref], wordRegex);
                        
                    });
            });
        }
    });
});

/*
Format for untestedlist:
{
    {href:"href string here", innerHTML:"innerhtml string here", iteration:"iteration number"},
    *more elements w/ same structure as above*
}
iteration number explanation:
if the iteration is 1, then the link will be searched for the keyword, but not searched for links to other pages
if the iteartion is >1, then the link will be searched for the keyword and for links to more pages, and those links will be added to the list
*/
function getRecursive(winhref, untestedlist, testedlist, wordRegex) {//untestedlinks contains the list of all the links to be tested.
    if (untestedlist.length > 0) {
        console.log("untestedlist length>0, there are more links to search");
        let link = untestedlist.pop();// format: {href, innerhtml, iteration}
        let href = link.href;
        if (testedlist.indexOf(href) === -1) {//if this link hasn't already been searched
            console.log(`the list doesn't already contain this link: ${href}, going to push it to list`);
            testedlist.push(href);
            console.log(testedlist);
            $.get(href,null, function (text) {
                console.log(`successful GET request on ${href}`);
                //do stuff to add keyword to popup html
                if (wordRegex.test(text)) {//if the website html contains the keyword
                    console.log("found link that contains keyword, adding to popup");
                    document.getElementById("linksHolder").innerHTML += "<br> <a href = '" + link.href + "'>" + link.innerHTML + "</a> <br>";//add to html of popup
                }
                if (link.iteration > 1) {//if the iteration number of the link is over 1
                    console.log("link iteration is greater than one");
                    let matches = text.matchAll(/<a.+?href="([^"]+)".*?>(.+?)<\/a>/sg);/*regex for all a tags on page
                    output format: 
                        returns array of arrays. Format(where n is the index of any element in the array):
                        matches[n][0]: full text of a tag
                        matches[n][1]: href of a tag
                        matches[n][2]: innerhtml of a tag
                    regex tester: https://regex101.com/r/fMMH7H/1/    */
                    for (const match of matches) {
                        console.log(`match: ${match}`);
                        let newhref = processLink(match[1], href);
                        if (!newhref.includes("http")) {//this means it's an internal link. This will definitely break if an href is in the form "../imaginary-page"
                            console.log(href+"|"+newhref+"|"+winhref);
                            newhref = href + newhref;
                        }
                        if (testedlist.indexOf(newhref) === -1)
                            untestedlist.push({ href: newhref, innerHTML: match[2] });
                    }
                    getRecursive(href, untestedlist, testedlist, wordRegex);//call function with new elements added to list, and
                } else {
                    getRecursive(winhref, untestedlist, testedlist, wordRegex);//call function again with same conditions, except untestedlist is one element shorter
                }
            }).fail(function(error) {//if the get request to the link fails, continue without searching for the keyword or more links
                console.log(error);
                getRecursive(winhref, untestedlist, testedlist, wordRegex);
            });

        } else {// if the link has already been searched, keep going without adding it to the list of searched links
            getRecursive(winhref, untestedlist, testedlist, wordRegex);
        }
    } else {//when function is done
        document.getElementById("linksHolder").innerHTML += "<br>Done searching links<br>";
        console.log("tested list: "+testedlist);
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