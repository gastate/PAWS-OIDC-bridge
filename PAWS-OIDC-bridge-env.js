if( typeof PAWS_OIDC_bridge === "undefined" ) { PAWS_OIDC_bridge = {}; }
PAWS_OIDC_bridge.ENV = {
	await_interval: 101,
	loginSettings: {
		authority: "https://idp-d.gsu.edu/",
		client_id: "@!DE0A.9C27.805E.9101!0001!2E8F.F37E!0008!48AF.805B",
		redirect_uri: "http://localhost:8080/redirect.html",
		silent_redirect_uri: "http://localhost:8080/silent.html",
		popup_redirect_uri: "http://localhost:8080/popup.html",
		post_logout_redirect_uri: "http://localhost:8080/logout.html",
		response_type: 'id_token token',
		scope: "openid profile gsupersonpantherid",
		automaticSilentRenew: true,
		silentRequestTimeout: 11000, //ms
		monitorSession: true,
		filterProtocolClaims: false,
		loadUserInfo: true,
		revokeAccessTokenOnSignout: true,
		origin: "http://localhost:8080",
	},
	uri_logout: "http://localhost:8080/logout_helper.html",
	status_elm: "PAWS-OIDC-bridge-status",
	iframe_style: { 
		width: "100%",
		height: "20em",
	},
}
