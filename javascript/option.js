


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

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("saveButton").addEventListener("click", saveLocalStorage);
});

function saveLocalStorage() {

	var html = document.getElementById("test1").checked
	var contacts = document.getElementById("test3").checked
	var timeUnits = document.getElementById("test4").checked
	var urls = document.getElementById("test5").checked
	var coordinates = document.getElementById("test6").checked
	var userProfile = document.getElementById("test7").checked
	var media = document.getElementById("test8").checked

	chrome.storage.sync.set({
		'html': html, 'contactsV': contacts, 'timeUnitsV': timeUnits, 'urlsV': urls, 'coordinatesV': coordinates, 'userProfileV':userProfile,'mediaV':media
	}, function () {
		console.log('Settings saved');
		});

	tempAlert("Options saved successfully", 3000);

}

chrome.storage.sync.get(['html', 'contactsV', 'timeUnitsV', 'urlsV', 'coordinatesV', 'userProfileV', 'mediaV'], function (items) {
	document.getElementById("test1").checked = items.html;
	if (items.html==true)
		document.getElementById("test2").checked = false;
	else
		document.getElementById("test2").checked = true;
	document.getElementById("test3").checked = items.contactsV;
	document.getElementById("test4").checked = items.timeUnitsV;
	document.getElementById("test5").checked = items.urlsV;
	document.getElementById("test6").checked = items.coordinatesV;
	document.getElementById("test7").checked = items.userProfileV;
	document.getElementById("test8").checked = items.mediaV;

	

});

function tempAlert(msg, duration) {
	var el = document.createElement("div");
	el.setAttribute("style", "position:absolute;top:5%;left:38%;background-color:white;font-size: 30px; height:8%;text-shadow: 1px 1px 3px #486fd8; font- family: 'Roboto';color: #486fd8;");
	el.innerHTML = msg;
	setTimeout(function () {
		el.parentNode.removeChild(el);
	}, duration);
	document.body.appendChild(el);
}