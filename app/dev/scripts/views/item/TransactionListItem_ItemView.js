define(['marionette', 'templates'], function(Marionette, templates) {
	return Marionette.ItemView.extend({

		template: templates.TransactionListItem_ItemView,

		// tagName: 'tr',

		// className: 'transaction',
		
		className: 'new-transactionitem',

		ui: {
			amount: '.amount',
			contactName: 'span.h4',
			budgetName: '.budget-name'
		},

		onShow: function() {
			console.log('[ItemView] Transaction List Item');
		},

		modelEvents: {
			'change:amount': 'amountChanged',
			'change:contactName': 'contactChanged',
			'change:date': 'dateChanged',
			'change:budgetName': 'budgetChanged'
		},

		amountChanged: function() {
			this.ui.amount.text( '$'+this.model.get('amount') );
		},

		contactChanged: function() {
			this.ui.contactName.text( this.model.get('contactName') );
		},

		dateChanged: function() {
			console.log('hi');
			this.trigger('dateChanged');
		},

		budgetChanged: function() {
			this.ui.budgetName.text( this.model.get('budgetName') );
		}

	});
});