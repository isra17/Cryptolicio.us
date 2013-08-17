(function(context){
	var mitHost = 'http://pgp.mit.edu:11371';

	var MitKeyServer = {
		search: function(term){
			var defer = $.Deferred();

			$.get(mitHost + '/pks/lookup', {
				search: term,
				op: 'index'
			})
			.done(function(data){
				var xmlResponse = $(data);
				var itemRows = xmlResponse.filter('pre:not(:first)')
				var items = [];
				itemRows.each(function(){
					self = $(this);
					items.push({
						keyUrl: self.find('a:first').attr('href'),
						date: self.contents()[2].textContent.trim(),
						name: self.find('a:nth(1)').text()
					});
				});
				defer.resolve(items);
			})
			.fail(defer.reject);

			return defer;
		},

		get: function(url){
			var defer = $.Deferred();

			$.get(mitHost + url)
			.done(function(data){
				var xmlResponse = $(data);
				defer.resolve(xmlResponse.filter('pre').text());
			})
			.fail(defer.reject);

			return defer;
		}
	}

	var ourHost = 'http://184.107.194.202'

	var CryptoliciousKeyServer = {
		getAll: function(email){
			var defer = $.Deferred();
			$.get(ourHost + '/api/' + email)
			.done(function(response){
				var keys = [];
				$.each(response, function(key, val){
					keys.push(decodeURIComponent(val.value));
				});
				defer.resolve(keys);
			})
			.fail(defer.fail);

			return defer;
		},

		post: function(email, key){
			$.post(ourHost + '/api/', {
				email: email,
				value: encodeURIComponent(key)
			});
		}
	}

	window.KeyServer = CryptoliciousKeyServer;

})(window)