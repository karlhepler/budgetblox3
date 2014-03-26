// DEFINE ALL SHORT-NAMES FOR REQUIRE JS ----------------------------------------------
require.config({
	paths: {
		'jquery': 							'vendor/jquery/jquery',
		
		'backbone': 						'vendor/backbone-amd/backbone',
		'backbone.babysitter': 	'vendor/backbone.babysitter/lib/amd/backbone.babysitter',
		'backbone.wreqr': 			'vendor/backbone.wreqr/lib/amd/backbone.wreqr',
		'marionette': 					'vendor/backbone.marionette/lib/core/amd/backbone.marionette',
		'backbone.filteredCollection': 'vendor/backbone-filtered-collection/backbone-filtered-collection',

		'underscore': 					'vendor/underscore-amd/underscore',
		'tpl': 									'vendor/requirejs-tpl/tpl',
		'bootstrap': 						'vendor/bootstrap/dist/js/bootstrap',
		'jqueryui': 						'vendor/jquery-ui-amd/jquery-ui-1.10.0/jqueryui',

		'alertify': 						'vendor/alertify/alertify',

		'accounting': 					'vendor/accounting/accounting',
		'maskmoney': 						'vendor/jquery-maskmoney/dist/jquery.maskMoney',
		'bootstrap-select': 		'vendor/bootstrap-select/bootstrap-select',
		'chosen': 							'vendor/chosen-build/chosen.jquery',
		'typeahead': 						'vendor/typeahead.js/dist/typeahead.bundle',
		'backbone.typeahead': 	'vendor/Backbone.Typeahead-master/backbone.typeahead',

		'daysInMonth': 					'custom_helpers/daysInMonth',
		'monthName': 						'custom_helpers/monthName',
		'parseFloatRound': 			'custom_helpers/parseFloatRound',
		'formatMoney': 					'custom_helpers/formatMoney',
		'serializeObject': 			'custom_helpers/serializeObject',

		'picker': 							'vendor/pickadate/lib/picker',
		'pickadate': 						'vendor/pickadate/lib/picker.date',

		'fittext': 							'vendor/FitText.js/jquery.fittext',
		'smartresize': 					'vendor/jquery-smartresize/jquery.debouncedresize',

		'fastclick': 						'vendor/fastclick/lib/fastclick',
		'jqueryui-touchpunch': 	'vendor/jqueryui-touch-punch/jquery.ui.touch-punch'
	},
	shim: {
		'bootstrap': {
			deps: ['jquery']
		},
		'maskmoney': {
			deps: ['jquery']
		},
		'bootstrap-select': {
			deps: ['bootstrap']
		},
		'fittext': {
			deps: ['jquery']
		},
		'smartresize': {
			deps: ['jquery']
		},
		'serializeObject': {
			deps: ['jquery']
		},
		'chosen': {
			deps: ['jquery']
		},
		'typeahead': {
			deps: ['jquery']
		},
		'backbone.typeahead': {
			deps: ['backbone']
		},
		'jqueryui-touchpunch': {
			deps: [
				'jquery',
				'jqueryui/sortable',
				'jqueryui/draggable',
				'jqueryui/droppable'
			]
		}
	}
});
//-------------------------------------------------------------------------------------


// Require what it needs, then start the app!
require(['app', 'backbone', 'routers/index', 'controllers/index', 'vent'], function(app, Backbone, Router, Controller, vent) {
	'use strict';

	// Start the app
	app.start();

	// Instantiate the router
	var router = new Router({
		controller: Controller
	});

	// Start recording history
	Backbone.history.start({
		// pushState: true
	});


	// UPDATE THE URL WHEN A NAVIGATION EVENT IS TRIGGERED
	vent.on('nav:timeline', function(year, month, day) {
		// Set defaults
		console.log('main:',year, month, day);

		router.navigate(year + '/' + month + '/' + day);
	});
});