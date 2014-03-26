var mongoose = require('mongoose');
var defaults = require('./defaults');
var models = require('../models/index');

require('datejs');
var today = Date.today();
var startOfMonth = Date.today().moveToFirstDayOfMonth();
var endOfMonth = Date.today().moveToLastDayOfMonth();

var accounting = require('accounting');

var validator = require('validator');
validator.extend('isMoney', function(str) {
    return validator.matches(str,/^\$?\d{1,3}(,?\d{3})*(\.\d{1,2})?$/);
});
validator.extend('isValidBudgetDate', function(str) {
	return Date.parse(str) !== null && !Date.parse(str).isBefore(today) ? true : false;
});


/**
 * DEFINE ROUTES
 */


exports.list = function(req, res) {
	// Check the last modified date and compare to today
	// If last update is before today, then do full thing - otherwise, just do quick thing
	
	// If there is a budget in there that was updated today, then just get basic stuff
	return models.budgets(req).findOne({ 'meta.last_modified': today }).exec(function(err, budget) {
		if (err) return res.send(500,err); else {
			
			if ( typeof req.query.refresh !== 'undefined' || budget === null ) {
				
				// Need to add last_modified when updated during calcBalance
				return calcBalance(req, res, function(budgets) {
					
				  // Return the budgets
					return res.send(budgets);
				});
			}
			else {
				return models.budgets(req).find().sort('priority')
							.select('-meta')
							.lean(true)
							.exec(function(err,budgets) {
					if (err) return res.send(500,err); else {
						// Return the budgets
						return res.send(budgets);
					}
				});
			}

		}
	});
};

exports.get = function(req, res) {
	// If there is a budget in there that was updated today, then just get basic stuff
	return models.budgets(req).findOne({ 'meta.last_modified': today }).exec(function(err, budget) {
		if (err) return res.send(500,err); else {
			
			if ( budget === null ) {
				// Need to add last_modified when updated during calcBalance
				return calcBalance(req, res, function(budgets) {
					// loop until we find our budget... then break
				  for (var i = budgets.length - 1; i >= 0; i--) {
				  	// Check to see if it's the model we need
				  	if ( budgets[i]._id.equals(req.params.id) ) {
			  		  // Return the budget detected
			  			return res.send(budgets[i]);
				  		break;
				  	}				  	
				  };
				});
			}
			else {
				return models.budgets(req).findById(req.params.id)
							.select('-meta')
							.lean(true)
							.exec(function(err,budget) {
					if (err) return res.send(500,err); else {

						// Return the budget
						return res.send(budget);
					}
				});
			}

		}
	});
};

exports.create = function(req, res) {
	// Instantiate banks
	models.banks(req);

	// VALIDATE FIRST ----------------------------------------
	var invalids = [];
	if ( validator.trim(req.body.name) === '' ) invalids.push('name');
	if ( !validator.isMoney(req.body.limit) ) invalids.push('limit');
	if ( req.body.dueDate !== '' && !validator.isValidBudgetDate(req.body.dueDate) ) invalids.push('dueDate');
	if ( req.body.showBanks == 'true' && typeof req.body._banks === 'undefined' ) invalids.push('_banks');
	// Validation done - what are the results?
	if ( invalids.length > 0 ) return res.send(400,invalids); else {
		// VALIDATION PASSED - PROCEED ---------------------------------
		
		// Create the values
		var name = validator.trim(req.body.name);
		var limit = {
			num: parseFloat(accounting.unformat(req.body.limit).toFixed(2)),
			str: accounting.formatNumber(req.body.limit,2)
		};

		// Create the budget and set values
		var budget = models.budgets(req)({
			name: name,
			limit: limit.str,
			meta: {
				limit: limit.num
			},
			priority: req.body.priority
		});

		// Fill due date if it's there
		if ( req.body.dueDate !== '' ) {
			budget.dueDate = Date.parse(req.body.dueDate).toString('M/d/yy');
			budget.meta.dueDate = {
				origStr: Date.parse(req.body.dueDate).toString('MMMM d, yyyy'),
				obj: Date.parse(req.body.dueDate)
			};
		}

		// Fill banks if they're there
		budget.banks = [];		
		if ( typeof req.body._banks !== 'undefined' ) {
			// If it's a string, first make sure there are no commas
			// if there are, then automatically turn it into an array
			// separated by those commas
			if ( typeof req.body._banks === 'string' ) {
				req.body._banks = req.body._banks.split(',');
			}

			// If it's an array, then just put it in
			if ( req.body._banks instanceof Array ) {
				budget.banks = req.body._banks;
			}
			// Otherwise, push it in
			else {
				budget.banks.push(req.body._banks);
			}
		}

		// Save the budget
		budget.save(function(err) {			
			if (err) {console.log('create',err);return res.send(500,err);} else {

				return res.send(201,budget);

				// Now calculate the balance
				// return calcBalance(req, res, function(budgets) {
				// 	// Get the budget that matches this budget
				// 	for (var i = budgets.length - 1; i >= 0; i--) {
				// 		if ( budgets[i]._id.equals(budget._id) ) {							
				// 			// Found it - return it with 201 created status
				// 			// It HAS to be there, so I don't need to error check
				// 			return res.send(201, budgets[i]);
				// 			// Kill the loop
				// 			break;
				// 		}
				// 	};
				// });

			}
		});
	}
};

