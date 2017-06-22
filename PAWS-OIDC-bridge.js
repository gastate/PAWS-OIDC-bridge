
PAWS_OIDC_bridge = {
	main: function() {
		let fn = "PAWS_OIDC_bridge.main";
		this.initial_href = window.location.href;

		let iframe = ( parent !== window );
		if( !iframe ) {
			this.depth = 0;
		} else {
			let depth = 0;
			let next = window
			while( next.parent !== next ) {
				next = next.parent;
				depth += 1;
			}
			this.depth = depth;
		}
		fn = this.depth+">"+fn;

		console.log( fn+" invoked" );
		console.log( fn+": href = ", this.initial_href );

		this.loadscripts( ["oidc-client.js","PAWS-OIDC-bridge-env.js"], () => {
			console.log( fn+": oidc-client loaded, environment loaded" );
			this.mgr = new Oidc.UserManager( this.ENV.loginSettings );
			this.mgr.events.addUserLoaded( (user) => { 
				this.user = user;
				console.log( fn+"/UserLoaded: ", this.user );
				this.update_status( "Loaded User: "+JSON.stringify(this.user.profile) );
			} );
			this.mgr.events.addUserUnloaded( (...args) => { 
				console.log( fn+"/UserUnloaded: ", args );
			} );
			this.mgr.events.addAccessTokenExpiring( (...args) => { 
				console.log( fn+"/AccessTokenExpiring: ", args );
			} );
			this.mgr.events.addAccessTokenExpired( (...args) => { 
				console.log( fn+"/AccessTokenExpired: ", args );
			} );
			this.mgr.events.addSilentRenewError( (...args) => { 
				console.log( fn+"/SilentRenewError: ", args );
			} );
			this.mgr.events.addUserSignedOut( (...args) => { 
				console.log( fn+"/UserSignedOut: ", args );
			} );
			console.log( fn+": UserManager is ready." );
			this.update_status( fn+": UserManager is ready." );
		} );
	},
	login: function() {
		let fn = this.depth+">PAWS_OIDC_bridge.login";
		console.log( fn+" invoked" );
		this.await_mgr( () => {
			this.mgr.signinSilent().then( () => {
				console.log( fn+": Completed" );
				this.update_status( fn+": Completed" );
			} ).catch( (err) => {
				console.log( fn+": Failed! ", err.message );
				this.update_status( fn+": Failed! "+err.message );
			} );
			console.log( fn+": In Progress..." );
		} );
	},
	logout: function( callback ) {
		let fn = this.depth+">PAWS_OIDC_bridge.logout";
		console.log( fn+" invoked" );
		let tag = document.createElement("iframe");
		if( this.iframe_style ) { for( key in this.iframe_style ) { tag.style[key] = this.iframe_style[key]; } }
		tag.setAttribute( "src", this.uri_logout+"?"+(new Date()).toISOString() );
		tag.setAttribute( "sandbox", "allow-scripts allow-same-origin" ); // this should prevent iframe from navigating top window
		let listener = (event) => {
			console.log( fn+"/Event: ", event );
			if( event.source === tag.contentWindow ) {
				console.log( fn+"/Event: Processing Event from iframe" );
				tag.remove();
				window.removeEventListener( "message", listener );
				console.log( fn+"/Event: data = ", event.data );
				let data = JSON.parse( event.data );
				console.log( fn+"/Event: data = ", data );
				if( data.failure ) {
					let message = data; if( data.error ) { message = data.error; if( data.error.message ) { message = data.error.message; } }
					console.error( fn+"/Event: Logout failed -- ", message );
					this.update_status( fn+"/Event: Logout failed -- " + message );
				} else {
					console.log( fn+"/Event: Logout succeded" );
					this.update_status( fn+"/Event: Logout succeded" );
				}
				if( callback ) { callback( data ); }
			} else {
				console.log( fn+"/Event: Ignoring Event NOT from iframe" );
			}
		}
		window.addEventListener( "message", listener );
		this.update_status( fn+": opening iframe" );
		document.body.appendChild(tag);
	},
	popup_login: function() {
		let fn = this.depth+">PAWS_OIDC_bridge.popup_login";
		console.log( fn+" invoked" );
		this.await_mgr( () => {
			this.mgr.signinPopup().then( () => {
				console.log( fn+": Completed" );
				this.update_status( fn+": Completed" );
			} ).catch( (err) => {
				console.log( fn+": Failed! ", err.message );
				this.update_status( fn+": Failed! "+err.message );
			} );
			console.log( fn+": In Progress..." );
		} );
	},
	loadscripts: function(urls,callback) {
		let fn = this.depth+">PAWS_OIDC_bridge.loadscripts";
		console.log( fn+" invoked" );
		let count = urls.length;
		for( url of urls ) {
			this.loadscript( url, () => {
				count -= 1;
				if( 0 == count && callback ) { callback(); }
			} );
		}
	},
	loadscript: function(url,callback) {
		let fn = this.depth+">PAWS_OIDC_bridge.loadscript";
		console.log( fn+" invoked" );
		let tag = document.createElement("script");
		tag.setAttribute("src",url+"?"+(new Date()).toISOString())
		tag.onload = function() {
			console.log( fn+": loaded", url );
			document.head.removeChild(tag);
			if(callback) { callback(); }
		};
		document.head.appendChild(tag);
	},
	update_status: function(message) {
		if( this.status_elm ) {
			let elm = document.getElementById( this.status_elm );
			if( elm ) {
				let tag = document.createElement("p");
				tag.innerText = message;
				elm.appendChild(tag)
			}
		}
	},
	await_mgr: function( callback, delay=0 ) {
		let fn = this.depth+">PAWS_OIDC_bridge.await_mgr";
		console.log( fn+" invoked" );
		let step = PAWS_OIDC_bridge.await_interval || 100;
		if( this.mgr ) { callback(); }
		else {
			console.log( fn+": delay =", delay );
			this.update_status( fn+": delay = "+delay );
			delay += step
			setTimeout( () => this.await_mgr(callback,delay), step );
		}
	},
	helper_logout: function() {
		let fn = this.depth+">PAWS_OIDC_bridge.helper_logout";
		console.log( fn+" invoked" );
		this.await_mgr( () => {
			this.mgr.signoutRedirect().then( () => {
				console.log( fn+": Completed" );
				this.update_status( fn+": Completed" );
			} ).catch( (err) => {
				console.log( fn+": Failed! ", err.message );
				this.update_status( fn+": Failed! "+err.message );
				let message = JSON.stringify( { failure: true, href: this.initial_href, error: err } );
				parent.postMessage( message, "*" );
			} );
			console.log( fn+": In Progress..." );
		} );
	},
	callback_silent: function() {
		let fn = this.depth+">PAWS_OIDC_bridge.callback_silent";
		console.log( fn+" invoked" );
		this.await_mgr( () => {
			this.mgr.signinSilentCallback( this.initial_href ).then( () => {
				console.log( fn+": Completed" );
				this.update_status( fn+": Completed" );
			} ).catch( (err) => {
				console.log( fn+": Failed! ", err.message );
				this.update_status( fn+": Failed! "+err.message );
			} );
			console.log( fn+": In Progress..." );
		} );
	},
	callback_logout: function() {
		let fn = this.depth+">PAWS_OIDC_bridge.callback_logout";
		console.log( fn+" invoked" );
		console.log( fn+": href = ", this.initial_href );
		let message = JSON.stringify( { failure: false, href: this.initial_href } );
		console.log( fn+": message =", message );
		parent.postMessage( message, "*" );
	},
	callback_popup: function() {
		let fn = this.depth+">PAWS_OIDC_bridge.callback_popup";
		console.log( fn+" invoked" );
		this.await_mgr( () => {
			this.mgr.signinPopupCallback( this.initial_href ).then( () => {
				console.log( fn+": Completed" );
				this.update_status( fn+": Completed" );
			} ).catch( (err) => {
				console.log( fn+": Failed! ", err.message );
				this.update_status( fn+": Failed! "+err.message );
			} );
			console.log( fn+": In Progress..." );
		} );
	},
	logout_handler: function() {
		let fn = this.depth+">PAWS_OIDC_bridge.logout_handler";
		console.log( fn+" invoked" );
		console.log( fn+": No cleanup needed" );
	}
}

PAWS_OIDC_bridge.main();
