define(['vent'], function (vent) { 'use strict';
  return {
    navTimeline: function(year, month, day) {
      // Make sure there are values here. If not, put them there.
      if ( typeof year === 'undefined' && typeof month === 'undefined' && typeof day === 'undefined' ) {
        var d = new Date();
        year = d.getFullYear();
        month = d.getMonth()+1;
        day = d.getDate();
      }
      else if ( typeof month === 'undefined' && typeof day === 'undefined' ) {
        month = 1;
        day = 1;        
      }
      else if ( typeof day === 'undefined' ) {
        day = 1;
      }

      console.log( 'controller:', year, month, day );

      vent.trigger('nav:timeline', year, month, day);
    }
  };
});