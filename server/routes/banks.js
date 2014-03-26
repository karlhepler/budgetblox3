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
validator.extend('isValidBankDate', function(str) {
	return Date.parse(str) !== null && !Date.parse(str).isAfter(today) ? true : false;
});

/**
 * DEFINE ROUTES
 */


exports.list = function(req, res) {
	// Check the last modified date and compare to today
	// If last update is before today, then do full thing - otherwise, just do quick thing
	
	// If there is a bank in there that was updated today, then just get basic stuff
	return models.banks(req).findOne({ 'meta.last_modified': today }).exec(function(err, bank) {
		if (err) return res.send(500,err); else {
			
			if ( typeof req.query.refresh !== 'undefined' || bank === null ) {
				
				// Need to add last_modified when updated during updateBalExp
				return updateBalExp(req, res, function(banks) {
					
				  // Return the banks
					return res.send(banks);
				});
			}
			else {
				return models.banks(req).find().sort('priority')
							.select('-meta')
							.lean(true)
							.exec(function(err,banks) {
					if (err) return res.send(500,err); else {
						
						// Return the banks
						return res.send(banks);
					}
				});
			}

		}
	});
};

exports.get = function(req, res) {
	// If there is a bank in there that was updated today, then just get basic stuff
	return models.banks(req).findOne({ 'meta.last_modified': today }).exec(function(err, bank) {
		if (err) return res.send(500,err); else {
			
			if ( bank === null ) {
				// Need to add last_modified when updated during updateBalExp
				return updateBalExp(req, res, function(banks) {
					// loop until we find our bank... then break
				  for (var i = banks.length - 1; i >= 0; i--) {
				  	// Check to see if it's the model we need
				  	if ( banks[i]._id.equals(req.params.id) ) {
			  		  // Return the bank detected
			  			return res.send(banks[i]);
				  		break;
				  	}				  	
				  };
				});
			}
			else {
				return models.banks(req).findById(req.params.id)
							.select('-meta')
							.lean(true)
							.exec(function(err,bank) {
					if (err) return res.send(500,err); else {

						// Return the bank
						return res.send(bank);
					}
				});
			}

		}
	});
};

exports.create = function(req, res) {	
	// VALIDATE FIRST
	var invalids = [];
	if ( typeof req.body.name === 'undefined' || validator.trim(req.body.name) === '' ) invalids.push('name');
	if ( typeof req.body.dateOpened === 'undefined' || !validator.isValidBankDate(req.body.dateOpened) ) invalids.push('dateOpened');
	if ( typeof req.body.openingBalance === 'undefined' || !validator.isMoney(req.body.openingBalance) ) invalids.push('openingBalance');
	if ( typeof req.body.priority === 'undefined' || !validator.isNumeric(req.body.priority) ) invalids.push('priority');
	// Validation is done... what are the results?
	if ( invalids.length > 0 ) return res.send(400,invalids); else {
		// Validation checks out! Now continue!
		
		// Create the values
		var name = validator.trim(req.body.name);
		var openingBalance = {
			num: parseFloat(accounting.unformat(req.body.openingBalance).toFixed(2)),
			str: accounting.formatNumber(req.body.openingBalance,2)
		};
		var dateOpened = {
			obj: Date.parse(req.body.dateOpened),
			str: Date.parse(req.body.dateOpened).toString('MMMM d, yyyy')
		};

		// Create the bank and set values
		var bank = new models.banks(req)({
			name: name,
			priority: req.body.priority,
			openingBalance: openingBalance.str,
			dateOpened: dateOpened.str,
			balance: openingBalance.str,
			meta: {
				balance: openingBalance.num
			}
		});

		// Save the bank
		bank.save(function(err) {
			if (err) return req.send(500,err); else {

				// Now create a contact that will go into the transaction
				var contact = new models.contacts(req)({ name: name });
				// Save the contact
				contact.save(function(err) {
					if (err) return req.send(500,err); else {

						// Now create the transaction
						var transaction = new models.transactions(req)({
							contactName: name,
							amount: openingBalance.str,
							desc: 'Opening Balance',
							date: dateOpened.str,

							meta: {
								date: dateOpened.obj,
								amount: openingBalance.num,
								contact: contact._id,
								bankAmounts: [{
									amount: openingBalance.num,
									bank: bank._id
								}]
							}
						});
						// Save the transaction
						transaction.save(function(err) {
							if (err) return res.send(500,err); else {

								// Now add the transaction id to the bank
								bank.meta.openingTransaction = transaction._id;
								// Now save the bank again
								bank.save(function(err) {
									if (err) return res.send(500,err);
								});

								// Now return what needs to be returned
								// No need to wait for the save to complete
								return res.send(201, bank);

							}
						});

					}
				});

			}
		});
	}
};

