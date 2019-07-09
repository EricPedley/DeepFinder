
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
			if (!link.href.includes("#")) {
				itemsStarted++;
				$.get(link.href, null, function (text) {
					itemsCompleted++;
					if (null !== text.match(new RegExp('(?<!<[^>]*)' + request.greeting, "g"))) {
						console.log(link.href);
						externalPageHTMLs.push(link.href);
					}
					if (itemsStarted == itemsCompleted)
						sendResponse(externalPageHTMLs);
				})

			}

		});
		return true;

	});