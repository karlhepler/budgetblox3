// NODE_ENV=development node server.js
// NODE_ENV=production node server.js


/**
 * Module dependencies.
 */

var express = require('express');

// WEB ROUTES
var routes = require('./routes');

// API ROUTES
var banks = require('./routes/banks');
var budgets = require('./routes/budgets');
var transactions = require('./routes/transactions');
var contacts = require('./routes/contacts');

// INCLUDES
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');


/**
 * CONNECT TO MONGOOSE
 */
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/budgetblox3';
mongoose.connect( mongoUri );
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('DB CONNECTION SUCCESSFUL!');
});


/**
 * START THE APP
 */
var app = express();

/**
 * SETUP ALL ENVIRONMENTS
 */
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('cookiecalifragilisticexpialidocious'));
app.use(express.session());
app.use(app.router);


/**
 * OPTIONS FOR DEVELOPMENT / PRODUCTION
 */
if ('development' == app.get('env')) {
	console.log( __dirname + '/../app/dev' );
	app.use(require('less-middleware')({ src: __dirname + '/../app/dev' }));
	app.use(express.static(path.join(__dirname, '../app/dev')));

  app.use(express.errorHandler());
}
else if ('production' == app.get('env')) {
	console.log( __dirname + '/../app/dist' );
	app.use(require('less-middleware')({ src: __dirname + '/../../app/dist' }));
	app.use(express.static(path.join(__dirname, '../../app/dist')));
}
else {
	console.log('ERROR: Production or Development?');
}


/**
 * LIST OUT ALL THE ROUTES AND ASSIGN ROUTE FILES
 */
app.get('/', routes.index);

// banks
app.get('/api/banks', banks.list);
app.get('/api/banks/:id', banks.get);
app.post('/api/banks', banks.create);
app.put('/api/banks/:id', banks.update);
app.delete('/api/banks/:id', banks.delete);
app.delete('/api/banks', banks.deleteAll);

// contacts
app.get('/api/contacts', contacts.list);
app.get('/api/contacts/:id', contacts.get);
app.post('/api/contacts', contacts.create);
app.put('/api/contacts/:id', contacts.update);
app.delete('/api/contacts/:id', contacts.delete);
app.delete('/api/contacts', contacts.deleteAll);

// budgets
app.get('/api/budgets', budgets.list);
app.get('/api/budgets/:id', budgets.get);
app.post('/api/budgets', budgets.create);
app.put('/api/budgets/:id', budgets.update);
app.delete('/api/budgets/:id', budgets.delete);
app.delete('/api/budgets', budgets.deleteAll);

// transactions
app.get('/api/transactions', transactions.list);
app.get('/api/transactions/:id', transactions.get);
app.post('/api/transactions', transactions.create);
app.put('/api/transactions/:id', transactions.update);
app.delete('/api/transactions/:id', transactions.delete);
app.delete('/api/transactions', transactions.deleteAll);

/**
 * CREATE THE SERVER AND LISTEN TO THE PORT
 */
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});