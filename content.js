chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		
		let replacement = "<span style='background-color:yellow'>" + request + "</span>";
		let replaced = ("" + document.documentElement.innerHTML).replace(new RegExp('(?<!<[^>]*)'+request,"g"), replacement);
		document.documentElement.innerHTML = replaced;
		links = document.getElementsByTagName('a');
		//window.open(links[1].href);
		console.log((""+links[1].href).includes("#"));
		console.log("hello,world!");
		let win = window.open(links[1].href);
		console.log(win.document.documentElement.innerHTML+"");
				if(win.document.documentElement.innerHTML.includes(request)){
					alert("eyyyyyy");
					win.close();
				} else {
					win.close();
				}
		// for(var i=0;i<links.length;i++){
		// 	if(!(""+links[i].href).includes("#")){//if the link is extenal
		// 		let win = window.open(links[i].href);
		// 		if(win.document.documentElement.innerHTML.includes(request)){
		// 			alert("eyyyyyy");
		// 			win.close();
		// 			break;
		// 		}
		// 		win.close();
		// 	}
		// }
		sendResponse(true);
	}
);
