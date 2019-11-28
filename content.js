console.log("content script loaded on page");
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		console.log("message received, stupid");
		let replacement = "<span style='background-color:" + request.color + "'>" + request.searchTerm + "</span>";//highlights keyword on page
		let replaced = ("" + document.documentElement.innerHTML).replace(new RegExp('(?<!<[^>]*)' + (request.checkboxStatus[1] ? "\b" + request.searchTerm + "\b" : request.searchTerm), (request.checkboxStatus[0] ? "g" : "gi")), replacement);
		document.documentElement.innerHTML = replaced;

		var aTags = document.getElementsByTagName('a');
		var linkList = [];
		var frames = Array.from(document.getElementsByTagName("frame"));
		frames = frames.concat(Array.from(document.getElementsByTagName("iframe")));
		let c1 = 0;
		console.log(frames);
		frames.forEach(async function (frame) {
			frame.onload = () => {
				c1++;
				if (frame.contentDocument && frame.contentDocument.body) {
					frame.document = frame.contentDocument;
					let frameBody = frame.document.body;
					let frameLinks = Array.from(frameBody.getElementsByTagName("a"));//gets all links from frames on page
					let c2 = 0;
					frameLinks.forEach((link) => {
						linkList.push({ href: processLink(link.href), innerHTML: link.innerHTML });
						c2++;
						if (c1 == frames.length && c2 == frameLinks.length) {
							linkList.push(window.location.href);
							if (aTags !== null) {
								Array.from(aTags).forEach(function (link, index) {//gets all links from page
									linkList.push({ href: processLink(link.href), innerHTML: link.innerHTML });
									if (index === aTags.length - 1 && c1 === 0) {
										console.log("LinkList from frames loop:" + linkList);
										sendResponse(linkList);
										return true;
									}
								});
							}
						}
					});//end of link getting code for frames
					frame.document.body.innerHTML = frameBody.innerHTML.replace(new RegExp('(?<!<[^>]*)' + (request.checkboxStatus[1] ? "\b" + request.searchTerm + "\b" : request.searchTerm), (request.checkboxStatus[0] ? "g" : "gi")), replacement);//highlights keyword on frames
				} else {
					c1--;
				}
			};

		});
		console.log(aTags);
		console.log("aTags Length:" + aTags.length);
		Array.from(aTags).forEach(function (link, index) {//gets all links from page
			linkList.push({ href: processLink(link.href), innerHTML: link.innerHTML });
			console.log(new String("" + index + "|" + aTags.length - 1 + "|" + c1));
			if (index === aTags.length - 1 && c1 === 0) {
				console.log("linkListNotFromFramesLoop:" + linkList);
				linkList.push(processLink(window.location.href));
				sendResponse(linkList);
			}
		});



		return true;

	});

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