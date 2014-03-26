var mongoose = require('mongoose');
var schemas = require('../schemas/index');

/**
 * This gets the model - checks to see if the user is logged in
 * @param  {string} modelName 					The name of the model. ex. bank, budget, etc
 * @param  {mongoose.Schema} schema    	The mongoose schema
 * @param  {object} req       					The request object
 * @return {mongoose.model}           	Returns the correct mongoose model
 */
function getModel(modelName, schema, req) {
	if ( typeof req.user !== 'undefined' && req.user._id !== 'undefined' ) {
		console.log('*** USER: '+req.user._id.toString()+' ***');
		return mongoose.model(modelName, schema, modelName+'_'+req.user._id.toString());
	}
	else {
		console.log('*** NO USER ***');
		return mongoose.model(modelName, schema, modelName);
	}
}

/**
 * EXPORTS!
 */

exports.banks = function(req) { return getModel('banks', schemas.banks, req); };
exports.contacts = function(req) { return getModel('contacts', schemas.contacts, req) };
exports.budgets = function(req) { return getModel('budgets', schemas.budgets, req) };
exports.transactions = function(req) { return getModel('transactions', schemas.transactions, req) };
exports.logs = function(req) { return getModel('logs', schemas.logs, req) };