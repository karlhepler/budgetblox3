define( function(require) { 'use strict';
  return {
    Timeline_Layout: require('tpl!../templates/Timeline_Layout.tpl'),

    BudgetListItem_ItemView: require('tpl!../templates/BudgetListItem_ItemView.tpl'),
    BankListItem_ItemView: require('tpl!../templates/BankListItem_ItemView.tpl'),    
    TransactionListItem_ItemView: require('tpl!../templates/TransactionListItem_ItemView.tpl'),
    
    EditExpense_Layout: require('tpl!../templates/EditExpense_Layout.tpl'),
    EditIncome_Layout: require('tpl!../templates/EditIncome_Layout.tpl'),
    EditBudget_Layout: require('tpl!../templates/EditBudget_Layout.tpl'),
    EditBank_ItemView: require('tpl!../templates/EditBank_ItemView.tpl'),

    PreferredBankListItem_ItemView: require('tpl!../templates/PreferredBankListItem_ItemView.tpl')
  };
});