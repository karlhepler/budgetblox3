define(['marionette', 'templates'], function(Marionette, templates) {
	return Marionette.ItemView.extend({

		template: templates.BudgetListItem_ItemView,

		tagName: 'table',

		className: 'budget',

		ui: {
			fundIcon: '.fund-icon',
			fundIconDragging: '.fund-icon.ui-draggable-dragging',
			name: '.h4',
			balance: '.fund-icon',
			dueDate: '.budget-dueDate-text',
			goal: '.budget-goal-text',
			limit: '.budget-limit-text',
			desc: '.desc'
		},

		onShow: function() {
			console.log('[ItemView] Budget List Item');

			this.initDOM();
		},

		events: {
			// 'click .info-block': 'toggleSelected',
			'click .info-block': 'toggleActive',
			'sortableDropped': 'sortableDropped' // This triggers from collection view when this is dropped during a sortable event
		},

		sortableDropped: function(e, index) {
			this.trigger('sort', index);
		},

		modelEvents: {
			'change:name': 'nameChanged',
			'change:dueDate': 'dueDateChanged',
			'change:balance': 'balanceChanged',
			'change:limit': 'limitChanged',
			'change:goal': 'goalChanged'
		},

		goalChanged: function() {
			// If the goal is hidden, then put it in there!
			if ( typeof this.ui.goal.context === 'undefined' ) {
				if ( this.ui.desc.children('.budget-goal-text').length === 0 ) {
					this.ui.limit.after('<span class="fancy">of</span><span class="budget-goal-text"></span>');
				}				
				this.ui.goal = this.ui.desc.children('.budget-goal-text');
			}
			// Set the goal text
			this.ui.goal.text( this.model.get('goal') );
		},

		limitChanged: function() {
			this.ui.limit.text( this.model.get('limit') );
		},

		balanceChanged: function() {
			this.ui.balance.text( this.model.get('balance') );
		},

		dueDateChanged: function() {
			// If the dueDate is hidden, then put it in there!
			if ( typeof this.ui.dueDate.context === 'undefined' ) {
				if ( this.ui.desc.children('.budget-dueDate-text').length === 0 ) {
					this.ui.desc.append('<span class="fancy">by</span><span class="budget-dueDate-text"></span>');
				}				
				this.ui.dueDate = this.ui.desc.children('.budget-dueDate-text');
			}
			// Set the due date text
			this.ui.dueDate.text( this.model.get('dueDate') );
		},
		
		nameChanged: function() {
			this.ui.name.text( this.model.get('name') );
		},

		toggleActive: function() {
			if ( this.model.get('selected') === true ) {
				this.model.set({selected: false});
			}
			else {
				this.model.set({selected: true});
			}
			// Toggle the active class on this $el and trigger a toggled event
			this.$el.toggleClass('active');
			this.trigger('toggled');
		},

		initDOM: function() {
			var that = this;

			// Set this as active if the model is selected
			if ( this.model.get('selected') === true ) {
				this.toggleActive();
			}

			// Configure drag and drop budget icons
			this.ui.fundIcon.draggable({
			  helper: 'clone',
			  containment: '.sidebar',
			  scrollSensitivity: 30,
			  scrollSpeed: 10,
			  start: function(e, ui) {
			  	$(this).addClass('absolute-fund-icon');
			  },
			  stop: function(e, ui) {
			  	$(this).removeClass('absolute-fund-icon');
			      $('#budget-bank-container .in').removeClass('scroll-visible');    
			  },
			  drag: function(e, ui) {
		      if ( (ui.offset.top >= $('#budget-bank-container .in > div').offset().top && $('#budget-bank-container .in').hasClass('scroll-visible')) ||                         
		           (ui.offset.top < $('#budget-bank-container .in > div').offset().top && !$('#budget-bank-container .in').hasClass('scroll-visible')) ) {

		          $('#budget-bank-container .in').toggleClass('scroll-visible');
		          if ( $('#budget-bank-container .in').height() ==  $('#budget-bank-container .in > div').height() ) {
		              $('#budget-bank-container .in').toggleClass('undo-scroll-margin');
		          }
		      }
			  }
			}).droppable({
			  over: function(e, ui) {
			      $('.fund-icon.ui-draggable-dragging').addClass('cursor-copy');
			      $(this).addClass('bg-color-income');
			      ui.draggable.addClass('bg-color-expense');
			  },
			  out: function(e, ui) {
			      $('.fund-icon.ui-draggable-dragging').removeClass('cursor-copy');
			      $(this).removeClass('bg-color-income');
			      ui.draggable.removeClass('bg-color-expense');
			  },
			  drop: function(e, ui) {
				  	$('.fund-icon.ui-draggable-dragging').removeClass('cursor-copy');

			      $('#scroll-stopper').show();

			      $(this).popover({
			          container: '#scroll-stopper',
			          placement: 'right',
			          trigger: 'manual',
			          html: true,
			          title: 'MOVE FUNDS <button type="button" class="close" aria-hidden="true">&times;</button>',
			          content: '<form role="form"><table><tbody><tr><td><input style="width:5em;" type="text" class="form-control" autofocus required></td><td><span style="margin:0 10px;" class="fancy">of</span><span>'+ui.draggable.text()+'</span></td></tr></tbody></table</form>'
			      })
			      .popover('show');

			      var $that = $(this);
			      $('#scroll-stopper, .popover .close').click(function(e) {
			          $that.popover('destroy');
			          $('#scroll-stopper').hide();
			          $that.removeClass('bg-color-income');
			          ui.draggable.removeClass('bg-color-expense');
			      });
			  }
			});
		}

	});
});