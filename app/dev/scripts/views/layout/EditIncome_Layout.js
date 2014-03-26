define([
    // Initializers
    'marionette',
    'templates',
    'backbone.typeahead',

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
    return Marionette.Layout.extend({

        template: templates.EditIncome_Layout,

        className: 'modal-dialog',

        regions: {             
            bankTypeaheadRegion: '#bank-typeahead',
            contactTypeaheadRegion: '#contact-typeahead'
        },

        ui: {
            dateBtn: '#btn-date',
            date: '#date',
            title: '.modal-title'
        },

        events: {
            
        },

        triggers: {
            'submit form': 'save'
        },

        onShow: function() {
            var that = this;
            console.log('[Layout] Edit Income');

            // Change the title
            this.ui.title.text( this.options.fn + ' Income' );

            // Show the bank typeahead
            var bankTypeahead = new Backbone.Typeahead({ collection: this.options.bank_collection });
            this.bankTypeaheadRegion.show( bankTypeahead );
            // Fix the input
            $(this.bankTypeaheadRegion.el).find('input').attr({
                required: 'required',
                id: 'bank',
                placeholder: this.options.bank_collection.at(this.options.bank_collection.length - 1).get('name'),
                name: 'bank'
            });

            // Show the contact typeahead
            var contactTypeahead = new Backbone.Typeahead({ collection: this.options.contact_collection });
            this.contactTypeaheadRegion.show( contactTypeahead );
            // Fix the input
            $(this.contactTypeaheadRegion.el).find('input').attr({
                required: 'required',
                id: 'contact',
                placeholder: this.options.contact_collection.at(this.options.contact_collection.length - 1).get('name'),
                name: 'contact'
            });

            // Initialize pickadate
            // NOTE: I CHANGED THE PICKADATE CODE - line picker.js:94 to force "button" type
            this.ui.dateBtn.pickadate({
                container: 'body',
                selectMonths: true,
                selectYears: true,
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
        }

    });
});