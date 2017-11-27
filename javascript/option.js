document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("test1").addEventListener("click", firstcheckbox);
});
function firstcheckbox() {
	
	var b = document.getElementById("test1").checked;
	if (b == true)
		document.getElementById("test2").checked = false;
	else
		document.getElementById("test2").checked = true;
}
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("test2").addEventListener("click", secondcheckbox);
});
function secondcheckbox() {
	var a = document.getElementById("test2").checked;
	
	if (a == true)
		document.getElementById("test1").checked = false;
	else
		document.getElementById("test1").checked = true;
}