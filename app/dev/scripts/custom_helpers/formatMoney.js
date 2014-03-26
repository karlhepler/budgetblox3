define(['accounting'], function(accounting) {
	return function(num) {
		// If it's negative, then make the class
		var amount;
		var sign = 'is-positive';
		if ( (amount = Math.abs(num)) !== num ) {			
			sign = 'is-negative';
		}

		return '<span class="money '+sign+'">' + accounting.formatMoney( amount.toFixed(2), '<span class="dollar-sign">$</span>', 2, ',', '<span class="cents">', '%s%v</span></span>' );
	};
});