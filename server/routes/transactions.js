var mongoose = require('mongoose');
var defaults = require('./defaults');
var models = require('../models/index');

require('datejs');
var today = Date.today();
var accounting = require('accounting');

var validator = require('validator');
validator.extend('isMoney', function(str) {
    return validator.matches(str,/^\$?\d{1,3}(,?\d{3})*(\.\d{1,2})?$/);
});
validator.extend('isValidExpenseDate', function(str) {
	return Date.parse(str) !== null && !Date.parse(str).isAfter(today) ? true : false;
});
validator.extend('isValidIncomeDate', function(str) {
	return Date.parse(str) !== null ? true : false;
});

/**
 * DEFINE ROUTES
 */

exports.list = function(req, res) {
	var today = Date.today();
	var endOfMonth = today.moveToLastDayOfMonth();
	var startOfMonth = today.moveToFirstDayOfMonth();

	// Instantiate population schemas
	models.contacts(req);
	models.budgets(req);

	return models.transactions(req)
	.find()//{ 'date.obj':{$gte:startOfMonth,$lte:endOfMonth} })
	.sort('-date')
	.select('-meta')
	.lean(true)
	.exec(function(err, transactions) {
		if (err) return res.send(404,err); else {
			
			return res.send(transactions);
		}
	});
};

exports.get = function(req, res) {
	return defaults.get( models.transactions(req), req, res );
};

