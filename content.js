chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		let replacement = "<span style='background-color:yellow'>" + request + "</span>";
		let replaced = ("" + document.documentElement.innerHTML).replace(new RegExp('(?<!<[^>]*)'+request,"g"), replacement);
		document.documentElement.innerHTML = replaced;
		links = document.getElementsByTagName('a');
		for(var i=0;i<links.length;i++){
			if(!links[i].href.contains("#")){//if the link is extenal
				window.open(links[i].href);
				break;
			}
		}
	}
);
