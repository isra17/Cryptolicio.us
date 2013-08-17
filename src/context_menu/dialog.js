$('form').submit(function(){
    var mail = $('#crypt-email').val() || '';
    var pass = $('#crypt-pass').val() || '';
    chrome.extension.sendRequest({method: "decrypt", senderEmail:mail, msg: msg, password: pass}, function(response){
        if (response.decrypted) {
            $('#crypt-msg').html(response.text);
            $('#crypt-msg').removeClass('enc');
        }
    });

    return false;
})

$(window).ready(function(){
    $('#crypt-msg').text(window.msg);
});