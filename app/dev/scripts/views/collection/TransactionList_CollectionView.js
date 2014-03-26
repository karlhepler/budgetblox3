define([
	'marionette',
	'views/item/TransactionListItem_ItemView'
], function(
	Marionette,
	TransactionListItem_ItemView
) {
	return Marionette.CollectionView.extend({

		itemView: TransactionListItem_ItemView,

		// tagName: 'tbody',
		id: 'new-transactionlist',

		appendHtml: function(collectionView, itemView, index){
	    var childrenContainer = collectionView.itemViewContainer ? collectionView.$(collectionView.itemViewContainer) : collectionView.$el;
	    var children = childrenContainer.children();
	    if (children.size() <= index) {
	      childrenContainer.append(itemView.el);
	    } else {
	      children.eq(index).before(itemView.el);
	    }
	  },

		onShow: function() {
			console.log('[CollectionView] Transaction List');
		},

		initialize: function() {
			this.on('itemview:dateChanged', function(view) {
				this.collection.sort();
				this.render();
			}, this);
		}

	});
});