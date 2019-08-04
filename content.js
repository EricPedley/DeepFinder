
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		let replacement = "<span style='background-color:"+request.color+"'>" + request.searchTerm + "</span>";//highlights keyword on page
		let replaced = ("" + document.documentElement.innerHTML).replace(new RegExp('(?<!<[^>]*)' + request.searchTerm,(request.checkboxStatus? "g":"gi")), replacement);
		document.documentElement.innerHTML = replaced;
		
		var linkList=[];

		Array.from(document.getElementsByTagName('a')).forEach(function(link) {//gets all links from page
			linkList.push({href: link.href, content: link.innerHTML});
		});

		var frames = Array.from(document.getElementsByTagName("frame"));
		frames = frames.concat(Array.from(document.getElementsByTagName("iframe")));
		console.log(frames);
		let c1=0;
		frames.forEach(async function(frame) {
			c1++;
			frame.onload = () => {
				if(frame.contentDocument) {
					frame.document=frame.contentDocument;
				}
				let frameBody = frame.document.body;
				let frameLinks = Array.from(frameBody.getElementsByTagName("a"));//gets all links from frames on page
				let c2=0;
				frameLinks.forEach((link) => {
					linkList.push({href: link.href, innerHTML: link.innerHTML});
					c2++;
					if(c1==frames.length&&c2==frameLinks.length) {
						linkList.push(window.location.href);
						sendResponse(linkList);
					}
				});//end of link getting code for frames
				frame.document.body.innerHTML = frameBody.innerHTML.replace(new RegExp('(?<!<[^>]*)' + request.searchTerm,(request.checkboxStatus? "g":"gi")), replacement);//highlights keyword on frames
				
			};
			
		});

		
		return true;

	});