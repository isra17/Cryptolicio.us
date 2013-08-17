(function(){
    var lastClickedElement = null;

    var encryptElement = function(el) {

    };

    var decryptElement = function(msg) {
        chrome.extension.sendRequest({method: "decrypt_popup", msg: msg}, function(response){
        });
    };

    $(function(){
        $(window).mousedown(function(ev){
            lastClickedElement = ev.target;
        });
    });

    chrome.runtime.onMessage.addListener(function(msg){
        if(msg === "encrypt") {
            encryptElement(lastClickedElement);
        }

        if(msg === "decrypt") {
            //Small nasty hack because for some reasy it get called 10 time in a sec...

            _.throttle(decryptElement(window.getSelection().toString()), 1000);
        }
    });
})();