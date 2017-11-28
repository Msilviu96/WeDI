document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("alert1").addEventListener("click", show);
});
function show() {
	
	chrome.runtime.sendMessage({ todo: "showElements" });
}
