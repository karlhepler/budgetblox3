define(['backbone', 'models/Transaction_Model'], function(Backbone, Transaction_Model) {

	return Backbone.Collection.extend({

		model: Transaction_Model,

		url: '/api/transactions',

		comparator: function(transaction) {
	    return -(new Date(transaction.get('date'))).getTime();
		}

	});
});