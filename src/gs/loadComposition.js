"use strict";

gs.loadComposition = function( cmp ) {
	return gs.unloadComposition().then( function() {
		var id, cmpOrig = gs.localStorage.get( cmp.id );

		gs.currCmp = cmp;
		gs.currCmpSaved = !!( cmp.savedAt && cmpOrig && cmpOrig.savedAt === cmp.savedAt );
		if ( cmp.savedAt == null || !cmpOrig ) {
			ui.cmps.push( cmp.id );
			ui.cmps.update( cmp.id, cmp );
		}
		for ( id in cmp.patterns ) {
			ui.patterns.change( id, cmp.patterns[ id ] );
			gs.updatePatternContent( id );
		}
		ui.controls.currentTime( 0 );
		ui.controls.bpm( cmp.bpm );
		ui.mainGrid.empty();
		ui.mainGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
		ui.keysGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
		ui.mainGrid.change( cmp );
		ui.cmps.load( cmp.id );
		ui.cmps.saved( !gs.isCompositionNeedSave() );
		if ( cmp.patternOpened ) {
			ui.patterns.open( cmp.patternOpened );
		}
	} );
};