exports.create = function(req, res) {
	models.banks(req);
	models.budgets(req);
	models.contacts(req);

	// VALIDATE FIRST ----------------------------------------
	var invalids = [];
	if ( !validator.isMoney(req.body.amount) ) invalids.push('amount');
	if ( validator.trim(req.body.contact) === '' ) invalids.push('contact');
	if ( typeof req.body.bank !== 'undefined' && validator.trim(req.body.bank) === '' ) invalids.push('bank');
	if ( typeof req.body.budget === 'undefined' && !validator.isValidIncomeDate(req.body.date) ) invalids.push('date');
	if ( typeof req.body.budget !== 'undefined' && !validator.isValidExpenseDate(req.body.date) ) invalids.push('date');

	// Validation done - what are the results?
	if ( invalids.length > 0 ) return res.send(400,invalids); else {
		// VALIDATION PASSED - PROCEED ---------------------------------
		
		// Create the values
		var amount = {
			num: parseFloat(accounting.unformat(req.body.amount).toFixed(2)),
			str: accounting.formatNumber(req.body.amount,2)
		};
		var desc = req.body.desc;
		var date = {
			obj: Date.parse(req.body.date),
			str: Date.parse(req.body.date).toString('MMMM d, yyyy')			
		};

		// Set up the initial transaction
		var transaction = new models.transactions(req)({
			amount: amount.str,
			desc: desc,
			date: date.str,
			meta: {
				date: date.obj,
				amount: amount.num
			}
		});

		// Set the rest of the stuff, starting with budget...
		setBudget();

		function setBudget() {
			if ( typeof req.body.budget === 'undefined' ) return setBank(); else {

				// Find the budget in question
				models.budgets(req).findOne({ name: req.body.budget })
							.populate('banks')
							.exec(function(err, budget) {
								if (err){console.log('ERR: Find Budget');return res.send(500,err);} else {

									// If the budget wasn't found, then return validation error
									if ( budget === null ) {
										invalids.push('budget');
										return setBank();
									}
									else {
										// A budget was found, so set the transaction values
										transaction.budgetName = budget.name;
										transaction.meta.budget = budget._id;
										return setBank(budget);
									}
								}
							});
			}
		}

		function setBank(budget) {
			transaction.meta.bankAmounts = [];

			// Figure out those crazy banks...
			if ( typeof budget !== 'undefined' ) {
				// Calculate / input bank expenses
				
				// Remember - this is a NEGATIVE NUMBER
				var amountLeft = amount.num;				

				// First make sure the amount left is not a larger number than the budget amount
				if ( amountLeft > budget.meta.balance ) {
					invalids.push('amount');
					checkValidationAgain(budget);
				}
				else {

					// Update budget balance
					budget.meta.balance -= amount.num;
					budget.balance = accounting.formatNumber(budget.meta.balance, 2);
					budget.meta.last_modified = today;
					budget.save(function(err) {
						if (err){console.log('ERR: Save Budget',err);return res.send(500,err);}
					});

					// We need to make sure that there are banks here...
					if ( budget.banks.length === 0 ) {
						// If there are no banks, then we need to use all of them - in the default order
						models.banks(req).find().sort('priority').exec(function(err,banks) {
							if (err) return res.send(500,err); else {
								// Set the banks...
								budget.banks = banks;
								// Continue...
								continueSetBank(budget);
							}
						});
					}
					else {
						// Just continue...
						continueSetBank(budget);
					}

					// It continues here one way or another...
					function continueSetBank(budget) {
						var currentBank = 0;
						while ( amountLeft > 0 ) {
							// If amountLeft is a bigger or equal number than this bank...
							if ( amountLeft >= budget.banks[currentBank].meta.balance ) {
								// Get amountLeft closer to 0 by the bank balance amount
								amountLeft -= budget.banks[currentBank].meta.balance;
								// Set that bank amount to 0 and save
								budget.banks[currentBank].meta.balance = 0;
								budget.banks[currentBank].balance = '0.00';
								budget.banks[currentBank].last_modified = today;
								budget.banks[currentBank].save(function(err) {
									if (err){console.log('ERR: Save Bank 1');return res.send(500,err);}
								});
								// Store the info
								transaction.meta.bankAmounts.push({
									amount: budget.banks[currentBank].meta.balance,
									bank: budget.banks[currentBank]._id
								});
								// Next bank...
								currentBank++;
							}
							// amountLeft is a smaller number than the current bank balance
							else {
								// Set the values
								transaction.meta.bankAmounts.push({
									amount: amountLeft,
									bank: budget.banks[currentBank]._id
								});
								// Set the bank
								budget.banks[currentBank].meta.balance -= amountLeft;
								budget.banks[currentBank].balance = accounting.formatNumber(budget.banks[currentBank].meta.balance,2);
								budget.banks[currentBank].last_modified = today;
								budget.banks[currentBank].save(function(err) {
									if (err){console.log('ERR: Save Bank 2');return res.send(500,err);}
								});
								// Zero out the amountLeft
								amountLeft = 0;
							}
						}

						checkValidationAgain(budget);
					}
				}
			}
			else {
				// It's income! Easy - just grab the bank and set the values
				models.banks(req).findOne({ name: req.body.bank })
							.exec(function(err, bank) {
								if (err){console.log('ERR: Find Bank');return res.send(500,err);} else {
									// If no bank was found....
									if ( bank === null ) {
										// Return a 400 validation error
										invalids.push('bank');
										return checkValidationAgain();
									}
									else {
										// It found the bank!
										transaction.meta.bankAmounts = [{
											amount: transaction.meta.amount,
											bank: bank._id
										}];
										// Now update the bank balance
										if ( date.obj.isAfter(today) ) {
											// Expected Income
											bank.meta.expectedIncome = bank.meta.expectedIncome + transaction.meta.amount;
											bank.expectedIncome = accounting.formatNumber(bank.meta.expectedIncome, 2);
										}
										else {
											// Balance
											bank.meta.balance = bank.meta.balance + transaction.meta.amount;
											bank.balance = accounting.formatNumber(bank.meta.balance, 2);
										}										
										bank.meta.last_modified = today;
										bank.save(function(err) {
											if (err) {console.log('ERR: Save Bank 3');return res.send(500,err)}
										});

										// Now check the validation one more time...
										return checkValidationAgain();
									}
								}
							});
			}
		}

		function checkValidationAgain(budget) {
			if ( invalids.length > 0 ) {
				return res.send(400,invalids);
			}
			else {
				return setContact(budget);
			}
		}

		function setContact(budget) {
			models.contacts(req).findOne({ name: req.body.contact })
						.select('_id name')
						.lean(true)
						.exec(function(err,contact) {
							if (err){console.log('ERR: Find Contact');return res.send(500,err);} else {
								// If no contact was found...
								if ( contact === null ) {
									// Create a new contact
									var contact = models.contacts(req)({
										name: req.body.contact
									});
									contact.save(function(err) {
										if (err){console.log('ERR: Save Contact');return res.send(500,err);} else {
											// Set values
											transaction.contactName = contact.name;
											transaction.meta.contact = contact._id;

											// Save and return!
											return saveAndReturn(budget);
										}
									});									
								}
								// Found the contact!
								else
									// Set values
									transaction.contactName = contact.name;
									transaction.meta.contact = contact._id;
									
									// Save and return!
									return saveAndReturn(budget);
							}
						});
		}

		function saveAndReturn(budget) {
			// Save the transaction
			transaction.save(function(err) {
				if (err){console.log('ERR: Save Transaction');return res.send(500,err);} else {

					if ( typeof budget !== 'undefined' ) {
						// Return the transaction!
						return res.send(201, {
							_id: transaction._id,
							contactName: transaction.contactName,
							budgetName: transaction.budgetName,
							amount: transaction.amount,
							desc: transaction.desc,
							date: transaction.date,
							budgetBalance: budget.balance,
							budgetId: budget._id
						});
					}
					else {
						// Return the transaction!
						return res.send(201, {
							_id: transaction._id,
							contactName: transaction.contactName,
							budgetName: transaction.budgetName,
							amount: transaction.amount,
							desc: transaction.desc,
							date: transaction.date
						});
					}					
				}
			});
		}
	}
};

exports.update = function(req, res) {
	return defaults.update( models.transactions(req), req, res );
};

exports.delete = function(req, res) {
	return defaults.delete( models.transactions(req), req, res );
};

exports.deleteAll = function(req, res) {
	return defaults.deleteAll( models.transactions(req), req, res );
};