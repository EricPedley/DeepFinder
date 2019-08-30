console.log("this better be happening");
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		console.log("message received, stupid");
		let replacement = "<span style='background-color:"+request.color+"'>" + request.searchTerm + "</span>";//highlights keyword on page
		let replaced = ("" + document.documentElement.innerHTML).replace(new RegExp('(?<!<[^>]*)' + (request.checkboxStatus[1]? "\b"+request.searchTerm+"\b": request.searchTerm),(request.checkboxStatus[0]? "g":"gi")), replacement);
		document.documentElement.innerHTML = replaced;
		
		var linkList=[];
		var frames = Array.from(document.getElementsByTagName("frame"));
		frames = frames.concat(Array.from(document.getElementsByTagName("iframe")));
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
				frame.document.body.innerHTML = frameBody.innerHTML.replace(new RegExp('(?<!<[^>]*)' + (request.checkboxStatus[1]? "\b"+request.searchTerm+"\b": request.searchTerm),(request.checkboxStatus[0]? "g":"gi")), replacement);//highlights keyword on frames
				
			};
			
		});
		var aTags = document.getElementsByTagName('a');
		
		Array.from(aTags).forEach(function(link,index) {//gets all links from page
			linkList.push({href: link.href, content: link.innerHTML});
			console.log(index+"|"+aTags.length-1+"|"+c1);
			if(index===aTags.length-1&&c1===0) {
				console.log(linkList);
				linkList.push(window.location.href);
				sendResponse(linkList);
			}
		});

		
		return true;

	});