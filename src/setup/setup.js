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
    windowHeight = $(window).height();
    $('.max-height').css('min-height', windowHeight);

    $('body').animate({'opacity':'1'},500);
});

function scrollToAnchor(href){
    var parts = href.split("#");
    var aid = parts[1];
    var tag = $("a[name='"+ aid +"']");
    $('html,body').animate({scrollTop: tag.offset().top - 50},'slow');
};

$('.btn-scroll').click(function(btn) {
    event.preventDefault();
    scrollToAnchor(this.href);
});