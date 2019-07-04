chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {

		let replacement = "<span style='background-color:yellow'>" + request + "</span>";
		let replaced = ("" + document.documentElement.innerHTML).replace(new RegExp('(?<!<[^>]*)' + request, "g"), replacement);
		document.documentElement.innerHTML = replaced;
		links = document.getElementsByTagName('a');
		let win = window.open(links[1].href, 'targetWindow', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=600');
		var h  = ""+win.document.documentElement.innerHTML;
		win.close();
		alert(h);

		sendResponse({ farewell: "goodbye" });
		return true;
	}
);