exports.update = function(req, res) {
	// Instantiate banks
	models.banks(req);

	models.budgets(req).findById(req.params.id).populate('banks').exec(function(err,budget) {

		if (err) return res.send(500,err); else {
			if (budget === null) return res.send(404,err); else {
				// VALIDATE FIRST ----------------------------------------
				var invalids = [];
				if ( validator.trim(req.body.name) === '' ) invalids.push('name');
				if ( !validator.isMoney(req.body.limit) ) invalids.push('limit');
				if ( req.body.dueDate !== null && req.body.dueDate !== '' && !validator.isValidBudgetDate(req.body.dueDate) ) invalids.push('dueDate');
				if ( req.body.showBanks == 'true' && typeof req.body._banks === 'undefined' ) invalids.push('_banks');
				// Validation done - what are the results?
				if ( invalids.length > 0 ){console.log(invalids);return res.send(400,invalids);} else {
					// VALIDATION PASSED - PROCEED ---------------------------------
					
					// Create the values
					var name = validator.trim(req.body.name);
					var limit = {
						num: parseFloat(accounting.unformat(req.body.limit).toFixed(2)),
						str: accounting.formatNumber(req.body.limit,2)
					};

					var goal = {
						num: parseFloat(accounting.unformat(req.body.goal).toFixed(2)),
						str: accounting.formatNumber(req.body.goal,2)
					};

					// Update some basic values
					var oldName = budget.name;
					budget.name = name;
					budget.limit = limit.str;
					budget.meta.limit = limit.num;
					budget.priority = req.body.priority;

					// Fill due date if it's there
					if ( req.body.dueDate !== null && req.body.dueDate !== '' ) {
						budget.dueDate = Date.parse(req.body.dueDate).toString('M/d/yy');
						budget.meta.dueDate = {
							origStr: Date.parse(req.body.dueDate).toString('MMMM d, yyyy'),
							obj: Date.parse(req.body.dueDate)
						};
					}
					
					// Clear the array first
					budget.banks = [];					
					// Fill banks if they're there
					if ( typeof req.body._banks !== 'undefined' ) {
						// If it's a string, first make sure there are no commas
						// if there are, then automatically turn it into an array
						// separated by those commas
						if ( typeof req.body._banks === 'string' ) {
							req.body._banks = req.body._banks.split(',');
						}
						
						// If it's an array, then just put it in
						if ( req.body._banks instanceof Array ) {
							budget.banks = req.body._banks;
						}
						// Otherwise, push it in
						else {
							budget.banks.push(req.body._banks);
						}
					}

					// Update the budget last_modified
					budget.meta.last_modified = today;

					// Now update the budgetName in the transaction
					models.transactions(req).find({ budgetName: oldName }).exec(function(err, transactions) {
						if (err) return res.send(500,err); else {

							for (var i = transactions.length - 1; i >= 0; i--) {
								transactions[i].budgetName = budget.name;
								transactions[i].meta.last_modified = today;
								transactions[i].save(function(err) {
									if (err) return res.send(500,err);
								});
							};
						}
					});

					// Save the budget
					budget.save(function(err) {
						if (err) {console.log('update',err);return res.send(500,err);} else {

							return res.send(budget);
						}
					});

				}

			}
		}
	});
};

