"use strict";

gs.changeComposition = function( obj ) {
	var keysId,
		patId,
		cmp = gs.currCmp,
		bPM = obj.beatsPerMeasure,
		sPB = obj.stepsPerBeat;

	if ( obj.tracks ) {
		ui.mainGridSamples.change( obj );
	}
	for ( patId in obj.patterns ) {
		obj.patterns[ patId ]
			? cmp.patterns[ patId ]
				? gs.updatePattern( patId, obj.patterns[ patId ] )
				: gs.addPattern( patId, obj.patterns[ patId ] )
			: gs.removePattern( patId );
	}
	common.assignDeep( cmp, obj );
	for ( keysId in obj.keys ) {
		for ( patId in cmp.patterns ) {
			if ( cmp.patterns[ patId ].keys === keysId ) {
				gs.updatePatternContent( patId );
				if ( patId === cmp.patternOpened ) {
					ui.keysGridSamples.change( obj.keys[ keysId ] );
				}
				break;
			}
		}
	}
	if ( obj.bpm ) {
		// gswa...()
		ui.controls.bpm( obj.bpm );
	}
	if ( bPM || sPB ) {
		ui.mainGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
		ui.keysGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
		for ( patId in cmp.patterns ) {
			gs.updatePatternContent( patId );
		}
	}
	if ( obj.name != null || obj.bpm ) {
		ui.cmps.update( cmp.id, cmp );
	}
};
