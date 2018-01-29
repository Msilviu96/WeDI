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

function insert_array(array){
	var html = '';
	for(var i = 0; i<array.length; i++){
		html = html + '<li>'
		html = html + array[i]
		html = html + '</li>\n'
	}
	html = html + '</ul>\n';
	return html;
}
function listOfElements(string, url) {
	var json_html,c_contacts, c_timeUnits, c_coordinates, c_userProfiles, c_socialMedia, media; 	
	
	//list of regex
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
	
	
	chrome.storage.sync.get(['html', 'contactsV', 'timeUnitsV', 'urlsV', 'coordinatesV', 'userProfileV', 'mediaV'], function (items) {
	json_html = items.html;
	c_contacts = items.contactsV;
	c_timeUnits = items.timeUnitsV;
	c_urls = items.urlsV
	c_coordinates = items.urlsV;
	c_userProfiles = items.coordinatesV;
	c_socialMedia = items.userProfileV;
	media = items.mediaV;
	
	var file, file_type;	
	if(json_html == true){
		file_type = 'application/json';
		file = {
			"web addresses": webAddresses,
			"emails": emails,
			"telephones": telephones,
			"coordinates": coordinates,
			"time units": timeUnits,
			"songs": songs,
			"pictures": pictures,
			"videos": videos,
			"social media": socialMedias,
			"postal addresses": postalAddresses
		}
		
		if(c_contacts == false){
			delete file["telephones"];
			delete file["emails"];
			delete file["postal addresses"];
		}
		
		if(c_timeUnits == false)
			delete file["time units"];
		
		if(c_coordinates == false)
			delete file["coordinates"];
		
		if(c_userProfiles == false)
			delete file["social media"];
		
		if(c_urls == false)
			delete file["web addresses"];
		
		if(media == false){
			delete file["pictures"];
			delete file["songs"];
			delete file["videos"];
		}
		file = JSON.stringify(file)
	}
	else{
		file_type = 'text/plain';
		
		file =' <!DOCTYPE html>\n<html>\n<body>\n';
		if(c_urls == true){
			file= file +'<h2>Web addresses</h2>\n<ul>\n';
			file = file + insert_array(webAddresses);
		}
		
		if(c_contacts == true){
			file = file + '<h2>Telephones</h2>\n<ul>\n';
			file = file + insert_array(telephones);
			file = file + '<h2>Emails</h2>\n<ul>\n';
			file = file + insert_array(emails);
			file = file + '<h2>Postal addresses</h2>\n<ul>\n';
			file = file + insert_array(postalAddresses);
		}
		
		if(c_timeUnits == true){
			file = file + '<h2>Time units</h2>\n<ul>\n';
			file = file + insert_array(timeUnits);
		}
		
		if(c_coordinates == true){
			file = file + '<h2>Coordinates</h2>\n<ul>\n';
			file = file + insert_array(coordinates);
		}
		
		if(c_userProfiles == true){
			file = file + '<h2>Social media</h2>\n<ul>\n';
			file = file + insert_array(socialMedias);
		}
		
		if(media == true){
			file = file + '<h2>Songs</h2>\n<ul>\n';
			file = file + insert_array(songs);
			file = file + '<h2>Pictures</h2>\n<ul>\n';
			file = file + insert_array(pictures);
			file = file + '<h2>Videos</h2>\n<ul>\n';
			file = file + insert_array(videos);
		}
		file = file + '</head>\n</html>';
	}

	chrome.storage.sync.set({
		'file': file,
		'type': file_type
	});

});
	
	
	
	var div_export = document.getElementById('export');
	div_export.style.cursor = 'pointer';
	div_export.onclick = function() {
  		chrome.storage.sync.get(["file", "type"], function (item){
				

    var a = document.createElement('a');
    var blob = new Blob([item["file"]], {type : item["type"]});
    a.href = window.URL.createObjectURL(blob);
	if(item["type"] == "text/plain")
   		a.download = "export.html";
	else
		a.download = "export.json";
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click(); //this is probably the key - simulating a click on a download link
    delete a;// we don't need this anymore

			
		});
	};

	
	//return a list of elements
	return listex.filter(x => !!x);

}



window.onload = onWindowLoad;