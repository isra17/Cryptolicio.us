(function(){
    $(function(){
        $('#key-form').submit(function(e){
            var form = $(this);
            var data = {
                bits: 2048,
                name: form.find('input[name=name]').val(),
                email: form.find('input[name=email]').val(),
                password: form.find('input[name=password]').val()
            };

            $('#wait').fadeIn(function(){
                var keyPair = Crypt.us.Options.generateKeyPair(data)
                $('#wait').fadeOut();
                $('#done').fadeIn();
                if(form.find('input[name=mit]').val() === "on") {
                    $.post('http://pgp.mit.edu:11371/pks/add', {
                        keytext: keyPair.publicKeyArmored
                    });
                }
            });            

            return e.preventDefault();
        });
    })
})();