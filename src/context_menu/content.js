(function(){
    var lastClickedElement = null;

    var encryptElement = function(el) {
        jEl = $(el);
        var emails = prompt('Please enter the emails of the recipients. Only those persons will be able to decrypt your message. If many, use ; to separate them.')

        if(emails) {
            var recipients = {
                email: emails.split(';')
            }
            var msg = jEl.val() || jEl.text();
            chrome.extension.sendRequest({method: "encrypt", recipients: recipients, message: msg}, function(response){
                console.log(response);
                jEl.val(response);
            });
        }
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