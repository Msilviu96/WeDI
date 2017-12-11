//function is executed when extension popup is loading
function onWindowLoad() {

	
	var numberOfElements = document.querySelector('#numberOfElementsFound');
	chrome.tabs.executeScript({
		code: "document.documentElement.innerHTML;"
		// document.getElementsByTagName('html')[0].innerHTML
		//"document.documentElement.innerHTML;"
	}, function (html1) {
		
		
		var htmlString = html1.toString();//conversion from html to string

		var list = listOfElements(htmlString);//populate list with elements found in string
		//console.log(list + "raspunsul");
	//	for (var i = 0; i < list.length; ++i) {
	//		console.log(list[i]);
	//	}
		if(list!=null)
			numberOfElements.innerText = list.length; //number of elements found

		
		

		chrome.runtime.sendMessage({
			action: "getSource",
			source: htmlString
		});

	});

}

function listOfElements(string) {
	//list of regex
	telephoneRegex = /\d+/;
	emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
	timeUnitsRegex = /\d+/;
	webAddressesRegex = /(https?:\/\/[^\s]+)/gi;
	geographicCoordinatesRegex = /\d+/;
	songRegex = /\d+/;
	picturesRegex = /\d+/;
	mp4Regex = /\d+/;
	socialMediaRegex = /\d+/;
	postalAddressesRegex = /\d+/;


	//match regex in string
	var emails = string.match(emailRegex);
	var webAddresses = string.match(webAddressesRegex);
	var telephones = string.match(telephoneRegex);
	var timeUnits = string.match(timeUnitsRegex);
	var coordinates = string.match(geographicCoordinatesRegex);
	var songs = string.match(songRegex);
	var pictures = string.match(picturesRegex);
	var mp4s = string.match(mp4Regex);
	var socialMedias = string.match(socialMediaRegex);
	var postalAddresses = string.match(postalAddressesRegex);
	//number of elements

	var emailsLength = 0;
	var webAddressesLength = 0;
	var telephonesLength = 0;
	var timeUnitsLength = 0;
	var coordinatesLength = 0;
	var songsLength = 0;
	var picturesLength = 0;
	var mp4sLength = 0;
	var socialMediasLength = 0;
	var postalAddressesLength = 0;

	if (emails!= null)
		emailsLength = emails.length;
	if (webAddresses != null)
		webAddressesLength = webAddresses.length;
	if (telephones != null)
		telephonesLength = telephones.length;
	if (timeUnits != null)
		timeUnitsLength = timeUnits.length;
	if (coordinates != null)
		coordinatesLength = coordinates.length;
	if (songs != null)
		songsLength = songs.length;
	if (pictures != null)
		picturesLength = pictures.length;
	if (mp4s != null)
		mp4sLength = mp4s.length;
	if (socialMedias != null)
		socialMediasLength = socialMedias.length;
	if (postalAddresses != null)
		postalAddressesLength = postalAddresses.length;
		

	chrome.storage.sync.set({
		'emails': emailsLength, 'webAddresses': webAddressesLength, 'telephones': telephonesLength, 'timeUnits': timeUnitsLength, 'coordinates': coordinatesLength, 'songs': songsLength, 'pictures': picturesLength, 'mp4s': mp4sLength, 'socialMedias': socialMediasLength,'postalAddresses':postalAddressesLength }, function () {
		console.log('Settings saved');
	});

	var listex = [];
	
	listex=listex.concat(webAddresses).concat(emails).concat(telephones).concat(timeUnits).concat(coordinates).concat(songs).concat(pictures).concat(mp4s).concat(socialMedias).concat(postalAddresses);
	
	

	//return a list of elements
	return listex.filter(x => !!x);

}



window.onload = onWindowLoad;