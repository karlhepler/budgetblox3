define(['marionette', 'templates'], function(Marionette, templates) {
	return Marionette.ItemView.extend({

		template: templates.BankListItem_ItemView,

		tagName: 'table',

		className: 'bank',

		ui: {
			fundIcon: '.fund-icon',
			fundIconDragging: '.fund-icon.ui-draggable-dragging',
			name: '.h4',
			expectedIncome: '.bank-expected-income-text',
			balance: '.fund-icon'
		},

		onShow: function() {
			console.log('[ItemView] Bank List Item');

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
			'change:balance': 'balanceChanged',
			'change:expectedIncome': 'expectedIncomeChanged'
		},

		nameChanged: function() {
			this.ui.name.text( this.model.get('name') );
		},

		balanceChanged: function() {
			this.ui.balance.text( this.model.get('balance') );
		},

		expectedIncomeChanged: function() {
			this.ui.expectedIncome.text( this.model.get('expectedIncome') );
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