define([
	'marionette',
	'views/item/BankListItem_ItemView'
], function(
	Marionette,
	BankListItem_ItemView

) {
	return Marionette.CollectionView.extend({

		itemView: BankListItem_ItemView,

		appendHtml: function(collectionView, itemView, index){
	    var childrenContainer = collectionView.itemViewContainer ? collectionView.$(collectionView.itemViewContainer) : collectionView.$el;
	    var children = childrenContainer.children();
	    if (children.size() <= index) {
	      childrenContainer.append(itemView.el);
	    } else {
	      children.eq(index).before(itemView.el);
	    }
	  },

	  initialize: function() {
	  	// Catch the toggled trigger from the item view
	  	this.on('itemview:toggled', function(view) {
	  		if ( this.$el.children().hasClass('active') ) {
	  			this.trigger('showPanelTitleButtons');
	  		}
	  		else {
	  			this.trigger('hidePanelTitleButtons');
	  		}
	  	});
	  	// Catch the sort trigger from the item view
	  	this.on('itemview:sort', function(view, index) {
				// Remove the model, add it back at index, and redo all priorities
				var model = this.collection.remove(view.model, { silent: true });
				this.collection.add( model, { silent: true, at: index } );
				for (var i = this.collection.length - 1; i >= 0; i--) {
					this.collection.at(i).set('priority',i);
					// Only save the changed values
					if ( this.collection.at(i).hasChanged() ) {
						this.collection.at(i).save();
					}
				};
	  	});
	  },

		onShow: function() {
			console.log('[CollectionView] Bank List');

			// Initialize the DOM
			this.initDOM();
		},

		initDOM: function() {
			// Configure sortable
			this.$el.sortable({
			  axis: 'y',
			  scroll: true,
			  scrollSensitivity: 35,
			  helper: 'clone',
			  handle: '.grippy',
			  cursor: 'ns-resize',
			  stop: function(e, ui) {
			      ui.item.trigger('sortableDropped',ui.item.index());
			  }
			});
		}

	});
});