"use strict";

gs.Sample.prototype.inTrack = function( trackId ) {
	var track = ui.tracks[ trackId ];
	if ( track !== this.track ) {
		this.wsample.disconnect();
		this.wsample.connect( track.wfilters );
		if ( this.track )
			this.track.removeSample( this );
		this.track = track;
		this.track.samples.push( this );
		ui.CSS_sampleTrack( this );
	}
};