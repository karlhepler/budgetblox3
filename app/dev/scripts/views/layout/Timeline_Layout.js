define([
    // Initializers
    'marionette',
    'templates',

    // Views -----------
    'views/collection/BudgetList_CollectionView',
    'views/collection/BankList_CollectionView',
    'views/collection/TransactionList_CollectionView',

    'views/layout/EditExpense_Layout',
    'views/layout/EditIncome_Layout',
    'views/layout/EditBudget_Layout',
    'views/item/EditBank_ItemView',

    // Collections -----------
    'collections/Budget_Collection',
    'collections/Bank_Collection',
    'collections/Transaction_Collection',
    'collections/Contact_Collection',

    // Regions ------------------
    'regions/Modal_Region',

    // Utilities -----------------
    'backbone.filteredCollection',
    'accounting',

    // Misc -------------------
    
    'jqueryui-touchpunch',
    'pickadate',
    'fittext',
    'serializeObject'
],
function(
    // Initializers
    Marionette,
    templates,

    // Views ------------
    BudgetList_CollectionView,
    BankList_CollectionView,
    TransactionList_CollectionView,

    EditExpense_Layout,
    EditIncome_Layout,
    EditBudget_Layout,
    EditBank_ItemView,

    // Collections ------------
    Budget_Collection,
    Bank_Collection,
    Transaction_Collection,
    Contact_Collection,

    // Regions ----------------
    Modal_Region,

    // Utilities --------------
    FilteredCollection,
    accounting

) {
    return Marionette.Layout.extend({

        template: templates.Timeline_Layout,

        id: 'timeline-container',

        regions: {             
            budgetList: '#budget-list',
            bankList: '#bank-list',
            transactionList: '#new-transactionlist-container'
        },

        ui: {
            btnAddExpense: '#btn-addexpense',
            btnAddIncome: '#btn-addincome',
            btnAddBudget: '#btn-addbudget',
            btnAddBank: '#btn-addbank',
            btnDate: '#date',

            budgetBankContainer: '#budget-bank-container',
            budgetBankContainerH3: '#budget-bank-container h3',
            dateContainer: '#date-container',
            balanceContainer: '#balance-container',
            
            bankList: '#bank-list',
            bankPanelTitle: '.bank-panel > .panel-title',

            budgetList: '#budget-list',
            budgetPanelTitle: '.budget-panel > .panel-title',

            bankPanelTitleBtns: '.bank-panel .panel-title-buttons',
            budgetPanelTitleBtns: '.budget-panel .panel-title-buttons',

            incomeTotal: '.incomeTotal',
            budgetTotal: '.budgetTotal',
            balanceTotal: '.fund-icon.balance',

            sidebarContainer: '#sidebar-container'
        },

        events: {
            'click #btn-addexpense': 'showAddExpenseModal',
            'click #btn-addincome': 'showAddIncomeModal',
            'click #btn-addbudget': 'showAddBudgetModal',
            'click #btn-addbank': 'showAddBankModal',
            'click .bank-panel .btn-edit': 'showEditBankModal',
            'click .bank-panel .btn-delete': 'showDeleteBankModal',
            'click .budget-panel .btn-edit': 'showEditBudgetModal',
            'click .budget-panel .btn-delete': 'showDeleteBudgetModal'
        },

        onShow: function() {
            console.log('[Layout] Timeline');            

            // Define the views
            var budgetListCollectionView = new BudgetList_CollectionView({ collection: this.budget_collection });
            var bankListCollectionView = new BankList_CollectionView({ collection: this.bank_collection });
            var transactionListCollectionView = new TransactionList_CollectionView({ collection: this.transaction_collection });

            // Show the views in the regions
            this.budgetList.show( budgetListCollectionView );
            this.bankList.show( bankListCollectionView );
            this.transactionList.show( transactionListCollectionView );

            // Fetch the collection data
            this.budget_collection.fetch();
            this.bank_collection.fetch();
            this.transaction_collection.fetch();
            this.contact_collection.fetch();

            // Run the DOM Initialization
            this.initDOM();

            // Show edit panel title buttons based on triggers from collection
            bankListCollectionView
                .on('showPanelTitleButtons', function(view) {
                    this.ui.bankPanelTitleBtns.show();
                }, this)
                .on('hidePanelTitleButtons', function(view) {
                    this.ui.bankPanelTitleBtns.hide();
                }, this);
            budgetListCollectionView
                .on('showPanelTitleButtons', function(view) {
                    this.ui.budgetPanelTitleBtns.show();
                }, this)
                .on('hidePanelTitleButtons', function(view) {
                    this.ui.budgetPanelTitleBtns.hide();
                }, this);
        },

        initialize: function() {
            // Define the collections
            this.budget_collection = new Budget_Collection();
            this.bank_collection = new Bank_Collection();
            this.transaction_collection = new Transaction_Collection();
            this.contact_collection = new Contact_Collection();

            // Zero out income and budget totals
            var incomeTotal = 0;
            var budgetTotal = 0;
            var balanceTotal = 0;

            // Add up incomes on load
            this.listenTo(this.bank_collection, 'add', function(model) {
                incomeTotal += (parseFloat(model.get('balance').replace(/\,/g,'')) + parseFloat(model.get('expectedIncome').replace(/\,/g,'')));
                this.ui.incomeTotal.text('$'+accounting.formatNumber(incomeTotal, 2));

                balanceTotal = incomeTotal - budgetTotal;
                this.ui.balanceTotal.text(accounting.formatNumber(balanceTotal, 2));

            });
            // Add up budgets on load
            this.listenTo(this.budget_collection, 'add', function(model) {
                budgetTotal += parseFloat(model.get('limit').replace(/\,/g,''));
                this.ui.budgetTotal.text('$'+accounting.formatNumber(budgetTotal, 2));

                balanceTotal = incomeTotal - budgetTotal;
                this.ui.balanceTotal.text(accounting.formatNumber(balanceTotal, 2));
            });

            // Detect change in bank balance / expected Income and update the income totals
            this.listenTo(this.bank_collection, 'change:balance change:expectedIncome', function() {
                incomeTotal = 0;
                for (var i = this.bank_collection.length - 1; i >= 0; i--) {
                    var model = this.bank_collection.at(i);
                    incomeTotal += (parseFloat(model.get('balance').replace(/\,/g,'')) + parseFloat(model.get('expectedIncome').replace(/\,/g,'')));
                };
                this.ui.incomeTotal.text('$'+accounting.formatNumber(incomeTotal,2));

                balanceTotal = incomeTotal - budgetTotal;
                this.ui.balanceTotal.text(accounting.formatNumber(balanceTotal, 2));
            });

            // Detect change in budget limit and update budget totals
            this.listenTo(this.budget_collection, 'change:limit', function() {
                budgetTotal = 0;
                for (var i = this.budget_collection.length - 1; i >= 0; i--) {
                    var model = this.budget_collection.at(i);
                    budgetTotal += (parseFloat(model.get('limit').replace(/\,/g,'')));                
                };                
                this.ui.budgetTotal.text('$'+accounting.formatNumber(budgetTotal,2));

                balanceTotal = incomeTotal - budgetTotal;
                this.ui.balanceTotal.text(accounting.formatNumber(balanceTotal, 2));
            });

            // BANK SYNC HANDLER ----------------------------------------------------
            this.listenTo(this.bank_collection, 'sync', function(model, response, options) {
                // If the model was just created...
                if ( options.xhr.status === 201 ) {
                    // Add the opening transaction to the collection
                    this.transaction_collection.add({
                        _id: model.get('meta').openingTransaction,
                        contactName: model.get('name'),
                        desc: 'Opening Balance',
                        date: model.get('dateOpened'),
                        amount: model.get('openingBalance'),
                        budgetName: null
                    });

                    // Fetch the contacts collection
                    this.contact_collection.fetch();

                    // Fetch the budgets again
                    this.budget_collection.fetch({ data: {refresh:true}, processData: true });

                    console.log('** CREATE HAPPENED [bank_collection] **');
                }
                // Just a standard get list
                else if ( options.xhr.status === 200 && response instanceof Array ) {
                    console.log('** GET LIST HAPPENED [bank_collection] **');
                }
                // Else if the model was just updated
                else if ( options.xhr.status === 200 && !(response instanceof Array) ) {
                    // Find the opening transaction and update it with the new info
                    var t = this.transaction_collection.get( model.get('meta').openingTransaction );
                    t.set({
                        contactName: model.get('name'),
                        date: model.get('dateOpened'),
                        amount: model.get('openingBalance')
                    });

                    // Fetch the contacts collection
                    this.contact_collection.fetch();

                    // Fetch the budgets again
                    this.budget_collection.fetch({ data: {refresh:true}, processData: true });
                    
                    console.log('** UPDATE HAPPENED [bank_collection] **');
                }
                // Else if the model was just deleted
                else if ( options.xhr.status === 204 ) {
                    console.log('** DELETE HAPPENED [bank_collection] **');
                }
            }, this);


            // BUDGET SYNC HANDLER ----------------------------------------------------
            this.listenTo(this.budget_collection, 'sync', function(model, response, options) {
                // A budget was created
                if ( options.xhr.status === 201 ) {
                    // Fetch the collection again, resetting the view
                    this.budget_collection.fetch({ data: {refresh:true}, processData: true });

                    console.log('** CREATE HAPPENED [budget_collection] **');
                }
                // The budget is being listed
                else if ( options.xhr.status === 200 && response instanceof Array ) {
                    console.log('** GET LIST HAPPENED [budget_collection] **');
                }
                // Budget was just updated
                else if ( options.xhr.status === 200 && !(response instanceof Array) ) {
                    // Fetch if limit changed...
                    if ( typeof model.changed.limit !== 'undefined' ) {
                        // Fetch the collection again, resetting the view
                        this.budget_collection.fetch({ data: {refresh:true}, processData: true });
                    }

                    // Change the budgetName in the transactions
                    if ( typeof model.changed.name !== 'undefined' ) {
                        // Fetch the transactions again
                        this.transaction_collection.fetch();
                    }

                    console.log('** UPDATE HAPPENED [budget_collection] **');
                }
                // The budget was just deleted
                else if ( options.xhr.status === 204 ) {
                    console.log('** DELETE HAPPENED [budget_collection] **');
                }
            }, this);

            // TRANSACTION SYNC HANDLER ----------------------------------------------------
            this.listenTo(this.transaction_collection, 'sync', function(model, response, options) {
                // A transaction was created
                if ( options.xhr.status === 201 ) {
                    // Update the budget balance
                    if ( typeof model.get('budgetId') !== 'undefined' ) {
                        var b = this.budget_collection.get( model.get('budgetId') );
                        b.set({ balance: model.get('budgetBalance') });
                    }                    

                    // Fetch the banks
                    this.bank_collection.fetch();

                    // Fetch the contacts collection
                    this.contact_collection.fetch();

                    console.log('** CREATE HAPPENED [transaction_collection] **');
                }
                // The transaction is being listed
                else if ( options.xhr.status === 200 && response instanceof Array ) {
                    console.log('** GET LIST HAPPENED [transaction_collection] **');
                }
                // transaction was just updated
                else if ( options.xhr.status === 200 && !(response instanceof Array) ) {
                    // Fetch if limit changed...
                    console.log('** UPDATE HAPPENED [transaction_collection] **');
                }
                // The transaction was just deleted
                else if ( options.xhr.status === 204 ) {
                    console.log('** DELETE HAPPENED [transaction_collection] **');
                }
            }, this);
        },

        initDOM: function() {
            var that = this;

            var newHeight = this.ui.sidebarContainer.height()
                            - this.ui.dateContainer.outerHeight(true)
                            - this.ui.balanceContainer.outerHeight(true)
                            - this.ui.budgetPanelTitle.outerHeight(true)
                            - this.ui.bankPanelTitle.outerHeight(true);

            this.ui.budgetList.height( newHeight );
            this.ui.bankList.height( newHeight );

            $(window).on('debouncedresize', function(e) {
                var newHeight = that.ui.sidebarContainer.height()
                                - that.ui.dateContainer.outerHeight(true)
                                - that.ui.balanceContainer.outerHeight(true)
                                - that.ui.budgetPanelTitle.outerHeight(true)
                                - that.ui.bankPanelTitle.outerHeight(true);

                that.ui.budgetList.height( newHeight );
                that.ui.bankList.height( newHeight );
            });

            this.ui.budgetList.on('shown.bs.collapse', function() {
                that.ui.budgetList.height( that.ui.sidebarContainer.height()
                                            - that.ui.dateContainer.outerHeight(true)
                                            - that.ui.balanceContainer.outerHeight(true)
                                            - that.ui.budgetPanelTitle.outerHeight(true)
                                            - that.ui.bankPanelTitle.outerHeight(true)
                                        );
            });
            this.ui.bankList.on('shown.bs.collapse', function() {
                that.ui.bankList.height( that.ui.sidebarContainer.height()
                                            - that.ui.dateContainer.outerHeight(true)
                                            - that.ui.balanceContainer.outerHeight(true)
                                            - that.ui.budgetPanelTitle.outerHeight(true)
                                            - that.ui.bankPanelTitle.outerHeight(true)
                                        );
            });

            // Pickadate when clicking calendar icon
            this.ui.btnDate.pickadate({
                container: 'body',
              selectYears: true,
              selectMonths: true
            });

            // Make the date text as big as possible
            this.ui.dateContainer.fitText(1.65);

            // This shows the sidebars when the screen is small
            $('#show-left').click(function(e) {
                e.preventDefault();

                $('#sidebar-container').toggleClass('show-left');

                // Make the date text as big as possible
                window.setTimeout(function() {
                    that.ui.dateContainer.fitText(2);
                }, 70);                
            });

            $('#show-right').click(function(e) {
                e.preventDefault();

                $('#info-container').toggleClass('show-right');
            });
        },

        showAddExpenseModal: function(e) {
            // Show the modal
            var modal = this.showModal(e, new EditExpense_Layout({ bank_collection: this.bank_collection, contact_collection: this.contact_collection, budget_collection: this.budget_collection }), this.transaction_collection, 'Add New');
        },

        showAddIncomeModal: function(e) {
            // Show the modal
            var modal = this.showModal(e, new EditIncome_Layout({ bank_collection: this.bank_collection, contact_collection: this.contact_collection }), this.transaction_collection, 'Add New');
        },

        showAddBudgetModal: function(e) {
            // Show the modal
            var modal = this.showModal(e, new EditBudget_Layout({ bank_collection: this.bank_collection }), this.budget_collection, 'Add New');
        },

        showEditBudgetModal: function(e) {
            // Show the modal, implanting the selected budgets into the view
            var modal = this.showModal(e, new EditBudget_Layout({ bank_collection: this.bank_collection, model: new FilteredCollection(this.budget_collection).filterBy({ selected: true }) }), this.budget_collection, 'Edit');
        },

        showAddBankModal: function(e) {
            // Show the modal
            var modal = this.showModal(e, new EditBank_ItemView(), this.bank_collection, 'Add New');
        },

        showEditBankModal: function(e) {
            // Show the modal, implanting the selected banks into the view
            var modal = this.showModal(e, new EditBank_ItemView({ model: new FilteredCollection(this.bank_collection).filterBy({ selected: true }) }), this.bank_collection, 'Edit');
        },

        showDeleteBankModal: function(e) {

        },

        showModal: function(e, view, collection, fn) {
            // Prevent default action
            e.preventDefault();

            // Create the modal region
            var modal = new Modal_Region({el:'#modal'});

            // Universal view changes
            view.options.fn = fn;

            // Show the modal
            modal.show(view);

            // Validate, then save the params to the collection
            // this = this layout
            // view = the modal view
            view.on('save', function(view) {
                // If the view has a model, then it's an edit... not a create
                if ( typeof view.model != 'undefined' ) {                    
                    // Serialize the form
                    var obj = view.view.$el.find('form').serializeObject();
                    // Remove priority AND anything blank
                    obj = _.omit(obj, 'priority');
                    obj = _.invert(obj);                    
                    obj = _.omit(obj, '');
                    obj = _.invert(obj);

                    // If the object is NOT empty, then proceed
                    if ( !_.isEmpty(obj) ) {
                        // Save the first model in the collection to check for errors
                        view.model.at(0).save(obj, {
                            wait: true,
                            success: function(model, response, options) {
                                // Now cycle through the rest, omitting the first one
                                // (no need for error checking this time)
                                for (var i = view.model.length - 1; i >= 1; i--) {
                                    view.model.at(i).save(obj);
                                };
                                // Close the modal
                                modal.close();
                            },
                            error: function(model, response, options) {
                                if ( options.xhr.status !== 205 ) {
                                    // Underline all incorrect responses
                                    for (var i = $.parseJSON(response.responseText).length - 1; i >= 0; i--) {
                                        view.view.$el.find('input[name="'+$.parseJSON(response.responseText)[i]+'"]').css({ 'border-bottom': 'solid red', 'padding-bottom': '4px' });
                                    };
                                }
                                else {
                                    // Now cycle through the rest, omitting the first one
                                    // (no need for error checking this time)
                                    if ( view.model.length > 1 ) {
                                        for (var i = view.model.length - 1; i >= 1; i--) {
                                            view.model.at(i).save(obj, {
                                                // wait: true,
                                                error: function(model, response, options) {
                                                    if ( options.xhr.status !== 205 ) console.log(response); else {
                                                        fetchCollection(i);
                                                    }
                                                }
                                            });
                                        };    
                                    }
                                    else {
                                        fetchCollection(0);
                                    }
                                    
                                    function fetchCollection(i) {
                                        if ( i === 0 ) {
                                            // Status code is 205 - fetch the collections
                                            collection.fetch();
                                            // Close the modal
                                            modal.close();
                                        }
                                    }                                    
                                }
                            }
                        });
                    }
                    else {
                        // Close the modal without doing anything
                        modal.close();
                    }
                }
                else {                    
                    // This view didn't return a model, we know we need to create one!
                    var obj = view.view.$el.find('form').serializeObject();

                    // If it's there, make priority equal the length of the collection
                    if ( typeof obj.priority != 'undefined' ) {
                        obj.priority = collection.length;
                    }

                    collection.create(obj, {
                        wait: true,
                        success: function(model, response, options) {
                            // Close the modal
                            modal.close();
                        },
                        error: function(model, response, options) {
                            if ( options.xhr.status !== 205 ) {
                                console.log(response.responseText);
                                // Underline all incorrect responses
                                for (var i = $.parseJSON(response.responseText).length - 1; i >= 0; i--) {
                                    view.view.$el.find('input[name="'+$.parseJSON(response.responseText)[i]+'"]').css({ 'border-bottom': 'solid red', 'padding-bottom': '4px' });
                                };
                            }
                            else {
                                // Status code is 205 - fetch the collections
                                collection.fetch();
                                // Close the modal
                                modal.close();
                            }
                        }
                    });
                }                
            }, this);
        }
    });
});