
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		let replacement = "<span style='background-color:yellow'>" + request.greeting + "</span>";
		let replaced = ("" + document.documentElement.innerHTML).replace(new RegExp('(?<!<[^>]*)' + request.greeting, "g"), replacement);
		document.documentElement.innerHTML = replaced;

		var linkList = document.getElementsByTagName('a');
		var externalPageHTMLs = [];//{ "key1": "value1" };
		var itemsStarted = 0;
		var itemsCompleted = 0;
		Array.from(linkList).forEach(async function (link) {
			if (!link.href.includes("#")&&link.href.includes("https")) {
				itemsStarted++;
				$.get(link.href, null, function (text) {
					itemsCompleted++;
					let regex;
					if(request.checkboxStatus)
						regex = new RegExp('(?<!<[^>]*)' + request.greeting, "g");
					else
						regex = new RegExp('(?<!<[^>]*)' + request.greeting, "gi")
					if (null !== text.match(regex)) {
						console.log(link.href);
						externalPageHTMLs.push(link.href);
					}
					if (itemsStarted == itemsCompleted) {
						sendResponse(externalPageHTMLs);
						break;
					}
				})

			}

		});
		return true;

	});