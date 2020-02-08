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
                        response.map(function (element) { element["iteration"] = Number(iterations) });

                        getRecursive(winhref, response, [winhref], wordRegex);

                    });
            });
        }
    });
});

/*
Format for untestedlist:
{
    {href:"href string here", 
    innerHTML:"innerhtml string here", 
    iteration:"iteration number", 
    parent:"parent page url"}, // used this to debug, can be removed
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
            console.log(`the list doesn't already contain this link: ${href} from ${link.parent}, going to push it to list`);
            testedlist.push(href);
            console.log(testedlist);
            $.get(href, null, function (text) {
                console.log(`successful GET request on ${href}, iteration is ${link.iteration}`);
                //do stuff to add keyword to popup html
                if (wordRegex.test(text)) {//if the website html contains the keyword
                    //console.log("found link that contains keyword, adding to popup");
                    if(href="http://localhost:5000/waiver.pdf") {
                        console.log(text);
                    }
                    document.getElementById("linksHolder").innerHTML += "<br> <a href = '" + link.href + "'>" + link.innerHTML + "</a> <br>";//add to html of popup
                }
                if (link.iteration > 1) {//if the iteration number of the link is over 1
                    
                    //console.log("link iteration is greater than one");
                    let matches = text.matchAll(/<a.+?href="([^"]+)".*?>(.+?)<\/a>/sg);/*regex for all a tags on page
                    output format: 
                        returns array of arrays. Format(where n is the index of any element in the array):
                        matches[n][0]: full text of a tag
                        matches[n][1]: href of a tag
                        matches[n][2]: innerhtml of a tag
                    regex tester: https://regex101.com/r/fMMH7H/1/    */
                    var length =0;
                    console.log(`matches on ${href}:`, length);
                    for (const match of matches) {
                        length++;
                        //console.log(`match: ${match}`);
                        let base = getBase(href);
                        let unprocessed = match[1];
                        let newhref = processLink(unprocessed, base);
                        // if (!newhref.includes("http")) {//this means it's an internal link. This will definitely break if an href is in the form "../imaginary-page"
                        //     newhref = base + newhref;
                        //}
                        if (testedlist.indexOf(newhref) === -1) {
                            untestedlist.push({ href: newhref, innerHTML: match[2], iteration: link.iteration-1, parent: base });
                            console.log(`pushing ${unprocessed} to list as ${newhref} from ${href} that has base ${base}, which came from regex match ${match}`);
                        }
                    }
                    getRecursive(href, untestedlist, testedlist, wordRegex);//call function with new elements added to list, and
                } else {
                    getRecursive(winhref, untestedlist, testedlist, wordRegex);//call function again with same conditions, except untestedlist is one element shorter
                }
            }).fail(function (error) {//if the get request to the link fails, continue without searching for the keyword or more links
                console.log(error);
                return getRecursive(winhref, untestedlist, testedlist, wordRegex);
            });

        } else {// if the link has already been searched, keep going without adding it to the list of searched links
            getRecursive(winhref, untestedlist, testedlist, wordRegex);
        }
    } else {//when function is done
        document.getElementById("linksHolder").innerHTML += "<br>Done searching links<br>";
        console.log("tested list: " + testedlist);
    }
}

/**
 * url is something like /EricPedley?foo=bar 
 * base is something like https://github.com/
 * return will be something like https://github.com/EricPedley
 */
function processLink(url, base) {
    let i = url.lastIndexOf("/");
    if (i === url.length - 1) {// if there's stuff after the last slash
        url = url.substring(0, i+1);//then delete that shit because without deleting it duplicate urls would be added to the tested list
    }
    if (url.includes("http")) {//if the link isn't external
        return url;//then it's complete, just return it
    } else {//if it's an internal link
        return base+url;//concatenate it with the base url and return that
    }
}

function getBase(url) {
    let i = url.indexOf("//");
    let j = url.indexOf("/", i + 2);
    return url.substring(0, j + 1);
}