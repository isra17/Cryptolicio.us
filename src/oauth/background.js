var oauth = ChromeExOAuth.initBackgroundPage({
  'request_url': 'https://www.google.com/accounts/OAuthGetRequestToken',
  'authorize_url': 'https://www.google.com/accounts/OAuthAuthorizeToken',
  'access_url': 'https://www.google.com/accounts/OAuthGetAccessToken',
  'consumer_key': 'anonymous',
  'consumer_secret': 'anonymous',
  'scope': 'http://www.google.com/m8/feeds/',
  'app_name': 'Cryptolicio.us'
});


function onContacts(text, xhr, callback) {
  contacts = [];
  var data = JSON.parse(text);
  for (var i = 0, entry; entry = data.feed.entry[i]; i++) {
    var contact = {
      'name' : entry['title']['$t'],
      'id' : entry['id']['$t'],
      'emails' : []
    };

    if (entry['gd$email']) {
      var emails = entry['gd$email'];
      for (var j = 0, email; email = emails[j]; j++) {
        contact['emails'].push(email['address']);
      }
    }

    if (!contact['name']) {
      contact['name'] = contact['emails'][0] || "<Unknown>";
    }
    contacts.push(contact);
  }

  callback(contacts);
};

function getContacts(callback) {
  oauth.authorize(function() {
    console.log("on authorize");
    var url = "http://www.google.com/m8/feeds/contacts/default/full";
    oauth.sendSignedRequest(url, function(t,x){onContacts(t,x,callback);}, {
      'parameters' : {
        'alt' : 'json',
        'max-results' : 100
      }
    });
  });
};

function logout() {
  oauth.clearTokens();
  setIcon();
};

chrome.extension.onRequest.addListener(function(request,sender,sendResponse){
    if(request.method === 'get_contact') {
        console.log('get_contact request');
        getContacts(function(contacts){
            sendResponse(contacts)
        });
    }
});