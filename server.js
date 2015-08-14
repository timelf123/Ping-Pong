var
	path = require('path'),
	net = require('net'),
	chalk = require('chalk'),
	jade = require('jade'),
	serveStatic = require('serve-static'),
	environment = process.env.NODE_ENV = process.env.NODE_ENV || 'production', // RUN LOCALLY WITH NODE_ENV=development node server.js
	app = require('./app.js'),
	leaderboard = require('./lib/leaderboard');
	Player = require('./models/Player'),
    //deprecating these
    getConfig = require('./config'),
    config = getConfig[environment],
    settings = getConfig.global;
	http = require('http');


global.settings = settings;

app.engine('jade', jade.__express);
app.use(serveStatic('./ui/public'));
app.locals.config = config;
app.locals.settings = settings;

_ = require('underscore');
io = require('socket.io');
moment = require('moment');

CORE = false;
CARDREADER = false;

if (CORE) {
	spark = require('sparknode');
	core = new spark.Core(settings.sparkCore);
}

if(CARDREADER) {
	cardReader = require('./lib/cardReader');
}

gameController = require('./classes/gameController');

game = {};
player = {};

var server = http.createServer(app);

// Setup socketio
io = io.listen(server);

var logLevel = 1; // production
if (environment === 'development') {
	logLevel = 3;
}

io.configure(function() {
	io.set('log level', logLevel);
});


app.get('/', function(req, res) {

	delete require.cache[path.resolve('./versions/js.json')];
	delete require.cache[path.resolve('./versions/css.json')];

	res.render('home.jade', {
		title: 'Ping Pong',
		metaDesc: 'Ping Pong',
		environment: environment,
		JSVersions: require('./versions/js'),
		CSSVersions: require('./versions/css')
	});
});

app.get('/maxScore', function(req, res){
    res.json(global.settings.maxScore);
});


app.get('/leaderboard', function(req, res) {
	// This could use a streaming response instead
	leaderboard.get(10)
		.then(function(players) {
			res.json(players.toJSON());
		});
});

server.listen(config.port);
console.log(chalk.green('Server: Listening on port ' + config.port));

game = new gameController();

game.feelersPingReceived();

io.sockets.on('connection', function(client) {
	game.reset();
	game.clientJoined();

	if (CARDREADER) {
		cardReader.connectionStatus();
	}

	if (environment === 'development') {
		client.on('fakeScored', game.feelerPressed); // Fake score event for easier testing
		client.on('fakeEndGame', function() {
			var record = (settings.recordUnfinishedGames !== 'undefined')? settings.recordUnfinishedGames : false;
			game.end(record);
		});
	}

	client.on('fakeJoin', function(data) { // fake rfid
		var name = data.name;
		var hash = '51d35d909e645b85e8ef72aad666a3f7'; // fpm5022@gmail by default yolo
		var url = 'http://www.gravatar.com/avatar/' + hash;
//http://www.gravatar.com/avatar/51d35d909e645b85e8ef72aad666a3f7
		// check if player name exists in db
		new Player({name: name})
		.fetch()
		.then(function(model) {
			if(model === null) {
				// no player with this name was found. let's create a new entry
				var randomRFID = Math.floor(Math.random() * 100000) + 1; // generate a random large rfid for now
				new Player({
					name : name,
					rfid : randomRFID,
					image : url
				}).save().then(function(model) {
					game.addPlayerByRfid(model.get('rfid'));
				});
			}
			else {
				rfid = model.get('rfid');
				game.addPlayerByRfid(model.get('rfid'));
			}
		});
	});

});


if (CORE) {
	core.on('scored', game.feelerPressed);
	core.on('endGame', function() {
		var record = (settings.recordUnfinishedGames !== 'undefined')? settings.recordUnfinishedGames : false;
		game.end(record);
	});
	core.on('ping', game.feelersPingReceived);
	core.on('batteryLow', game.batteryLow);

	core.on('online', function() {
		game.feelersOnline();
		game.feelerStatus();
		game.feelersPingReceived();
	});
}

if (CARDREADER) {
	cardReader.on('read', function(data) {
		console.log('New read', data);
		game.addPlayerByRfid(data.rfid);
	});

	cardReader.on('err', game.cardReadError);

	cardReader.on('connect', function() {
		io.sockets.emit('cardReader.connect');
	});

	cardReader.on('disconnect', function() {
		io.sockets.emit('cardReader.disconnect');
	});
}
