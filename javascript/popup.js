//function is executed when extension popup is loading
function onWindowLoad() {

	
	var numberOfElements = document.querySelector('#numberOfElementsFound');
	var tablink;
	chrome.tabs.getSelected(null,function(tab) {
    		tablink = tab.url;
	});

	chrome.tabs.executeScript({
		code: "document.documentElement.innerHTML;"
		// document.getElementsByTagName('html')[0].innerHTML
		//"document.documentElement.innerHTML;"
	}, function (html1) {
		
		
		var htmlString = html1.toString();//conversion from html to string

		var list = listOfElements(htmlString, tablink);//populate list with elements found in string
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

var globalFile="filetest";
var fileG;



function listOfElements(string, url) {
	var json_html,c_contacts, c_timeUnits, c_coordinates, c_userProfiles, c_socialMedia, media; 	
	
	//list of regex
	chrome.storage.local.clear(function() {
    var error = chrome.runtime.lastError;
    
    if (error) {
        console.error(error);
    }
});



	telephone1Regex = /span>\s.\s(\d+\s*\d+\s*\d+)/gi;
    telephone2Regex = /tel:(\d+)"/gi;
	emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
	timeUnitsRegex = /\d+/;
	webAddressesRegex = /(https?:\/\/[^\s]+)"/gi;
	geographicCoordinatesRegex = /">(\d{2}.\d{6}), (\d{2}.\d{6})/gi;
	songRegex = /(?:href|src)="([^ ]*\.(?:mp3|wav|ogg|wma))/gi;
	picturesRegex = /(?:href|content|src)="([^ ]*\.(?:ico|png|gif|jpg|jpeg|gif|bmp))"/gi;
	pictures2Regex = /<img(?:(?!src).)*src="([^"]+)/gi;
	videoRegex = /href="([^ ]*\.(?:flv|avi|wmv|mp4|mpg|mov))/gi;
	video2Regex = /<video(?:(?!src).)+src="((?:(?!http).)+)?([^"]+)"><\/video>/gi;
	youtubeRegex = /href="(https:\/\/www.youtube.com\/watch\?v=[a-zA-Z0-9]{11})/gi;
	socialMediaRegex = /href="(https?:\/\/(www\.)?(?:facebook|twitter|linkedin|plus\.google|instagram|pinteres|snapchat|tumblr|reddit)\.com\/[^"]+)/gi;
	postalAddressesRegex = /<span>((?:.oseaua|Str|Strada|Bd|Bulevardul)[^<]+)<\/span>/gi;
	
	//declaration of arrays
	var emails = [];
	var webAddresses = [];
	var telephones = [];
	var timeUnits = [];
	var coordinates = [];
	var songs = [];
	var pictures = [];
	var videos = [];
	var socialMedias = [];
	var postalAddresses = [];
	

	//match regex in string
	var current;
	while(current = emailRegex.exec(string))
		emails.push(current[1])
		
	while(current = webAddressesRegex.exec(string))
		webAddresses.push(current[1])
		
	while(current = telephone1Regex.exec(string))
		telephones.push(current[1])
		
	while(current = telephone2Regex.exec(string))
		telephones.push(current[1])
		
	while(current = geographicCoordinatesRegex.exec(string)){
		coordinates.push(current[1])
		coordinates.push(current[2])
	}
	
	while(current = songRegex.exec(string))
		songs.push(current[1])
	
	while(current = picturesRegex.exec(string))
		pictures.push(current[1])
		
	while(current = pictures2Regex.exec(string))
		pictures.push(current[1])
	
	while(current = videoRegex.exec(string))
		videos.push(current[1])
	
	while(current = video2Regex.exec(string))
		videos.push(current[2])	
		
	while(current = youtubeRegex.exec(string))
		videos.push(current[1])
	
	while(current = socialMediaRegex.exec(string))
		socialMedias.push(current[1])
		
	while(current = postalAddressesRegex.exec(string))
		postalAddresses.push(current[1])

   //processing arrays
	webAddresses = web(webAddresses)
	pictures = get_real_links(pictures, url)
	videos = get_real_links(videos, url)
	songs = get_real_links(songs, url)
	emails = unique_elements(emails)
	socialMedias = unique_elements(socialMedias)

	var emailsLength = 0;
	var webAddressesLength = 0;
	var telephonesLength = 0;
	var timeUnitsLength = 0;
	var coordinatesLength = 0;
	var songsLength = 0;
	var picturesLength = 0;
	var videosLength = 0;
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
	if (videos != null)
		videosLength = videos.length;
	if (socialMedias != null)
		socialMediasLength = socialMedias.length;
	if (postalAddresses != null)
		postalAddressesLength = postalAddresses.length;
		

	chrome.storage.sync.set({
		'emails': emailsLength, 'webAddresses': webAddressesLength, 'telephones': telephonesLength, 'timeUnits': timeUnitsLength, 'coordinates': coordinatesLength, 'songs': songsLength, 'pictures': picturesLength, 'videos': videosLength, 'socialMedias': socialMediasLength,'postalAddresses':postalAddressesLength }, function () {
		console.log('Settings saved');
	});

	var listex = [];
	
	listex=listex.concat(webAddresses).concat(emails).concat(telephones).concat(timeUnits).concat(coordinates).concat(songs).concat(pictures).concat(videos).concat(socialMedias).concat(postalAddresses);
	
	
	
	
	document.getElementById("export").onclick = function() {
	createExportFile(webAddresses,
			 emails,
			 telephones,
			 coordinates,
			 timeUnits,
			 songs,
			 pictures,
			videos,
			socialMedias,
			postalAddresses);
}
	
	//return a list of elements
	return listex.filter(x => !!x);

}


window.onload = onWindowLoad;