exports.update = function(req, res) {
	// Instantiate the other schema's we're going to use
	models.transactions(req);
	models.contacts(req);

	// VALIDATE FIRST ------------------------------------------------------------
	var invalids = [];
	if ( validator.trim(req.body.name) === '' ) invalids.push('name');
	if ( !validator.isValidBankDate(req.body.dateOpened) ) invalids.push('dateOpened');
	if ( !validator.isMoney(req.body.openingBalance) ) invalids.push('openingBalance');
	if ( !validator.isNumeric(req.body.priority) ) invalids.push('priority');
	// Validation is done... what are the results?
	if ( invalids.length > 0 ) return res.send(400,invalids); else {
		// Validation checks out! Now continue! ------------------------------------

		// Get the bank model to update - populating the openingTransaction
		return models.banks(req).findById(req.params.id)
					.populate('meta.openingTransaction')
					.exec(function(err, bank) {
			if (err) return res.send(404,err); else {
				// Populate the contact inside the opening transaction
				bank.meta.openingTransaction.populate('meta.contact', function(err, transaction) {
					if (err) return res.send(404,err); else {
						// Save the returned and populated transaction in the bank meta
						bank.meta.openingTransaction = transaction;

						// ------- NOW PROCEED WITH THE UPDATES ---------- //

						// Setup some basic values ------------------------
						var name = validator.trim(req.body.name);
						var openingBalance = {
							num: parseFloat(accounting.unformat(req.body.openingBalance).toFixed(2)),
							str: accounting.formatNumber(req.body.openingBalance,2)
						};
						var dateOpened = {
							obj: Date.parse(req.body.dateOpened),
							str: Date.parse(req.body.dateOpened).toString('MMMM d, yyyy')
						};

						var newBal = bank.meta.balance - bank.meta.openingTransaction.meta.amount + openingBalance.num;
						var balance = {
							num: newBal,
							str: accounting.formatNumber(newBal, 2)
						};

						// UPDATES -----------------------------------------
						
						// Update name
						bank.name = name;
						bank.meta.openingTransaction.contactName = name;
						bank.meta.openingTransaction.meta.contact.name = name;
						// Update priority
						bank.priority = req.body.priority;
						// Update dateOpened
						bank.dateOpened = dateOpened.str;
						bank.meta.openingTransaction.date = dateOpened.str;
						bank.meta.openingTransaction.meta.date = dateOpened.obj;
						// Update openingBalance
						bank.openingBalance = openingBalance.str;
						bank.meta.openingTransaction.amount = openingBalance.str;
						bank.meta.openingTransaction.meta.amount = openingBalance.num;
						bank.meta.openingTransaction.meta.bankAmounts[0].amount = openingBalance.num;
						// Update the bank balance
						bank.balance = balance.str;
						bank.meta.balance = balance.num;
						// Update last_modified
						bank.meta.last_modified = Date.now();
						bank.meta.openingTransaction.meta.last_modified = Date.now();
						bank.meta.openingTransaction.meta.contact.last_modified = Date.now();

						// SAVE!!! ------------------------------
						
						// Save the contact
						bank.meta.openingTransaction.meta.contact.save(function(err) { if (err) return res.send(500,err); });
						// Save the transaction
						bank.meta.openingTransaction.save(function(err) { if (err) return res.send(500,err); });

						// Save the bank
						bank.save(function(err) {
							if (err) return res.send(500,err); else {

								// Return only what we need to return...
								return res.send({
									_id: bank._id,
									name: bank.name,
									priority: bank.priority,
									dateOpened: bank.dateOpened,
									openingBalance: bank.openingBalance,
									balance: bank.balance,
									meta: {
										openingTransaction: bank.meta.openingTransaction._id
									}
								});

							}
						});

					}
				});

			}
		});

	}
};

exports.delete = function(req, res) {
	return defaults.delete( models.banks(req), req, res );
};

exports.deleteAll = function(req, res) {
	return defaults.deleteAll( models.banks(req), req, res );
};

function updateBalExp(req, res, callback) {
	// Get all banks
	models.banks(req).find().sort('priority').exec(function(err,banks) {
		if (err) return res.send(500); else {

			getFutureBalances();

			function getFutureBalances() {
				models.transactions(req).aggregate()
							.match({ 'meta.date': {$gt:today} })
							.unwind('meta.bankAmounts')
							.group({
								_id: '$meta.bankAmounts.bank',
								amount: {
									$sum: {
										$cond: [
											'$meta.budget',
												{$subtract:[0,'$meta.bankAmounts.amount']},
												'$meta.bankAmounts.amount'												
										]
									}
								}
							})
							.exec(function(err, futureBalances) {
								if (err) return res.send(500,err); else {
									getPastBalances(futureBalances);
								}								
							});
			}

			function getPastBalances(futureBalances) {
				models.transactions(req).aggregate()
							.match({ 'meta.date': {$lte:today} })
							.unwind('meta.bankAmounts')
							.group({
								_id: '$meta.bankAmounts.bank',
								amount: {
									$sum: {
										$cond: [
											'$meta.budget',
												{$subtract:[0,'$meta.bankAmounts.amount']},
												'$meta.bankAmounts.amount'												
										]
									}
								}
							})
							.exec(function(err, pastBalances) {
								if (err) return res.send(500,err); else {									
									setBalExp(futureBalances, pastBalances);
								}								
							});
			}

			function setBalExp(futureBalances, pastBalances) {
				for (var i = banks.length - 1; i >= 0; i--) {
					var thisBank = banks[i];

					// Reset all values
					thisBank.balance = '0.00';
					thisBank.meta.balance = 0;
					thisBank.expectedIncome = '0.00';
					thisBank.meta.expectedIncome = 0;

					// Set the expectedIncome
					for (var e = futureBalances.length - 1; e >= 0; e--) {
						if ( thisBank._id.equals(futureBalances[e]._id) ) {
							thisBank.expectedIncome = accounting.formatNumber(futureBalances[e].amount, 2);
							thisBank.meta.expectedIncome = futureBalances[e].amount;
							break;
						}
					};
					
					// Set the balance
					for (var e = pastBalances.length - 1; e >= 0; e--) {
						if ( thisBank._id.equals(pastBalances[e]._id) ) {
							thisBank.balance = accounting.formatNumber(pastBalances[e].amount, 2);
							thisBank.meta.balance = pastBalances[e].amount;
							break;
						}
					};
					
					// Update the last_modified date
					thisBank.meta.last_modified = today;

					// Save the bank
					thisBank.save(function(err) {
						if (err) return res.send(500,err);
					});
				};

				// Finally, return the banks to the callback
				callback(banks);
			}
		}
	});
}