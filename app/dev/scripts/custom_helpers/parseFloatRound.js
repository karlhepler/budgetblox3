// This is just a universal function that takes the place of parseFloat in the code
// so that it can be rounded to two decimal places
function parseFloatRound(num) {
	return (Math.round(parseFloat(num*100))/100);
}