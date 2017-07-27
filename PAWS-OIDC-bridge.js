
if( typeof PAWS_OIDC_bridge === "undefined" ) { PAWS_OIDC_bridge = {}; }
PAWS_OIDC_bridge.main = function() {
		let fn = "PAWS_OIDC_bridge.main";
		this.initial_href = window.location.href;
		this.source = document.currentScript.src;
		this.baseURL = this.source.substring(0,this.source.lastIndexOf("/")+1);

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

		// console.log( fn+" invoked" );
		console.log( fn+": href = ", this.initial_href );

		let scripts = [];
		if( typeof Oidc === "undefined" ) { scripts.push( this.baseURL+"oidc-client.js" ); }
		if( typeof this.ENV === "undefined" ) { scripts.push( this.baseURL+"PAWS-OIDC-bridge-env.js" ); }

		if( 0 >= scripts.length ) {
			this.initialize();
		} else {
			this.loadscripts( scripts, () => {
				this.initialize();
			} );
		}
	};
PAWS_OIDC_bridge.initialize = function() {
		let fn = this.depth+">PAWS_OIDC_bridge.initialize";
			this.await_prop( "ENV", () => {
				// console.log( fn+": library & environment loaded" );
				if( this.ENV.oidc_logger ) {
					Oidc.Log.logger = this.ENV.oidc_logger;
				}
				if( window.location.href.substr( window.location.href.indexOf("?")+1 ).indexOf( "clearorigins" ) >= 0 ) {
					this.CLEARORIGINS = true;
				}
				if( this.CLEARORIGINS || this.SPLITORIGINS ) {
					this.ENV.loginSettings.pageOrigin = this.ENV.scriptOrigin;
					this.ENV.loginSettings.scriptOrigin = this.ENV.scriptOrigin;
					this.ENV.loginSettings.silent_redirect_uri += "?clearorigins";
					this.ENV.loginSettings.popup_redirect_uri += "?clearorigins";
					this.ENV.uri_logout += "?clearorigins";
					if( this.CLEARORIGINS ) {
						this.ENV.pageOrigin = this.ENV.scriptOrigin;
						this.ENV.loginSettings.redirect_uri += "?clearorigins";
						this.ENV.loginSettings.post_logout_redirect_uri += "?clearorigins";
						console.warn( fn+": origins cleared" );
					} else {
						console.warn( fn+": origins SPLIT" );
					}
				} else {
					this.ENV.loginSettings.pageOrigin = this.ENV.pageOrigin;
					this.ENV.loginSettings.scriptOrigin = this.ENV.scriptOrigin;
					console.warn( fn+": origins applied" );
				}
				let mgr = new Oidc.UserManager( this.ENV.loginSettings );
				mgr.events.addUserLoaded( (user) => { 
					this.user = user;
					// console.log( fn+"/UserLoaded: ", this.user );
					// this.update_status( "Loaded User: "+JSON.stringify(this.user.profile) );
					this.update_status( "Loaded User, ID = "+this.user.profile.gsupersonpantherid );
				} );
				mgr.events.addUserUnloaded( (...args) => { 
					console.log( fn+"/UserUnloaded: ", JSON.stringify(args) );
					console.log( fn+"/UserUnloaded: ", args );
				} );
				mgr.events.addAccessTokenExpiring( (...args) => { 
					console.log( fn+"/AccessTokenExpiring: ", args );
				} );
				mgr.events.addAccessTokenExpired( (...args) => { 
					console.log( fn+"/AccessTokenExpired: ", args );
				} );
				mgr.events.addSilentRenewError( (...args) => { 
					console.log( fn+"/SilentRenewError: ", args );
				} );
				mgr.events.addUserSignedOut( (...args) => { 
					console.log( fn+"/UserSignedOut: ", args );
				} );
				// console.log( fn+": UserManager is ready." );
				// this.update_status( fn+": UserManager is ready." );
				this.mgr = mgr;
				// console.log( fn+": AUTOLOGIN = ", this.AUTOLOGIN );
				if( false !== this.AUTOLOGIN ) {
					// console.log( fn+": Attempting automatic login" );
					this.update_status( fn+": Attempting automatic login" );
					this.login_loop();
				} else {
					// console.log( fn+": Automatic login disabled" );
					this.update_status( fn+": Automatic login disabled" );
				}
			} );
		}
