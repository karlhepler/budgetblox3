var mongoose = require('mongoose');
var defaults = require('./defaults');
var models = require('../models/index');


/**
 * DEFINE ROUTES
 */


exports.list = function(req, res) {
	return defaults.list( models.contacts(req), req, res );
};

exports.get = function(req, res) {
	return defaults.get( models.contacts(req), req, res );
};

exports.create = function(req, res) {
	return defaults.create( models.contacts(req), req, res );
};

exports.update = function(req, res) {
	return defaults.update( models.contacts(req), req, res );
};

exports.delete = function(req, res) {
	return defaults.delete( models.contacts(req), req, res );
};

exports.deleteAll = function(req, res) {
	return defaults.deleteAll( models.contacts(req), req, res );
};