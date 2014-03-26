define([], function() {
	return function(date) {
		if ( typeof date === 'object' )
			return (new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'))[date.getMonth()];
		else
			return (new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'))[date];
	}
});