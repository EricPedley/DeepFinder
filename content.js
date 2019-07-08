console.log("script ready!!!!!");
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {

		let replacement = "<span style='background-color:yellow'>" + request.greeting + "</span>";
		let replaced = ("" + document.documentElement.innerHTML).replace(new RegExp('(?<!<[^>]*)' + request.greeting, "g"), replacement);
		document.documentElement.innerHTML = replaced;
		
		var linkList = document.getElementsByTagName('a');
		var externalPageHTMLs = { "key1": "value1" };
		var linksProcessed = 0;
		var linksToProcess = 0;
		Array.from(linkList).forEach(async function (link) {
			//console.log("loop iteration ran");
			if (!link.href.includes("#")) {
				$.get(link.href,null, function(text) {
					if(null!==text.match(new RegExp('(?<!<[^>]*)' + request.greeting, "g"))){
						console.log(link.href);
					}
					externalPageHTMLs[link.href] = text;
					//11sendResponse({farewell:"goodbye"});
				})
				//window.open(link.href, 'targetWindow', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=100,height=100');
				//window.focus();
				// let win = window.open(link.href, 'targetWindow', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=100,height=100');
				// window.focus();
				// linksToProcess++;
				// win.onload = function () {
				// 	console.log("onload called");
				// 	externalPageHTMLs[link.href] = win.document.getElementsByTagName("html")[0].innerHTML;
				// 	win.close();
				// 	linksProcessed++;
				// 	console.log(linksToProcess + "/" + linksProcessed);
				// 	if (linksToProcess == linksProcessed) {
				// 		sendResponse(externalPageHTMLs);
				// 		console.log("response sent");
				// 	}
				// };
			}
		});
		
		//sendResponse(externalPageHTMLs);
		return true;

		// var links = document.getElementsByTagName('a');
		// let win = window.open(links[1].href, 'targetWindow', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=600');
		// var h = "not loaded yet";
		// win.onload = function () {
		// 	h = "" + win.document.getElementsByTagName("html")[0].innerHTML;
		// 	sendResponse({ ey: h });
		// 	console.log("onload ran");
		// 	win.close();
		// }
	});