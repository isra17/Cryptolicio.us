(function(){
    var lastClickedElement = null;

    var encryptElement = function(el) {

    };

    var decryptElement = function(msg) {
        console.log(msg);
        chrome.extension.sendRequest({method: "decrypt", senderEmail:'isra017@gmail.com', msg: msg, password: 'isra'}, function(response){
            console.log(response);
            if (response.decrypted) {
                console.log(response.decrypted);
            }
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
            console.log('decrypt');
            decryptElement(window.getSelection().toString());
        }
    });
})();