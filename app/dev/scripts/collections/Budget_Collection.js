define(['backbone', 'models/Budget_Model'], function(Backbone, Budget_Model) {

	return Backbone.Collection.extend({

		model: Budget_Model,

		url: '/api/budgets'

	});
});