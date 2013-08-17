(function(){
	"use strict";

	function onInstall() {
		console.log("Installation of Cryptolicio.us");
		console.log("Open setup tutorial");
        chrome.tabs.create({'url': "setup/setup.html"});
	}

	// Check whether new version is installed
	chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        onInstall();
    }
});
})();