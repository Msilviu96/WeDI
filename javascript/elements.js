

chrome.storage.sync.get(['emails', 'webAddresses', 'telephones', 'timeUnits', 'coordinates', 'songs', 'pictures', 'mp4s', 'socialMedias', 'postalAddresses'], function (items) {
	console.log(items);
	console.log(items.emails);
	var emails = document.getElementById("emails");
	var webAddresses = document.getElementById("urls");
	var telephones = document.getElementById("phones");
	var timeUnits = document.getElementById("times");
	var coordinates = document.getElementById("coordinates1");
	var songs = document.getElementById("songs");
	var pictures = document.getElementById("images");
	var mp4s = document.getElementById("videos");
	var socialMedias = document.getElementById("socialMedia");
	var postalAddresses = document.getElementById("postalAddresss");

	emails.innerHTML = items.emails;
	webAddresses.innerHTML = items.webAddresses;
	telephones.innerHTML = items.telephones;
	timeUnits.innerHTML = items.timeUnits;
	coordinates.innerHTML = items.coordinates;
	songs.innerHTML = items.songs;
	pictures.innerHTML = items.pictures;
	mp4s.innerHTML = items.mp4s;
	socialMedias.innerHTML = items.socialMedias;
	postalAddresses.innerHTML = items.postalAddresses;
});