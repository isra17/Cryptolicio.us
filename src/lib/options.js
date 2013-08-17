(function(context){
    var Crypt = {us: {Options:{}}};

    Crypt.us.Options.generateKeyPair = function(data){
        var form = $('#generateKeyPairForm');
        var keyPair = openpgp.generate_key_pair(1,data.bits, data.name + ' <' + data.email + '>', data.password);
        openpgp.keyring.importPrivateKey(keyPair.privateKeyArmored, data.password);
        keyPair.publicKeyArmored = keyPair.publicKeyArmored.replace(/\n\s+\n=/, '\n=');
        openpgp.keyring.importPublicKey(keyPair.publicKeyArmored);
        openpgp.keyring.store();

        return keyPair;
    }

    openpgp.init();

    context.Crypt = Crypt;
})(window);