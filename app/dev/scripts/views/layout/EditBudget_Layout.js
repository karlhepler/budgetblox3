define([
    // Initializers
    'marionette',
    'templates',

    // Views -----------
    'views/collection/PreferredBankList_CollectionView',

    // Collections -----------
    'collections/Bank_Collection',

    // Regions ------------------

    // Misc -------------------
    'pickadate'
],
function(
    // Initializers
    Marionette,
    templates,

    // Views ------------
    PreferredBankList_CollectionView,

    // Collections ------------
    Bank_Collection

    // Regions ----------------

) {
    return Marionette.Layout.extend({

        template: templates.EditBudget_Layout,

        className: 'modal-dialog',

        regions: {             
            banks: '.preferred-bank-list-region'
        },

        ui: {
            title: '.modal-title',
            dateBtn: '#btn-date',
            dueDate: '#dueDate',
            limit: '#limit',
            name: '#name',
            banksPanelTitle: '#banks-panel-title'
        },

        events: {
            'click .btn-hide-panel, .btn-show-panel': 'togglePanel'
        },

        triggers: {
            'submit form': 'save'
        },

        togglePanel: function(e) {
            e.preventDefault();

            // Only do this if not clicking on active button
            if ( !$(e.currentTarget).hasClass('active') ) {
                // Toggle disabled inputs
                var $checkboxes = $('input[type="checkbox"][name="_banks"]');
                $checkboxes.prop('disabled', $checkboxes.prop('disabled') ? false : true );

                // Now toggle the panel
                $(e.currentTarget).parents('.panel').children('.panel-collapse').collapse('toggle');
            }            
        },

        onShow: function() {
            var that = this;
            console.log('[Layout] Edit Budget');

            // Initialize pickadate
            // NOTE: I CHANGED THE PICKADATE CODE - line picker.js:94 to force "button" type
            this.ui.dateBtn.pickadate({
                container: 'body',
                selectMonths: true,
                selectYears: true,
                min: new Date(),
                onSet: function(rawDate) {
                    if ( typeof rawDate.select !== 'undefined' ) {
                        that.ui.dueDate.val( (new Date(rawDate.select)).toLocaleDateString() );
                    }
                    else if ( typeof rawDate.highlight !== 'undefined' ) {
                        if ( rawDate.highlight instanceof Array ) {
                            that.ui.dueDate.val( (parseInt(rawDate.highlight[1])+1) + '/' + rawDate.highlight[2] + '/' + rawDate.highlight[0] );
                        }
                        else {
                            that.ui.dueDate.val( rawDate.highlight.obj.toLocaleDateString() );
                        }
                    }
                    else {
                        that.ui.dueDate.val('');
                    }
                }
            });

            // Change the title
            this.ui.title.text( this.options.fn + ' Budget' );
            
            var banks = this.options.bank_collection;
            var isCustomized = false;
            if ( typeof this.model !== 'undefined' ) {
                // Remove required requirements
                this.ui.limit.removeAttr('required');
                this.ui.name.removeAttr('required');

                // This model is actually a collection, so I need to see how long the collection is
                if ( this.model.length > 1 ) {
                    // Change the title
                    this.ui.title.text( this.options.fn + ' [MULTIPLE] Budgets' );

                    // Change the banks panel title and disable the buttons
                    this.ui.banksPanelTitle.text('Banks [NO MULTIPLE EDIT]');
                    this.$el.find('.btn-hide-panel').addClass('disabled');
                    this.$el.find('.btn-hide-panel > input[name="showBanks"]').prop('disabled',true);
                }
                else {
                    // First see if model.banks is in the same order as the actual banks
                    // var modelBanks = new Bank_Collection(this.model.at(0).get('banks'));
                    var modelBanks = this.model.at(0).get('banks');
                    if ( modelBanks.length > 0 ) {
                        isCustomized = true;
                    }

                    
                    if ( isCustomized ) {
                        // Show the panel
                        this.$el.find('.panel-collapse').collapse('show');                        
                        // Switch the buttons to show custom
                        this.$el.find('.btn-hide-panel > input[name="showBanks"][value="false"]')
                            .prop('checked',false)
                            .parent().removeClass('active')
                            .next().addClass('active')
                            .children().prop('checked',true);

                        // Create a new collection, starring the banks from budget city
                        // banks = modelBanks;
                        banks = new Bank_Collection();
                        for (var i = 0; i < modelBanks.length; i++) {
                            banks.add( this.options.bank_collection.get(modelBanks[i]) );
                            console.log(modelBanks[i]);
                        };                        

                        // Now find out which banks aren't in there and stamp them with checked:false
                        var otherBanks = this.options.bank_collection.reject(function(model) {
                            var exists = false;
                            for (var i = banks.length - 1; i >= 0; i--) {
                                if ( banks.at(i).get('_id') === model.get('_id') ) {
                                    exists = true;
                                    break;
                                }
                            };
                            return exists;
                        } );

                        for (var i = banks.length - 1; i >= 0; i--) {
                            banks.at(i).set({
                                isCustomized: true,
                                checked: true
                            });
                        };
                        for (var i = otherBanks.length - 1; i >= 0; i--) {
                            otherBanks[i].set({
                                isCustomized: true,
                                checked: false
                            });
                        };

                        // Now append otherBanks to banks
                        banks.add(otherBanks);

                        console.log(banks);
                    }
                }

                // Use the first model in the collection as a reference to test similar values
                var firstBudget = this.model.at(0);
                // Setup variables that will be implanted in the form fields
                var name = firstBudget.get('name');
                var limit = firstBudget.get('goal') === null ? firstBudget.get('limit') : firstBudget.get('goal');
                var dueDate = firstBudget.get('dueDate') !== null ? firstBudget.get('dueDate') : null;
                // var banks = firstBudget.get('banks');

                // If all budget values don't have the same value, then change it to "MULTIPLE VALUES"
                if ( this.model.where({name:name}).length < this.model.length ) {
                    name = '[MULTIPLE VALUES]';
                }
                if ( this.model.where({limit:limit}).length < this.model.length ) {
                    limit = '[MULTIPLE VALUES]';
                }
                if ( this.model.where({dueDate:dueDate}).length < this.model.length ) {
                    dueDate = '[MULTPLE VALUES]';
                }

                // Append the values to the form fields
                this.ui.name.attr('placeholder',name);
                if (dueDate !== null) this.ui.dueDate.attr('placeholder',dueDate);
                this.ui.limit.attr('placeholder',limit);
            }

            // Show the banks collection view
            this.banks.show( new PreferredBankList_CollectionView({
                collection: banks,
                isCustomized: isCustomized
            }) );
        }

    });
});