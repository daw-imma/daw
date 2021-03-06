"use strict";

ui.pattern = {
	init() {
		var grid = new gsuiGridSamples();

		grid.loadKeys( 3, 5 );
		grid.offset( 0, 120 );
		grid.setFontSize( 20 );
		ui.keysGridSamples = grid;
		ui.idElements.keysGridWrap.append( grid.rootElement );
		ui.idElements.patternName.onclick = ui.pattern._onclickPatternName;
		grid.onchange = ui.pattern._onchangeGrid;
		grid.uiKeys.onkeydown = ui.pattern._onkeydown;
		grid.uiKeys.onkeyup = ui.pattern._onkeyup;
		grid.resized();
	},
	empty() {
		ui.pattern.name( "" );
		ui.keysGridSamples.empty();
	},
	name( name ) {
		ui.idElements.patternName.textContent = name;
	},
	load( keys ) {
		ui.keysGridSamples.empty();
		ui.keysGridSamples.change( keys );
	},

	// private:
	_onkeydown( key, oct ) {
		wa.synth.simpleStart( ( key + oct ).toUpperCase() );
	},
	_onkeyup() {
		wa.synth.stop();
	},
	_onchangeGrid( obj ) {
		gs.pushCompositionChange( { keys: {
			[ gs.currCmp.patterns[ gs.currCmp.patternOpened ].keys ]: obj
		} } );
	},
	_onclickPatternName() {
		var patId = gs.currCmp.patternOpened,
			pat = gs.currCmp.patterns[ patId ],
			n = prompt( "Name pattern :", pat.name );

		if ( n != null && ( n = n.trim() ) !== pat.name ) {
			gs.pushCompositionChange( { patterns: {
				[ patId ]: { name: n }
			} } );
		}
	}
};
