function getResultsFromMIT(query) {
	// Get search results from query
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://pgp.mit.edu:11371/pks/lookup?search=" + query, true);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
	    
	    
	    $.parseHTML(xhr.responseText).find("");

	    var rgx = /href=\"(.+?)\"/igm;
	    var href = rgx.exec(xhr.responseText);
	    console.log(href);
	    getKeyFromMIT(href);	
	    console.log('href!');    
	  }
	}
	xhr.send();
}

function getKeyFromMIT(href) {
	// With results get key
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "http://pgp.mit.edu:11371" + href, true);
    xhr2.onreadystatechange = function() {
  		if (xhr2.readyState == 4) {
  			// Return public key
  			var html = $.parseHTML(xhr2.responseText);
  			return html[4].innerHTML;
  		}
	}

	return xhr2.send();
}