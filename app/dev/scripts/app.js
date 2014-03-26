define([
	'marionette',
	'vent',
	'views/layout/Timeline_Layout',
	'fastclick',

	'bootstrap',
	'smartresize',	
	// 'pickadate',
	// 'fittext'
],
function(
	Marionette,
	vent,
	Timeline_Layout,
	fastclick
) { 'use strict';

	// Declare the new Marionette application
	var app = new Marionette.Application();

	// Set up regions
	app.addRegions({
		main: '#main'
	});

	app.addInitializer(function() {
		// Initiate fastclick
		fastclick.attach(document.body);

		var that = this;
		// Set the height of main to match the window height
		// $(this.main.el).height( $(window).height() );
		// Set the height of main to match the window height during resize
		$(window).on('debouncedresize', function(e) {
			// $(that.main.el).height( $(this).height() );
		});

		// Search on keyup
		$('#transactions-search > input').on('keyup', function() {
		  // Add showing if there is a value
		  if ( $(this).val().length > 0 )
		      $(this).next('.input-clear').css('opacity',1);
		  else
		      $(this).next('.input-clear').css('opacity',0);

		  // Perform a search here....
		});

		// Clear the form if input-clear is clicked
		$('#transactions-search > .input-clear').click(function() {
		  $('#transactions-search')[0].reset();
		  $(this).css('opacity',0);
		});
	});

	// The timeline view will show the selected year/month/day
	vent.on('nav:timeline', function(year, month, day) {
		console.log( 'app:', year, month, day );

		var timeline = new Timeline_Layout();

		app.main.show( timeline );
	});

	// FINALLY... RETURN THE APP!!!!
	return app;
});