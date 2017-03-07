"use strict";

( function() {

var srcobjDragging,
	srchtmlCloned;

ui.itemBuffer = function( srcobj ) {
	var tpl = document.querySelector( "#itemBuffer" ).content,
		elRoot = document.importNode( tpl, true );

	ui.dom.templateCloned.appendChild( elRoot );
	elRoot = ui.dom.templateCloned.querySelector( ".item.buffer" );
	elRoot.remove();
	this.elRoot = elRoot;
	this.elName = elRoot.querySelector( ".name" );
	this.elIcon = elRoot.querySelector( ".icon" );
	this.elWave = elRoot.querySelector( ".gsuiWaveform" );

	this.isLoading =
	this.isLoaded = false;
	this.srcobj = srcobj;
	elRoot.onmousedown = this.mousedown.bind( this );
	elRoot.onclick = this.click.bind( this );
	elRoot.ondragstart = this.dragstart.bind( this );
	elRoot.oncontextmenu = function() { return false; };

	this.elName.textContent = srcobj.metadata.name;
	ui.dom.filesList.appendChild( elRoot );
};

ui.itemBuffer.prototype = {
	filled: function() {
		this.elName.textContent = this.srcobj.metadata.name;
		this.elIcon.classList.remove( "question" );
		this.elIcon.classList.add( "ramload" );
		this.elRoot.classList.add( "unloaded" );
	},
	loading: function() {
		this.isLoading = true;
		this.elIcon.classList.add( "loading" );
		this.elIcon.classList.remove( "ramload" );
	},
	loaded: function() {
		var buf = this.srcobj.bufferSample.buffer,
			bufDur = buf.duration,
			bufData0 = buf.getChannelData( 0 ),
			bufData1 = buf.numberOfChannels < 2 ? bufData0 : buf.getChannelData( 1 );

		this.isLoaded = true;
		this.isLoading = false;
		this.uiWaveform = new gsuiWaveform( this.elWave );
		this.uiWaveform.setResolution( 250, 40 );
		this.uiWaveform.draw( bufData0, bufData1, bufDur, 0, bufDur );
		this.elRoot.classList.add( "loaded" );
		this.elRoot.classList.remove( "unloaded" );
		this.elIcon.remove();
	},
	unloaded: function() {

	},
	remove: function() {
		this.elRoot.remove();
	},
	error: function() {
		this.elIcon.classList.add( "cross" );
		this.elIcon.classList.remove( "loading" );
	},
	used: function() {
		this.elRoot.classList.add( "used" );
	},
	unused: function() {
		this.elRoot.classList.remove( "used" );
	},
	mousedown: function( e ) {
		if ( e.button !== 0 ) {
			waFwk.do.stopAllSources();
		}
		if ( e.ctrlKey ) {
			gs.file.delete( this );
		}
	},
	click: function( e ) {
		gswaFramework.actions.stopAllSources.call( waFwk );
		if ( this.isLoaded ) {
			gswaFramework.actions.playSource.call( waFwk, this.srcobj );
		} else if ( !this.srcobj.data ) {
			ui.gsuiPopup.open( "confirm", "Sample's data missing",
				"<code>" + this.srcobj.metadata.name + "</code> is missing...<br/>" +
				"Do you want to browse your files to find it ?" )
			.then( function( b ) {
				if ( b ) {
					ui.filesInput.getFile(
						waFwk.do.bind( waFwk, "fillSource", this.srcobj ) );
				}
			} );
		} else if ( !this.isLoading ) {
			waFwk.do( "loadSources", [ this.srcobj ] )
				.then( gswaFramework.actions.playSource.bind( waFwk, this.srcobj ) );
		}
	},
	dragstart: function( e ) {
		if ( this.isLoaded && !srcobjDragging ) {
			var elCursor;

			srcobjDragging = this.srcobj;
			srchtmlCloned = this.elRoot.cloneNode( true );
			srchtmlCloned.style.left = e.pageX + "px";
			srchtmlCloned.style.top = e.pageY + "px";
			srchtmlCloned.classList.add( "dragging" );
			elCursor = srchtmlCloned.querySelector( "#filesCursor" );
			elCursor && elCursor.remove();
			ui.dom.app.appendChild( srchtmlCloned );
			common.cursor( "app", "grabbing" );
		}
		return false;
	}
};

document.body.addEventListener( "mousemove", function( e ) {
	if ( srcobjDragging ) {
		srchtmlCloned.style.left = e.pageX + "px";
		srchtmlCloned.style.top = e.pageY + "px";
	}
} );

document.body.addEventListener( "mouseup", function( e ) {
	if ( srcobjDragging ) {
		srchtmlCloned.remove();
		srchtmlCloned =
		srcobjDragging = null;
		common.cursor( "app", null );
	}
} );

ui.dom.gridColB.addEventListener( "mouseup", function( e ) {
	if ( srcobjDragging ) {
		waFwk.do.addSample( {
			srcobj: srcobjDragging,
			trkobj: ui.grid.getTrackByPageY( e.pageY ),
			when: ui.grid.getWhen( e.pageX )
		} );
	}
} );

} )();
