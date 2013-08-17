(function(context){
	var host = 'http://pgp.mit.edu:11371';

	context.KeyServer = {		
		search: function(term){
			var defer = $.Deferred();

			$.get(host + '/pks/lookup', {
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

			$.get(host + url)
			.done(function(data){
				var xmlResponse = $(data);
				defer.resolve(xmlResponse.filter('pre').text());
			})
			.fail(defer.reject);

			return defer;
		}
	}

})(window)