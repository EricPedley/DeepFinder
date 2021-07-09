document.addEventListener("DOMContentLoaded" ,function () {

    Array.from(document.getElementsByTagName("a")).forEach( function (element) {//makes all a tags open new tab when clicked on
        element.onclick=()=>{
            chrome.tabs.create({ url: element.href });
            return false;
        }
    });
    document.querySelector("#textbox2").addEventListener("keypress",function (event) {
        if (event.keyCode === 13) {
            let search = document.querySelector("#textbox2").value;
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
                        let winhref = response.pop();//don't know why this is here
                        console.log(response);
                        response.map(function (element) { element["iteration"] = 0 });

                        //getRecursive(winhref, response, [winhref], wordRegex);
                        getIterative(response,wordRegex,iterations)
                    });
            });
        }
    });
});

/*
linkQueue format:
[
    {
        href: "the href ofthe link",
        innerHTML: "the innerhtml of the link",
        iteration: the iteration of the link. This is to prevent the loop from running forever.
    },
    {
        more of the same formatted object
    }
]

*/
async function getIterative(linkQueue,wordRegex,iterations) {//uses BFS to search every link
    const usedList = []
    /*
    one problem is that this loop doesn't check if there are still fetch requests waiting for responses
    so if it goes through sending all the requests before it gets any responses, it'll just end the loop
    when there are still all the responses to be processed

    FIX: used await so that the fetch requests happen in series instead of parallel. Slower but
    not having to worry about bugs is better than performance.
    */
   let started=0,addressed=0,finished=0;//addressed is how many got to the callback of the promise(kinda confusing cause address also refers to memory)
    while(linkQueue.length!=0) {
        const currLink = linkQueue.pop()
        started++;
        const doneFetching = await fetch(currLink.href).then(res=>res.text()).then(text=> {//used await to avoid the potential bug mentioned above
            addressed++;
            if (wordRegex.test(text)) {//if the website html contains the keyword
                //console.log("found link that contains keyword, adding to popup");
                const atag = document.createElement("a")
                atag.innerHTML=currLink.innerHTML
                atag.href=currLink.href
                atag.target="_blank"
                document.getElementById("linksHolder").appendChild(atag)
            }
            const matches = text.matchAll(/<a.+?href="([^"]+)".*?>(.+?)<\/a>/sg);
            for(const match of matches) {
                const href = match[1];
                const innerHTML = match[2];
                const base = getBase(href);
                const processedHref = processLink(href, base);
                if(currLink.iteration<iterations&&!usedList.includes(processedHref)){
                    usedList.push(processedHref);
                    linkQueue.push({href:processedHref,innerHTML:innerHTML,iteration:currLink.iteration+1});//I had it do iteration-1 before, how did that not result in an infinite loop????
                }
            }
            return true
        }).catch(console.log)
        if(doneFetching)
            finished++;
    }
    console.log(`started ${started}, ran callbacks for ${addressed}, finished ${finished}`)
    document.getElementById("linksHolder").innerHTML += "Done searching links";
}


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
            fetch(href).then(res=>res.text()).then(function (text) {
                console.log(`successful GET request on ${href}, iteration is ${link.iteration}`);
                //do stuff to add keyword to popup html
                if (wordRegex.test(text)) {//if the website html contains the keyword
                    //console.log("found link that contains keyword, adding to popup");
                    if(href="http://localhost:5000/waiver.pdf") {
                        console.log(text);
                    }
                    document.getElementById("linksHolder").innerHTML += `<br> <a target="_blank" href = "${link.href}">${link.innerHTML}</a> <br>`;//add to html of popup
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
            }).catch(function (error) {//if the get request to the link fails, continue without searching for the keyword or more links
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
    //pretty sure this commented block was useless
    // let i = url.lastIndexOf("/");
    // if (i === url.length - 1) {// if the last character is a slash (what I typed before: if there's stuff after the last slash
    //     url = url.substring(0, i+1);// then do nothing??? this only runs when i+1 ===url.length, so it does the substring from 0 to the length     what I typed before: then delete that shit because without deleting it duplicate urls would be added to the tested list
    // }
    if (url.includes("http")) {//if the link isn't relative to the site
        return url;//then it's complete, just return it
    } else {//if it's a relative internal link
        return base+url;//concatenate it with the base url and return that
    }
}

function getBase(url) {
    let i = url.indexOf("//");
    let j = url.indexOf("/", i + 2);
    return url.substring(0, j + 1);
}