exports.delete = function(req, res) {
	return defaults.delete( models.budgets(req), req, res );
};

exports.deleteAll = function(req, res) {
	return defaults.deleteAll( models.budgets(req), req, res );
};


//----------------------------------------------------------------------------------------------------
// THE GREAT AND AMAZING CALC BALANCE FUNCTION!!!
//----------------------------------------------------------------------------------------------------	 
function calcBalance(req, res, callback) {
	// Register the banks schema
	models.banks(req);

	// Get the budgets...
	return models.budgets(req).find().sort('priority').populate('banks').exec(function(err, budgets) {
		if (err) {console.log('calcBalance',err);return res.send(500,err);} else {
			// Call the first function
			return classifyBudgets(budgets);
		}
	});

	/*
	
	* Classify budgets into two categories: budgets without filled banks and budgets with due dates
	* Find all budgets that have empty banks and fill them up with banks
	* Recalcuate due dates - if a due date is before today, make it after today
	* Calculate goal amount and limit amount if there is a due date that is beyond the scope of this month
	* Sum all income transactions per bank for all dates <= today
	* Fill the budget balances with money (ie. the starting balance) until out of money
		- Add offset to the available funds for the calculation, but don't actually change available funds
		- When done, I think you need to add the offset to the available funds... it might just be one step... hmmm..
	* Once the budget balance is correct, then subtract the expenses related to this budget
	* That's it...

	 */
	
	 //----------------------------------------------------------------------------------------------------
	 // Classify budgets into two categories: budgets without filled banks and budgets with due dates
	 //----------------------------------------------------------------------------------------------------	 
	 function classifyBudgets(budgets) {
	 	var emptyBankBudgets = [];
	  var validDueDateBudgets = [];

	 	// First, go through all budgets and mark the changes to be made	 	
	 	for (var i = budgets.length - 1; i >= 0; i--) {
	 		if ( budgets[i].banks.length === 0 ) {
	 			emptyBankBudgets.push( budgets[i] );
	 		}
	 		if ( budgets[i].dueDate !== null ) {
	 			validDueDateBudgets.push( budgets[i] );
	 		}
	 	};

	 	return fillBanks(budgets, emptyBankBudgets, validDueDateBudgets);
	 }

	 //----------------------------------------------------------------------------------------------------
	 // Find all budgets that have empty banks and fill them up with banks
	 //----------------------------------------------------------------------------------------------------
	 function fillBanks(budgets, emptyBankBudgets, validDueDateBudgets) {
	 	// If there are any empty bank budgets...
	 	if ( emptyBankBudgets.length === 0 ) return calcDueDates(budgets, validDueDateBudgets); else {
	 		// Get banks...
	 		models.banks(req).find().sort('priority').exec(function(err, banks) {
	 			if (err) {console.log('fillBanks',err);return res.send(500,err);} else {
	 				// Fill up the bank budgets
	 				for (var i = emptyBankBudgets.length - 1; i >= 0; i--) {
	 					emptyBankBudgets[i].banks = banks;
	 					emptyBankBudgets[i].deleteMyBanks = true;
	 				};
	 				return calcDueDates(budgets, validDueDateBudgets);
	 			}
	 		});
	 	}
	 }

	 //----------------------------------------------------------------------------------------------------
	 // Recalcuate due dates - if a due date is before today, make it after today
	 //----------------------------------------------------------------------------------------------------
	 function calcDueDates(budgets, validDueDateBudgets) {
	 	for (var i = validDueDateBudgets.length - 1; i >= 0; i--) {
	 		var date = Date.parse(validDueDateBudgets[i].meta.dueDate.origStr);
	 		// If the date is earlier than today
	 		if ( date.isBefore(today) ) {
	 			// Alter the date so that it matches this month
	 			date.set({ month: today.getMonth(), year: today.getFullYear() });
	 			// If it's still before today, then add a month
	 			if ( date.isBefore(today) ) {
	 				date.add({ months: 1 });
	 			}
	 		}
	 		// Set the date
	 		validDueDateBudgets[i].dueDate = date.toString('M/d/yy');
	 		validDueDateBudgets[i].meta.dueDate.obj = date;

	 		//----------------------------------------------------------------------------------------------------
	 		// Calculate goal amount and limit amount if there is a due date that is beyond the scope of this month
	 		//----------------------------------------------------------------------------------------------------

	 		// if the due date for this budget is far in the future...
	 		if ( validDueDateBudgets[i].meta.dueDate.obj.isAfter(endOfMonth) ) {
	 			var num = validDueDateBudgets[i].goal !== null ? validDueDateBudgets[i].meta.goal : validDueDateBudgets[i].meta.limit;
	 			// Calculate the limit based on the number of months in between now and then
	 			var numBetween = monthDiff(endOfMonth, validDueDateBudgets[i].meta.dueDate.obj) + 1;
	 			var newLimit = parseFloat(accounting.unformat( num / numBetween ).toFixed(2));

	 			// If there is more than one month in between...
	 			if ( numBetween > 1 ) {
	 				// Update the goal
	 				validDueDateBudgets[i].goal = accounting.formatNumber(num,2);
	 				validDueDateBudgets[i].meta.goal = num;

	 				// Update the limit
	 				validDueDateBudgets[i].limit = accounting.formatNumber(newLimit,2);
	 				validDueDateBudgets[i].meta.limit = newLimit;
	 			}
	 		}
	 	};

	 	// Now to calculate income totals
	 	return getBankIncomeTotals(budgets);

	 	// Helper function used above -----------------------
	 	function monthDiff(d1, d2) {
	 	    var months;
	 	    months = (d2.getFullYear() - d1.getFullYear()) * 12;
	 	    months -= d1.getMonth() + 1;
	 	    months += d2.getMonth();
	 	    return months <= 0 ? 0 : months;
	 	}
	 }

	 //----------------------------------------------------------------------------------------------------
	 // Sum all income transactions per bank for all dates <= today
	 //----------------------------------------------------------------------------------------------------
	 function getBankIncomeTotals(budgets) {
	 	models.transactions(req)
	 				.aggregate()
	 				.match({ 'meta.date':{$lte:today}, 'budgetName':null })
	 				.unwind('meta.bankAmounts')
	 				.group({ _id:'$meta.bankAmounts.bank', amount:{$sum:'$meta.bankAmounts.amount'} })
	 				.exec(function(err,bankIncomeTotals) {
	 					if (err) {console.log('getBankIncomeTotals',err);return res.send(500,err);} else {
	 						return fillBudgetBalances(budgets, bankIncomeTotals);
	 					}
	 				});
	 }

	 //----------------------------------------------------------------------------------------------------
	 // Fill the budget balances with money (ie. the starting balance) until out of money
	 // - Add offset to the available funds for the calculation, but don't actually change available funds
	 // - When done, I think you need to add the offset to the available funds... it might just be one step... hmmm..
	 //----------------------------------------------------------------------------------------------------
	 function fillBudgetBalances(budgets, bankIncomeTotals) {

	 	// First zero out all balances
	 	for (var i = budgets.length - 1; i >= 0; i--) {
	 		budgets[i].balance = '0.00';
	 		budgets[i].meta.balance = 0;
	 	};

	 	// Now get started...
	 	if ( bankIncomeTotals.length === 0 ) return subtractExpenses(budgets); else {

	 		// Go through each budget from start to end (this has already been ordered by priority)
	 		for (var budgetIndex = 0; budgetIndex < budgets.length; budgetIndex++) {
	 			var thisBudget = budgets[budgetIndex];
	 			var offset = thisBudget.meta.offset;
	 			
	 			// Now go through each bank inside the budget (this has already been ordered by priority as well)
	 			// Do this as long as we haven't hit the limit...
	 			if ( thisBudget.meta.balance < thisBudget.meta.limit ) {
	 				for (var budgetBankIndex = 0; budgetBankIndex < thisBudget.banks.length; budgetBankIndex++) {
	 					var thisBudgetBank = thisBudget.banks[budgetBankIndex];
	 					
	 					// Select that bank from the bankIncomeTotals
	 					var thisBankIncomeTotal;
	 					for (var bankIncomeTotalsIndex = bankIncomeTotals.length - 1; bankIncomeTotalsIndex >= 0; bankIncomeTotalsIndex--) {
	 						// Save a reference to it for easy use later
 							thisBankIncomeTotal = bankIncomeTotals[bankIncomeTotalsIndex];

 							// ****** OFFSET TIME!!!!! ********* //
 							
	 						// Test it and break if found
	 						if ( thisBankIncomeTotal._id.equals(thisBudgetBank._id) ) {
	 							// Now add the offset to the bank balance
	 							// If adding the funds and the offset produces a negative number...
	 							if ( 0 > thisBankIncomeTotal.amount + offset ) {
	 								// Since the only way it can produce a negative number is if offset itself is negative,
	 								// that means I know that in order to get offset closer to zero by the funds amount,
	 								// I must add them together
	 								offset += thisBankIncomeTotal.amount;
	 								// Set the funds to zero
	 								thisBankIncomeTotal.amount = 0;
	 							}
	 							// Else, if adding the funds and the offset produces a positive number...
	 							else {
	 								// Offset could be a positive or negative number... we don't know here
	 								
	 								// Set into stone the math from the if statement
	 								thisBankIncomeTotal.amount += offset; 

	 								// Offset can now be emptied
	 								offset = 0;
	 							}	 							
	 							break;
	 						}
	 					};	 					
	 					
	 					// Store bal as the current balance
	 					var bal = thisBudget.meta.balance;
	 					// Store the limit as the current limit minus the current balance
	 					var limit = thisBudget.meta.limit - bal;

	 					if ( limit > thisBankIncomeTotal.amount ) {
	 						var newBal = bal + thisBankIncomeTotal.amount;

	 						thisBudget.balance = accounting.formatNumber(newBal, 2);
	 						thisBudget.meta.balance = newBal;

	 						thisBankIncomeTotal.amount = 0;
	 					}
	 					else {
	 						var newBal = bal + limit;

	 						thisBudget.balance = accounting.formatNumber(newBal, 2);
	 						thisBudget.meta.balance = newBal;

	 						thisBankIncomeTotal.amount -= limit;
	 					}

	 				};
	 			}
	 		};

	 		// All the looping is done, so go to the next thing
	 		return subtractExpenses(budgets);
	 	}
	 }

	 //----------------------------------------------------------------------------------------------------
	 // Once the budget balance is correct, then subtract the expenses related to this budget
	 //----------------------------------------------------------------------------------------------------
	 function subtractExpenses(budgets) {
	 	models.transactions(req)
	 				.aggregate()
	 				.match({ 'meta.date':{$lte:today}, 'budgetName':{$ne:null} })
	 				.group({ _id:'$meta.budget', amount:{$sum:'$meta.amount'} })
	 				.exec(function(err,result) {
	 					if (err) {console.log('subtractExpenses',err);return res.send(500,err);} else {	 						
	 						if ( result.length === 0 ) return save(budgets); else {
	 							
	 							for (var resultIndex = result.length - 1; resultIndex >= 0; resultIndex--) {
	 								var thisAmount = result[resultIndex];

	 								for (var i = budgets.length - 1; i >= 0; i--) {
	 									var thisBudget = budgets[i];

	 									if ( thisBudget._id.equals(thisAmount._id) ) {
	 										var newBal = thisBudget.meta.balance - thisAmount.amount;
	 										thisBudget.balance = accounting.formatNumber(newBal,2);
	 										thisBudget.meta.balance = newBal;
	 										break;
	 									}
	 								};
	 							};

	 							// Save the budgets
	 							return save(budgets);
	 						}
	 					}
	 				});
	 }

	 function save(budgets) {
	 	for (var i = budgets.length - 1; i >= 0; i--) {
	 		// Update last_modified
	 		budgets[i].meta.last_modified = today;

	 		// Delete the banks necessary
	 		if ( typeof budgets[i].deleteMyBanks !== 'undefined' && budgets[i].deleteMyBanks === true ) {
	 			budgets[i].banks = [];
	 			delete budgets[i].deleteMyBanks;
	 		}

	 		// Convert all banks to bank IDs
	 		for (var e = budgets[i].banks.length - 1; e >= 0; e--) {
	 			budgets[i].banks[e] = budgets[i].banks[e]._id;
	 		};

	 		// Save the budget
	 		budgets[i].save(function(err) {
	 			if (err) return res.send(500,err);
	 		});
	 	};

	 	// Now call the callback!
	 	callback(budgets);
	 }
	 
}