(function(){
    $(function(){
        // Bad hack because the event is sent twice :(
        $('#key-form').submit(function(e){
            $('#failed').hide();
            $('#done').hide();

            var form = $(this);
            var email = form.find('input[name=email]').val();
            var data = {
                bits: 2048,
                name: form.find('input[name=name]').val(),
                email: email,
                password: form.find('input[name=password]').val()
            };

            $('#wait').fadeIn(function(){
                var keyPair = Crypt.us.Options.generateKeyPair(data)
                if(keyPair) {
                    $('#wait').fadeOut();
                    $('#done').fadeIn();
                    $('#share-key').animate({'opacity':'1'},500);
                    if(form.find('input[name=mit]').val() === "on") {
                        KeyServer.post(email, keyPair.publicKeyArmored);
                    }
                } else {
                    $('#wait').fadeOut();                }

            });

            return false;
        });

        $('#sync_contact').click(function(){
            chrome.extension.sendRequest({
                method:'get_contact'
            }, function(contacts){
                $.each(contacts, function(i, contact){
                    $.each(contact.emails, function(i, email){
                        KeyServer.getAll(email)
                        .done(function(keys){
                            Crypt.us.Options.importKeys(keys);
                        });
                    });
                });

                // Add some feedback
            });
        });

        $('#searchKey').submit(searchKey);
    });

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

   function parsePublicKeys(){
      var keys = openpgp.keyring.publicKeys;
      $('#publicKeyTable>tbody>tr').remove();
      for(var k=0;k<keys.length;k++){
          var key = keys[k];
          var user = gCryptUtil.parseUser(key.obj.userIds[0].text);
          $('#publicKeyTable>tbody').append(
              '<tr><td>'+user.userName+'</td>'+
              '<td>'+user.userEmail+'</td>'+
              '<td>'+util.hexstrdump(key.keyId)+'</td>'+
              '<td><a href="#public'+k+'" data-toggle="modal">Show key</a><div class="modal" id="public'+k+'">'+
                  '<a href="#" class="close" data-dismiss="modal">Close</a><br/ ><textarea>'+key.armored+'</textarea></div></td>'+
              '<td class="removeLink" id="'+k+'"><a href="#">Remove</a></td></tr>');
          $('#public'+k).hide();
          $('#public'+k).modal({backdrop: true, show: false});
      }
      $('#publicKeyTable .removeLink').click(function(e){
        openpgp.keyring.removePublicKey(e.currentTarget.id);
        openpgp.keyring.store();
        parsePublicKeys();
        });
   }

function searchKey(event) {
        var self = $(this);
        var email = self.find('#search_term').val();
        var listEl = self.find('ul');
        listEl.fadeIn();
        KeyServer.getAll(email)
        .done(function(keys){
            $.each(keys, function(i, key){
                openpgp.keyring.importPublicKey(key);
            })

            openpgp.keyring.store();
            parsePublicKeys();
        });

        event.preventDefault();
        return false;
    }

function getPublicKey(){
    var keys = openpgp.keyring.privateKeys;
    var lastKey = keys.length > 0? keys[keys.length - 1]: null;
    if(lastKey) {
      var pubKey = lastKey.obj.extractPublicKey();
      var keyName = lastKey.obj.userIds.length > 0? lastKey.obj.userIds[0].text: 'Unnamed key';
      $('#key-txtarea').val(pubKey);
    }
}