(function(context){
    context.KeyModel = {
        getPublicKey: function(){
            var publicKeys = openpgp.publicKeys;
            var keys = [];
            $.each(publicKeys, function(i, key) {
                var pubKey = key;
                var keyName = key.obj.userIds.length > 0? lastKey.obj.userIds[0].text: '';

                if(keyName) {
                    keys.push({
                        name: keyName,
                        key: pubKey
                    });
                }
            });

            return keys;
        }
    }
})(window)