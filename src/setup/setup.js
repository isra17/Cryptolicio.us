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
                    $('#share-key').animate({'opacity':'1'},500);
                    if(form.find('input[name=mit]').val() === "on") {
                        $.post('http://pgp.mit.edu:11371/pks/add', {
                            keytext: keyPair.publicKeyArmored
                        });
                    }
                } else {
                    $('#wait').fadeOut();                }

            });

            return e.preventDefault();
        });
    })
})();

$(document).ready(function() {
    windowHeight = $(window).height();
    $('.max-height').css('min-height', windowHeight);

    $('body').animate({'opacity':'1'},1000);

    getPublicKey();
});

$(window).scroll( function(){
    
        /* Check the location of each desired element */
        $('.hideme').each( function(i){
            
            var bottom_of_object = $(this).position().top + $(this).outerHeight() - 500;
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            
            /* If the object is completely visible in the window, fade it it */
            if( bottom_of_window > bottom_of_object ){
                
                $(this).animate({'opacity':'1'},500);
                    
            }
            
        }); 
    
    });

function scrollToAnchor(href){
    var parts = href.split("#");
    var aid = parts[1];
    var tag = $("a[name='"+ aid +"']");
    $('html,body').animate({scrollTop: tag.offset().top},'slow');
};


$('.btn-scroll').click(function() {
    event.preventDefault();
    scrollToAnchor(this.href);
});

$('#share-key').click(function() {
    getPublicKey();
});

function getPublicKey(){
    var keys = openpgp.keyring.privateKeys;
    var lastKey = keys.length > 0? keys[keys.length - 1]: null;
    if(lastKey) {
      var pubKey = lastKey.obj.extractPublicKey();
      var keyName = lastKey.obj.userIds.length > 0? lastKey.obj.userIds[0].text: 'Unnamed key';
      $('#key-txtarea').val(pubKey);
    }
}