var mongoose = require('mongoose');

exports.list = function(model, req, res) {
	return model.find().exec(function(err, models) {
		if (!err) {
			return res.send(models);
		}
		else {
			return res.send(500,err);
		}		
	});
};
exports.get = function(model, req, res) {
	return model.findById( req.params.id, function(err, model) {
		if (!err && model != null) {
			return res.send(model);
		}
		else {
			return res.send(404,err);
		}		
	});
};
exports.create = function(model, req, res) {
	// Create the attributes
	var attributes = {};
	for ( var field in model.schema.paths ) {
		if ( (field !== '_id') && (field !== '__v') ) {
			if (req.body[field] !== undefined) {
				attributes[field] = req.body[field];
			}
		}
	}

	// Create the model
	var thisModel = new model(attributes);

	// Save the model
	thisModel.save(function(err) {
		if (!err)
		  return res.send(201,thisModel);

	  return res.send(500,err);
	});
};
exports.update = function(model, req, res) {
	// Find it!
	return model.findById(req.params.id, function(err, thisModel) {

		if ( !err && thisModel != null ) {
			// Set new values
			for ( var field in model.schema.paths ) {
				if ( (field !== '_id') && (field !== '__v') ) {
					if (req.body[field] !== undefined) {
						thisModel[field] = req.body[field];
					}
				}
			}

			// Save it!
			thisModel.save(function(err) {
				if (!err) {
					return res.send(200,thisModel);
				}
				else {
					return res.send(500,err);
				}				
			});
		}
		else {
			return res.send(404,err);
		}

	});
};
exports.delete = function(model, req, res) {
	// Find it
	return model.findById(req.params.id, function(err, thisModel) {
		if (!err && thisModel != null) {
			// Remove it
			thisModel.remove(function(err) {
				if (!err)
					return res.send(204);

				return res.send(500,err);
			});
		}
		else {
			return res.send(404,err);
		}		
	});
};
exports.deleteAll = function(model, req, res) {
	model.remove(function(err) {
		if (!err) {
			return res.send(204);
		}
		else {
			return res.send(500,err);
		}
	});
};