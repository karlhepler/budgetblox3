define(['backbone', 'models/Contact_Model'], function(Backbone, Contact_Model) {

	return Backbone.Collection.extend({

		model: Contact_Model,

		url: '/api/contacts'

	});
});