define(['marionette'], function(Marionette) { 'use strict';
  return Marionette.AppRouter.extend({
    appRoutes: {
    	'': 'navTimeline',
    	
    	':year': 'navTimeline',
    	':year/': 'navTimeline',

    	':year/:month': 'navTimeline',
    	':year/:month/': 'navTimeline',

      ':year/:month/:day': 'navTimeline',
      ':year/:month/:day/': 'navTimeline'
    }
  });
});