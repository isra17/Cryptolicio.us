var defaultPGPExample = "-----BEGIN PGP MESSAGE-----" +
	"Version: OpenPGP.js v.1.20130420" +
	"Comment: http://openpgpjs.org " +
	"" +
	"wcBMAwQuk+AKf/NcAQf/SViVfKqSPdo5IV2CP/mvnwqq+Xkm9F58ZqXKaoPp" +
	"kTgVCKDwuoml2qSUtaSP/29IzuSWiyBjATFFWp2oHULJYZ8xMGSFWw8yCcg0" +
	"SjzbAyI+X4aL4budvSS4zZ2yH8tkOrQmGKvy0kTk03kIGzWefqZQ59RK1PAZ" +
	"8mrzm8VdDeoQH0VPlwypyK9eyMVNYAqO9JhJ07vb9oM7NFsx4h4THpVU8OvV" +
	"OT5fdTdzMgsdekrAVkJ5EbWNVX2mYHZlCkH40TbLljWt/MxsPg3XK88XK8xn" +
	"3MtgvVYazbE7Dxqmyq5OjUcYrnmRGwLrqYM3vEscqHQR6TVssG5cz61AxU7D" +
	"ntLCOgGsQNsnXDIy9+GMWmkBfuD7Ljh/KJ1qqrlYztt1Oku6XBusfRrI7rEl" +
	"lXLz44J4pDvhFbVt5pEc1F4QQfJgCvL4+JDVzmPzY4LLvaFsxQIWRGEwxirj" +
	"mofjDF19xj+XXn5sRlfhak1AMKzqprmuPTkBn7jm55N5BRHwoTaZN6c3ctJq" +
	"Vj21pbX8jOPHjiMTuThK9vlAW07d2nUSDxNqg+jnJS1J5JCAnIVJqeduAugn" +
	"IvD4Dd+z0LfCWr4gCFN7G5bxtgpef4svQGlMa4VqygUDXv+wWndBh4TWaCzI" +
	"Idic02/VPNjZneLIX+dP580ue/O21HwceV/fUGmGOZVOBn/5+B982993DHPP" +
	"mTThkawjoMAdUxLbTiBMQF+Dqqc05tAnXfp/tlG4NTyD2QkR1z64XyMeoT8D" +
	"l8Ra8OrMgmbWRpURk10VclM0iXlNOjYa9iFu6bc7mgJmQbn3v+vtV4BCw99O" +
	"+ROR0IVJlHe3BdGkS5Yx79I4zagQ8snmP4BuZbjnlAYdiIAP39j2hTBbGNHG" +
	"Nubt1zV2EQLqlFU583bnDTQwk81Ja/AJtJoVJlsiCBHQ6oFN4X4RTRXAUS/F" +
	"megTXj5p20BKOCrafNoxuiUBtQA3NMBwVm7zIT3YriioeMZoyO4gXgXLoiYw" +
	"Ap5L18HShi9EWmyMPic+/2PREwbKlqhHf80D5G/30pwVImAgRYK6yS4syqVV" +
	"LA472gqAEhJkcZAsagAd6LrvxpWNkcLrOqSPpP/kGpoic4lTUNV67sfQhkXF" +
	"r5/YZ8zF3XUCVLDmKmq4Ui5L5CD95NttBfl66KzXkCYBMQ6wRX6YC4umVJOP" +
	"7ygtIC4HsddBZ8PQCldHLbMIYT9i3753UMsauhIS+37fQ89LIWyy3CXFwcEu" +
	"u4QpA44dcELmW2P4jkuG1e5lOFRu7MVUJHKFYwAqFbSDRQHYQMlA4R1/g4on" +
	"nv0UwoCkghDQB6+CW8Br63ALbk0OH1OaeolOYmHHzydSFHt4nqXdN86IDCnH" +
	"/w==" +
	"=U1uU -----END PGP MESSAGE-----";



var express = require('express');
var app = express();

app.configure(function() {
	// dynamic helpers
	// app.use(helpers(config.app.name));

	// cookieParser should be above session
	app.use(express.cookieParser());

	// bodyParser should be above methodOverride
	app.use(express.bodyParser());
	app.use(express.methodOverride());
});

/******************/
/* DATABASE STUFF */
/******************/

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cryptolicious');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	console.log('yay!');
});

var EntrySchema = mongoose.Schema({
	email: String,
	value: String
});
var Entry = mongoose.model('Entry', EntrySchema);

var defaultEntry = new Entry({
	email: 'philippe.david0@gmail.com',
	value: defaultPGPExample
});

// defaultEntry.save(function (err, fluffy) {
//   if (err) // TODO handle the error
//   	console.log(err)
//   else
//   	console.log('saved');
// });

/************/
/* REST API */
/************/

app.get('/', function(req, res) {
	res.sendfile('index.html');
});

app.get('/api', function(req, res) {
	res.send('hello, you are missing a param :P');
});

app.post('/api', function(req, res) {
	console.log(req.param('email'));
	console.log(req.param('value'));
	console.log(req.params);

	var email = req.param('email');
	var value = req.param('value');
	if (email && value) {
		new Entry({
			email: email,
			value: value
		}).save(function(err) {

			if (err) {
				next();
			} else {
				console.log('Saved new Entry');
				res.send('200 OK');
			}
		});
	} else {
		res.send('missing something in your request ?');
	}
});

app.get('/api/:email', function(req, res) {
	res.json(req.entry);
});

/************************/
/*  REST PARAMS MAPPING */
/************************/
app.param('email', function(req, res, next, id) {

	console.log(id);
	if (id) {
		Entry.find({
			email: id
		}, function(err, entry) {
			console.log(err);
			console.log(entry);
			if (err) {
				next(err);
			} else if (entry) {
				req.entry = entry;
				next();
			} else {
				next(new Error('failed to load email'));
			}
		});
	}
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port 3000');