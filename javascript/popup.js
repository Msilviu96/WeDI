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

function unique_elements(array){
	return Array.from(new Set(array))
}

function arr_diff (a1, a2) {
    var a = [], diff = [];
	for( var i=0; i<a1.length; i++){
		var flag = false;
		for (var j=0; j<a2.length;j++)
			if (a1[i] == a2[j])
				flag = true
		if (flag == false)
			diff.push(a1[i])
	}

    return Array.from(new Set(diff));
}

function web(webs){
	exceptions = ["mp3", "wav", "ogg", "wma","gif", "ico", "png", "jpg", "jpeg", "gif", "bmp", "flv", "avi", "wmv", "mp4", "mpg", "mov", "xml", "js", "css", "html"];
	result = [];
	for (var i = 0; i < webs.length; i++)
		for(var j = 0; j < exceptions.length; j++)
			if(webs[i].endsWith(exceptions[j]) == true)
				result.push(webs[i])
	
	result = Array.from(new Set(result))
	return arr_diff(webs, result)
}

function combine(s1, s2){
	return s2 + s1;
}
function get_real_links(array, url){
	var result = [];
	var current;
	
	url = /https?:\/\/(www\.)?[^\.]+\.[^\/]+\//gi.exec(url)
	
	for(var i =0; i<array.length; i++)
		if(array[i].startsWith("../") == true)
			result.push(combine(array[i].substring(3), url[0]));
		else if(array[i].startsWith("/") == true)
			result.push(combine(array[i].substring(1), url[0]));
		else
			result.push(array[i])
	
	return unique_elements(result)
}

function listOfElements(string, url) {
	//list of regex
	telephone1Regex = /span>\s.\s(\d+\s*\d+\s*\d+)/gi;
    telephone2Regex = /tel:(\d+)"/gi;
	//telephone3Regex = /Telefon:([^<]+)/gi;
	emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
	timeUnitsRegex = /\d+/;
	webAddressesRegex = /(https?:\/\/[^\s]+)"/gi;
	geographicCoordinatesRegex = /center=(\d{2}\.\d{7}).{3}(\d{2}\.\d{7})/;
	songRegex = /(?:href|src)="([^ ]*\.(?:mp3|wav|ogg|wma))/gi;
	picturesRegex = /(?:href|content|src)="([^ ]*\.(?:ico|png|gif|jpg|jpeg|gif|bmp))"/gi;
	videoRegex = /href="([^ ]*\.(?:flv|avi|wmv|mp4|mpg|mov))/gi;
	socialMediaRegex = /href="(https?:\/\/(www\.)?(?:facebook|twitter|linkedin|plus\.google|instagram|pinteres|snapchat|tumblr|reddit)\.com\/[^"]+)/gi;
	postalAddressesRegex = /<div><span>((?:.oseaua|Str|Strada|Bd|Bulevardul)[^<]+)<\/span>/gi;

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
		
	//while(current = telephone3Regex.exec(string))
		//telephones.push(current[1])
		
	while(current = geographicCoordinatesRegex.exec(string))
		coordinates.push(current[1])
	
	while(current = songRegex.exec(string))
		songs.push(current[1])
	
	while(current = picturesRegex.exec(string))
		pictures.push(current[1])
		
	while(current = videoRegex.exec(string))
		videos.push(current[1])
	
	while(current = socialMediaRegex.exec(string))
		socialMedias.push(current[1])
		
//	while(current = postalAddressesRegex.exec(string))
//	postalAddresses.push(current[1])

   //processing arrays
	webAddresses = web(webAddresses)
	pictures = get_real_links(pictures, url)
	videos = get_real_links(videos, url)
	songs = get_real_links(songs, url)
	emails = unique_elements(emails)

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
	
	console.log("webAddress");
	console.log(webAddresses);
	console.log("emails");
	console.log(emails);
	console.log("telephones");
	console.log(telephones);
	console.log("timeUnits");
	console.log(timeUnits);
	console.log("coordinates");
	console.log(coordinates);
	console.log("songs");
	console.log(songs);
	console.log("pictures");
	console.log(pictures);
	console.log("videos");
	console.log(videos);
	console.log("Social Media");
	console.log(socialMedias);
	console.log("postalAddresses");
	console.log(postalAddresses);
	
	var json = {
		"webAddresses": webAddresses,
		"emails": emails,
		"telephones": telephones,
		"coordinates": coordinates,
		"songs": songs,
		"pictures": pictures,
		"videos": videos,
		"social media": socialMedias,
		"postalAddresses": postalAddresses
		}
	var s =JSON.stringify(json);
	var bb = new BlobBuilder();
bb.append(s);
var blob = bb.getBlob(); 
location.href = window.webkitURL.createObjectURL(blob);
	
	

	//return a list of elements
	return listex.filter(x => !!x);

}



window.onload = onWindowLoad;