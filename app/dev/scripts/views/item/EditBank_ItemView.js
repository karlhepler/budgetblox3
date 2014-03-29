define([
    // Initializers
    'marionette',
    'templates',

    // Views -----------

    // Collections -----------

    // Regions ------------------

    // Misc -------------------
    'pickadate'
],
function(
    // Initializers
    Marionette,
    templates

    // Views ------------

    // Collections ------------

    // Regions ----------------

) {
    return Marionette.ItemView.extend({

        template: templates.EditBank_ItemView,

        className: 'modal-dialog',

        ui: {
            title: '.modal-title',
            dateBtn: '#btn-date',
            name: '#name',
            amount: '#amount',
            date: '#date'
        },

        triggers: {
            'submit form': 'save'
        },

        onShow: function() {
            var that = this;
            console.log('[ItemView] Edit Bank');          

            // Initialize pickadate
            // NOTE: I CHANGED THE PICKADATE CODE - line picker.js:94 to force "button" type
            this.ui.dateBtn.pickadate({
                container: 'body',
                selectMonths: true,
                selectYears: true,
                max: new Date(), // Don't allow future dates
                onSet: function(rawDate) {
                    if ( typeof rawDate.select !== 'undefined' ) {
                        that.ui.date.val( (new Date(rawDate.select)).toLocaleDateString() );
                    }
                    else if ( typeof rawDate.highlight !== 'undefined' ) {
                        if ( rawDate.highlight instanceof Array ) {
                            that.ui.date.val( (parseInt(rawDate.highlight[1])+1) + '/' + rawDate.highlight[2] + '/' + rawDate.highlight[0] );
                        }
                        else {
                            that.ui.date.val( rawDate.highlight.obj.toLocaleDateString() );
                        }
                    }
                    else {
                        that.ui.date.val('');
                    }
                }
            });

            // Change the title
            this.ui.title.text( this.options.fn + ' Bank' );

            // Is there a model?
            if ( typeof this.model !== 'undefined' ) {
                // Remove the required requirements
                this.ui.name.removeAttr('required');
                this.ui.date.removeAttr('required');
                this.ui.amount.removeAttr('required');

                // This model is actually a collection, so I need to see how long the collection is
                if ( this.model.length > 1 ) {
                    // Change the title
                    this.ui.title.text( this.options.fn + ' [MULTIPLE] Banks' );
                }                
                // Use the first model in the collection as a reference
                var firstBank = this.model.at(0);
                // Setup variables that will be implanted into form fields
                var name = firstBank.get('name');
                var openingBalance = firstBank.get('openingBalance');
                var dateOpened = firstBank.get('dateOpened');

                // If all models don't have the same name, then change "name" to "Multiple Values"
                if ( this.model.where({name:name}).length < this.model.length ) {
                    name = '[MULTIPLE VALUES]';
                }
                if ( this.model.where({openingBalance:openingBalance}).length < this.model.length ) {
                    openingBalance = '[MULTIPLE VALUES]';
                }
                if ( this.model.where({dateOpened:dateOpened}).length < this.model.length ) {
                    dateOpened = '[MULTIPLE VALUES]';
                }

                // Append the values to the form fields
                this.ui.name.attr('placeholder',name);
                this.ui.date.attr('placeholder',dateOpened);
                this.ui.amount.attr('placeholder',openingBalance);
            }
        }

    });
});