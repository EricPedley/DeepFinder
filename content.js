
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		alert("message code started");
		let replacement = "<span style='background-color:yellow'>" + request + "</span>";
		let replaced = ("" + document.documentElement.innerHTML).replace(new RegExp('(?<!<[^>]*)'+request,["g","i"]), replacement);
		document.documentElement.innerHTML = replaced;
		//links = document.getElementsByTagName('a');
	}
);
