var mongoose = require('mongoose');
var defaults = require('./defaults');
var models = require('../models/index');


/**
 * DEFINE ROUTES
 */


exports.list = function(req, res) {
	return defaults.list( models.vendors(req), req, res );
};

exports.get = function(req, res) {
	return defaults.get( models.vendors(req), req, res );
};

exports.create = function(req, res) {
	return defaults.create( models.vendors(req), req, res );
};

exports.update = function(req, res) {
	return defaults.update( models.vendors(req), req, res );
};

exports.delete = function(req, res) {
	return defaults.delete( models.vendors(req), req, res );
};

exports.deleteAll = function(req, res) {
	return defaults.deleteAll( models.vendors(req), req, res );
};