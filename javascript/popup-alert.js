document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("alert1").addEventListener("click", showAllert);
});

function showAllert() {
	var alertDiv = "<div style='position: fixed; top: 20px; left: 20px;'>" + "hello" + "</div>";
	document.getElementsByTagName('body')[0].appendChild(alertDiv);
}