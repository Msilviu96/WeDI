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


function createExportFile(webAddresses,
			 emails,
			 telephones,
			 coordinates,
			 timeUnits,
			 songs,
			 pictures,
			videos,
			socialMedias,
			postalAddresses){

	
	console.log("1 --------------------------------------------");

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

		//fileG = file;
		chrome.storage.sync.set({
		'type': file_type
	});
		exportFunc(file_type, file);
   });
	
	
	
	var div_export = document.getElementById('export');
	div_export.style.cursor = 'pointer';

	//return file;
}


function exportFunc(file_type, file){

	

	
				
		
    var a = document.createElement('a');
    var blob = new Blob([file], {type : file_type});
    a.href = window.URL.createObjectURL(blob);
	if(file_type == "text/plain")
   		a.download = "export.html";
	else
		a.download = "export.json";
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click(); //this is probably the key - simulating a click on a download link
    delete a;// we don't need this anymore

			
		
}



