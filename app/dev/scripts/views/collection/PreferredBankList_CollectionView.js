define([
	'marionette',
	'views/item/PreferredBankListItem_ItemView'
], function(
	Marionette,
	PreferredBankListItem_ItemView
) {
	return Marionette.CollectionView.extend({

		itemView: PreferredBankListItem_ItemView,

		tagName: 'tbody',

		appendHtml: function(collectionView, itemView, index) {
	    var childrenContainer = collectionView.itemViewContainer ? collectionView.$(collectionView.itemViewContainer) : collectionView.$el;
	    var children = childrenContainer.children();
	    if (children.size() <= index) {
	      childrenContainer.append(itemView.el);
	    } else {
	      children.eq(index).before(itemView.el);
	    }
	  },

	  onShow: function() {
	  	console.log('[CollectionView] Preferred Bank List');

	  	this.initDOM();
	  },

	  initDOM: function() {
	  	// Configure sortable
	  	this.$el.sortable({
	  	  axis: 'y',
	  	  handle: '.grippy',
	  	  cursor: 'ns-resize',
	  	  helper: function(event,elem) {
	  	  	console.log(event);
	  	  	return elem;
	  	  }
		  });
	  }

	});
});