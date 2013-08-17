(function(){
    $(function(){
        $('#key-form').submit(function(e){
            $('#failed').hide();
            $('#done').hide();

            var form = $(this);
            var data = {
                bits: 2048,
                name: form.find('input[name=name]').val(),
                email: form.find('input[name=email]').val(),
                password: form.find('input[name=password]').val()
            };

            $('#wait').fadeIn(function(){
                var keyPair = Crypt.us.Options.generateKeyPair(data)
                if(keyPair) {
                    $('#wait').fadeOut();
                    $('#done').fadeIn();
                    if(form.find('input[name=mit]').val() === "on") {
                        $.post('http://pgp.mit.edu:11371/pks/add', {
                            keytext: keyPair.publicKeyArmored
                        });
                    }
                } else {
                    $('#wait').fadeOut();
                    $('#failed').fadeIn();
                }

            });

            return e.preventDefault();
        });
    })
})();

$(document).ready(function() {
    windowHeight = $(window).height() - 150;
    $('.max-height').css('min-height', windowHeight);

    $('body').animate({'opacity':'1'},500);
});

$('.jumbotron .btn').click(function() {
    $('html, body').animate({
        scrollTop: $(".setup-key").offset().top - 100
    }, 500);
});


$('#btn-step2').click(function() {
    $('html, body').animate({
        scrollTop: $(".share-key").offset().top
    }, 500);
});

$('#btn-step3').click(function() {
    $('html, body').animate({
        scrollTop: $(".add-keys").offset().top
    }, 500);
});