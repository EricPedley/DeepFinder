alert("injected");
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {

		let replacement = "<span style='background-color:yellow'>" + request + "</span>";
		let replaced = ("" + document.documentElement.innerHTML).replace(new RegExp('(?<!<[^>]*)' + request, "g"), replacement);
		document.documentElement.innerHTML = replaced;
		links = document.getElementsByTagName('a');
		//let win = window.open(links[1].href);
		document.append(win.document.documentElement.innerHTML + "");
		// if (win.document.documentElement.innerHTML.includes(request)) {
		// 	alert("eyyyyyy");
		// 	win.close();
		// } else {
		// 	win.close();
		// }

		sendResponse({ farewell: "goodbye" });
		return true;
	}
);

