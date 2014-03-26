define(['backbone', 'models/Bank_Model'], function(Backbone, Bank_Model) {

	return Backbone.Collection.extend({

		model: Bank_Model,

		url: '/api/banks'

		// comparator: 'priority'

	});
});