PAWS_OIDC_bridge.login_loop = function() {
	let fn = this.depth+">PAWS_OIDC_bridge.login_loop";
	// console.log( fn+" invoked" );
	this.login( ( info ) => {
		if( info.failure ) {
			console.warn( fn+": Waiting "+this.ENV.login_loop_wait+"ms to retry")
			setTimeout( () => { this.login_loop(); }, this.ENV.login_loop_wait );
		}
	} );
}
PAWS_OIDC_bridge.login = function( callback ) {
		let fn = this.depth+">PAWS_OIDC_bridge.login";
		// console.log( fn+" invoked" );
		this.await_prop( "mgr", () => {
			this.mgr.signinSilent().then( () => {
				// console.log( fn+": Login Completed" );
				this.update_status( fn+": Login Completed" );
				if( callback ) { callback({}); }
			} ).catch( (err) => {
				// console.log( fn+": Login Failed! -- ", err.message );
				this.update_status( fn+": Login Failed! -- "+err.message );
				if( callback ) { callback( { failure:true, error:err, message:err.message } ); }
			} );
			// console.log( fn+": In Progress..." );
		} );
	};
PAWS_OIDC_bridge.logout = function( callback ) {
		let fn = this.depth+">PAWS_OIDC_bridge.logout";
		// console.log( fn+" invoked" );
		this.await_prop( "mgr", () => {
			let tag = document.createElement("iframe");
			if( this.ENV.iframe_style ) { for( key in this.ENV.iframe_style ) { tag.style[key] = this.ENV.iframe_style[key]; } }
			tag.setAttribute( "src", this.ENV.uri_logout+"?"+(new Date()).toISOString() );
			tag.setAttribute( "sandbox", "allow-scripts allow-same-origin" ); // this should prevent iframe from navigating top window
			let timeout, listener;
			listener = (event) => {
				// console.log( fn+"/Event: ", event );
				// console.log( fn+"/Event: ", JSON.stringify(event) );
				// console.log( fn+"/Event: data = ", event.data );
				if( event.source === tag.contentWindow ) {
					// console.log( fn+"/Event: Processing Event from iframe" );
					clearTimeout(timeout);
					window.removeEventListener( "message", listener );
					tag.remove();
					// console.log( fn+"/Event: data = ", event.data );
					let data = JSON.parse( event.data );
					// console.log( fn+"/Event: data = ", data );
					if( data.failure ) {
						let message = data; if( data.error ) { message = data.error; if( data.error.message ) { message = data.error.message; } }
						// console.error( fn+"/Event: Logout failed -- ", message );
						this.update_status( fn+"/Event: Logout failed -- " + message );
					} else {
						// console.log( fn+"/Event: Logout succeded" );
						this.update_status( fn+"/Event: Logout succeded" );
					}
					// console.log( fn+"/Event: Invoking callback with ", data );
					if( callback ) { callback( data ); }
				// } else {
				// 	console.log( fn+"/Event: Ignoring Event NOT from iframe" );
				}
			}
			window.addEventListener( "message", listener );
			this.update_status( fn+": opening iframe" );
			timeout = setTimeout( () => {
				window.removeEventListener( "message", listener );
				tag.remove();
				let message = "Logout request timed out after "+this.ENV.loginSettings.silentRequestTimeout/1000+" seconds";
				// console.error( fn+"/Event: Logout failed -- ", message );
				this.update_status( fn+"/Event: Logout failed -- " + message );
				if( callback ) { callback( { failure:true, error:new Error(message), message:message } ); }
			}, 2*this.ENV.loginSettings.silentRequestTimeout ); // double because two requests are made of auth server
			document.body.appendChild(tag);
		} );
	};
PAWS_OIDC_bridge.popup_login = function() {
		let fn = this.depth+">PAWS_OIDC_bridge.popup_login";
		// console.log( fn+" invoked" );
		this.await_prop( "mgr", () => {
			this.mgr.signinPopup().then( () => {
				// console.log( fn+": Completed" );
				this.update_status( fn+": Completed" );
			} ).catch( (err) => {
				// console.log( fn+": Failed! ", err.message );
				this.update_status( fn+": Failed! "+err.message );
			} );
			// console.log( fn+": In Progress..." );
		} );
	};
PAWS_OIDC_bridge.loadscripts = function(urls,callback) {
		let fn = this.depth+">PAWS_OIDC_bridge.loadscripts";
		// console.log( fn+" invoked: ", urls.join(", ") );
		let count = urls.length;
		for( url of urls ) {
			this.loadscript( url, () => {
				count -= 1;
				if( 0 == count && callback ) { callback(); }
			} );
		}
	};
PAWS_OIDC_bridge.loadscript = function(url,callback) {
		let fn = this.depth+">PAWS_OIDC_bridge.loadscript";
		// console.log( fn+" invoked" );
		let tag = document.createElement("script");
		tag.setAttribute("src",url+"?"+(new Date()).toISOString())
		tag.onload = function() {
			// console.log( fn+": loaded", url );
			document.head.removeChild(tag);
			if(callback) { callback(); }
		};
		document.head.appendChild(tag);
	};
