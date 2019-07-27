
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		let replacement = "<span style='background-color:"+request.color+"'>" + request.greeting + "</span>";
		let replaced = ("" + document.documentElement.innerHTML).replace(new RegExp('(?<!<[^>]*)' + request.greeting,(request.checkboxStatus? "g":"gi")), replacement);
		document.documentElement.innerHTML = replaced;

		var linkList=[];
		Array.from(document.getElementsByTagName('a')).forEach(function(link) {
			linkList.push(link.href);
		});
		console.log(linkList);
		linkList.push(window.location.href);
		sendResponse(linkList);
		return true;

	});