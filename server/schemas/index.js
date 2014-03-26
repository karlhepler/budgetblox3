// IMPORTANT: http://mongoosejs.com/docs/populate.html
// IMPORTANT NOTE ABOUT DATES: Bottom of page http://mongoosejs.com/docs/schematypes.html

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('datejs');

exports.banks = Schema({

	name: { type: String, unique: true },
	balance: { type: String, default: '0.00' },
	expectedIncome: { type: String, default: '0.00' },	
	dateOpened: String,
	openingBalance: { type: String, default: '0.00' },
	priority: Number,

	meta: {
		balance: { type: Number, default: 0 },
		expectedIncome: { type: Number, default: 0 },
		openingTransaction: { type: Schema.Types.ObjectId, ref: 'transactions' },
		last_modified: { type: Date, default: Date.today() }
	}
});

exports.contacts = Schema({
	name: { type: String, unique: true },
	last_modified: { type: Date, default: Date.today() }
});

exports.budgets = Schema({

	name: { type: String, unique: true },
	limit: String,
	goal: { type: String, default: null },
	balance: { type: String, default: '0.00' },
	dueDate: { type: String, default: null },
	priority: Number,
	banks: [{ type: Schema.Types.ObjectId, ref: 'banks' }],

	meta: {
		offset: {type: Number, default: 0 },
		limit: Number,
		goal: { type: Number, default: null },
		balance: { type: Number, default: 0 },		
		dueDate: { type: {
			origStr: String,
			obj: Date
		}, default: null },
		last_modified: { type: Date, default: Date.today() }
	}
});

exports.transactions = Schema({

	contactName: String,
	budgetName: { type: String, default: null },
	amount: String,
	desc: String,
	date: String,

	meta: {
		date: Date,
		amount: Number,
		contact: { type: Schema.Types.ObjectId, ref: 'contacts' },
		budget: { type: Schema.Types.ObjectId, ref: 'budgets', default: null },		
		bankAmounts: [{
			amount: Number,
			bank: { type: Schema.Types.ObjectId, ref: 'banks' }
		}],
		last_modified: { type: Date, default: Date.today() }
	}
});