PAWS_OIDC_bridge.update_status = function(message) {
		let fn = this.depth+">PAWS_OIDC_bridge.update_status";
		if( this.ENV && this.ENV.status_elm ) {
			let elm = document.getElementById( this.ENV.status_elm );
			if( elm ) {
				let tag = document.createElement("p");
				tag.innerText = message;
				elm.appendChild(tag)
			}
		} else {
			console.warn( fn+": No destination for message -- ", message );
		}
	};
PAWS_OIDC_bridge.await_prop = function( prop, callback, delay=0 ) {
		let fn = this.depth+">PAWS_OIDC_bridge.await_prop";
		// console.log( fn+" invoked; awaiting "+prop );
		let step = 1000;
		if( this.ENV && this.ENV.await_interval ) { step = this.ENV.await_interval; }
		if( undefined === this[prop] ) {
			// if( 0 == delay ) { this.update_status( fn+": waiting for "+prop ); }
			delay += step
			console.log( fn+":", prop, delay );
			setTimeout( () => this.await_prop(prop,callback,delay), step );
		} else {
			// console.log( fn+": waited "+delay+"ms for "+prop );
			this.update_status( fn+": waited "+delay+"ms for "+prop );
			callback();
		}
	};
PAWS_OIDC_bridge.helper_logout = function() {
		let fn = this.depth+">PAWS_OIDC_bridge.helper_logout";
		// console.log( fn+" invoked" );
		this.await_prop( "user", () => {
			this.mgr.signoutRedirect().then( () => {
				// console.log( fn+": Completed" );
				this.update_status( fn+": Completed" );
			} ).catch( (err) => {
				// console.log( fn+": Failed! ", err.message );
				this.update_status( fn+": Failed! "+err.message );
				let message = JSON.stringify( { failure: true, href: this.initial_href, error: err } );
				console.log( fn+": Failure postMessage to origin ", this.ENV.pageOrigin );
				parent.postMessage( message, this.ENV.pageOrigin );
			} );
			// console.log( fn+": In Progress..." );
		} );
	}
PAWS_OIDC_bridge.callback_silent = function() {
		let fn = this.depth+">PAWS_OIDC_bridge.callback_silent";
		// console.log( fn+" invoked" );
		this.await_prop( "mgr", () => {
			this.mgr.signinSilentCallback( this.initial_href ).then( () => {
				// console.log( fn+": Completed" );
				this.update_status( fn+": Completed" );
			} ).catch( (err) => {
				// console.error( fn+": Failed! ", err.message );
				this.update_status( fn+": Failed! "+err.message );
			} );
			// console.log( fn+": In Progress..." );
		} );
	};
PAWS_OIDC_bridge.callback_logout = function() {
		let fn = this.depth+">PAWS_OIDC_bridge.callback_logout";
		// console.log( fn+" invoked" );
		this.await_prop( "mgr", () => {
			// console.log( fn+": href = ", this.initial_href );
			let message = JSON.stringify( { failure: false, href: this.initial_href } );
			console.log( fn+": postMessage with message =", message );
			console.log( fn+": postMessage with origin =", this.ENV.pageOrigin );
			parent.postMessage( message, this.ENV.pageOrigin );
		} );
	};
PAWS_OIDC_bridge.callback_popup = function() {
		let fn = this.depth+">PAWS_OIDC_bridge.callback_popup";
		console.log( fn+" invoked" );
		this.await_prop( "mgr", () => {
			this.mgr.signinPopupCallback( this.initial_href ).then( () => {
				console.log( fn+": Completed" );
				this.update_status( fn+": Completed" );
			} ).catch( (err) => {
				console.log( fn+": Failed! ", err );
				this.update_status( fn+": Failed! "+err.message );
			} );
			// console.log( fn+": In Progress..." );
		} );
	};
PAWS_OIDC_bridge.logout_handler = function() {
		let fn = this.depth+">PAWS_OIDC_bridge.logout_handler";
		// console.log( fn+" invoked" );
		console.log( fn+": No cleanup needed" );
	};

PAWS_OIDC_bridge.main();

/*
 * App Page: normal
 * Test Page: scriptOrigin replaces pageOrigin
 * Silent Callback:
 * 	from App: normal
 * 	from Test: scriptOrigin replaces pageOrigin
 * 	from Helper: scriptOrigin replaces pageOrigin
 * Logout Helper:
 * 	from App: scriptOrigin replaces pageOrigin ONLY FOR OIDC-CLIENT
 * 	from Test: scriptOrigin replaces pageOrigin
 * Logout Callback: 
 * 	from App: normal
 * 	from Test: scriptOrigin replaces pageOrigin
 *  from Helper: scriptOrigin replaces pageOrigin
 * Logout Handler: doesn't use either
 * Popup Callback (from Test only): scriptOrigin replaces pageOrigin
 * 
 */
