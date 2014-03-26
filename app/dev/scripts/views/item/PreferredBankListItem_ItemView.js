define([
	'marionette',
	'templates'
], function(
	Marionette,
	templates
) {
	return Marionette.ItemView.extend({

		template: templates.PreferredBankListItem_ItemView,

		tagName: 'tr',

		ui: {
			input: 'input'
		},

		onShow: function() {
			console.log('[ItemView] Preferred Bank List Item', this.model);

			if ( typeof this.model.get('checked') !== 'undefined' ) {
				this.ui.input.prop('checked',this.model.get('checked'));
				// this.model.unset('checked','silent');
			}
		}

	});
});