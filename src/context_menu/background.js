(function(){
    var onEncrypt = function(info, tab) {
        chrome.tabs.sendMessage(tab.id, "encrypt");
    };

    var onDecrypt = function(info, tab) {
        chrome.tabs.sendMessage(tab.id, "decrypt");
    };

    chrome.contextMenus.create({"title": "Encrypt...", "contexts":["editable"], "onclick": onEncrypt});
    chrome.contextMenus.create({"title": "Decrypt...", "contexts":["selection"], "onclick": onDecrypt});

    chrome.extension.onRequest.addListener(function(request,sender,sendResponse){
        if(request.method === 'decrypt_popup') {
            var popup = window.open('context_menu/dialog.html', '_blank', '');
            popup.msg = request.msg;

        }
    });
})();
