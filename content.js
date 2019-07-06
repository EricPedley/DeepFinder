console.log("script ready");
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		let replacement = "<span style='background-color:yellow'>" + request.greeting + "</span>";
		let replaced = ("" + document.documentElement.innerHTML).replace(new RegExp('(?<!<[^>]*)' + request.greeting, "g"), replacement);
		document.documentElement.innerHTML = replaced;
		links = document.getElementsByTagName('a');
		let win = window.open(links[1].href, 'targetWindow', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=600');
		var h;
		h = "not loaded yet";
		win.onload = function () {
			h = "" + win.document.getElementsByTagName("html")[0].innerHTML;
			
			sendResponse({ ey: h });
			console.log("onload ran");
			win.close();
		}
		return true;
	});