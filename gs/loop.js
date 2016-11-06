"use strict";

( function() {

var that, tA, tB,
	whenSave,
	durationSave;

gs.loop = that = {
	reorderTimeAB: function() {
		if ( tA > tB ) {
			var tmp = tA;

			tA = tB;
			tB = tmp;
		}
	},
	timeA: function( sec ) {
		lg("timea")
		tA = sec;
		that.update();
	},
	timeB: function( sec ) {
		lg("timeb")
		tB = sec;
		that.update();
	},
	stop: function() {
		tA = tB = undefined;
		wa.composition.loop( false );
		ui.timelineLoop.toggle( false );
	},
	update: function() {
		var isLooping, when, duration = Math.abs( tB - tA );

		if ( !isNaN( duration ) ) {
			when = Math.min( tA, tB );
			if ( when !== whenSave || duration !== durationSave ) {
				whenSave = when;
				durationSave = duration;
				// isLooping = wa.composition.isLooping;
				isLooping = duration > 0.01;
				if ( isLooping ) {
					wa.composition.loop( when, duration );
					ui.timelineLoop.when( when );
					ui.timelineLoop.duration( duration );
				}
				ui.timelineLoop.toggle( isLooping );
			}
		}
	}
};

} )();
