$('form').submit(function(){
    var mail = $('#crypt-email').val() || '';
    var pass = $('#crypt-pass').val() || '';
    chrome.extension.sendRequest({method: "decrypt", senderEmail:mail, msg: msg, password: pass}, function(response){
        if (response.decrypted) {
            $('#crypt-msg').val(response.text);
        }
    });

    return false;
})

$(window).ready(function(){
    $('#crypt-msg').val(window.msg);
});