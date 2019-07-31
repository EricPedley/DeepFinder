
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		let replacement = "<span style='background-color:"+request.color+"'>" + request.greeting + "</span>";
		let replaced = ("" + document.documentElement.innerHTML).replace(new RegExp('(?<!<[^>]*)' + request.greeting,(request.checkboxStatus? "g":"gi")), replacement);
		document.documentElement.innerHTML = replaced;
		
		var linkList=[];
		Array.from(document.getElementsByTagName('a')).forEach(function(link) {
			linkList.push(link.href);
		});

		var frames = Array.from(document.getElementsByTagName("frame"));
		frames = frames.concat(Array.from(document.getElementsByTagName("iframe")));
		console.log(frames);
		frames.forEach(function(frame) {
			$.get(frame.src, null, function (text) {
				let div = document.createElement('div');
				div.innerHTML = text.trim();
				console.log(div.getElementsByTagName("a"));
			});
		});

		
		console.log(linkList);
		linkList.push(window.location.href);
		sendResponse(linkList);
		return true;

	});