
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  document.getElementsByTagName("html")[0].innerText=request;
});
