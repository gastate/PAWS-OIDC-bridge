if( typeof PAWS_OIDC_bridge === "undefined" ) { PAWS_OIDC_bridge = {}; }
PAWS_OIDC_bridge.ENV = {
	name: "PROD",
	await_interval: 400,
	loginSettings: {
		authority: "https://idp.gsu.edu/",
		client_id: "",
		redirect_uri: "https://cdn.gsu.edu/PAWS-OIDC-bridge/redirect.html",
		silent_redirect_uri: "https://cdn.gsu.edu/PAWS-OIDC-bridge/silent.html",
		popup_redirect_uri: "https://cdn.gsu.edu/PAWS-OIDC-bridge/popup.html",
		post_logout_redirect_uri: "https://cdn.gsu.edu/PAWS-OIDC-bridge/logout.html",
		response_type: 'id_token token',
		scope: "openid profile gsupersonpantherid user_name email",
		automaticSilentRenew: true,
		silentRequestTimeout: 11000, //ms
		monitorSession: true,
		filterProtocolClaims: false,
		loadUserInfo: true,
		revokeAccessTokenOnSignout: true,
		pageOrigin: "https://pawsportal.gsu.edu",
		scriptOrigin: document.currentScript.src.substr(0, document.currentScript.src.indexOf("/", document.currentScript.src.indexOf("//") + 2)),
	},
	uri_logout: "https://cdn.gsu.edu/PAWS-OIDC-bridge/logout_helper.html",
	iframe_style: { 
		display: "none",
		visibility: "hidden"
	},
}
