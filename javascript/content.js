chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.todo == "showElements") {
		alert("dsadasdas"); console.log("30");
	}
	console.log("20");
	console.log("content2");
})
