if( typeof PAWS_OIDC_bridge === "undefined" ) { PAWS_OIDC_bridge = {}; }
PAWS_OIDC_bridge.ENV = {
	name: "LOCAL",
	pageOrigin: "http://localhost:8080",
	scriptOrigin: document.currentScript.src.substr(0, document.currentScript.src.indexOf("/", document.currentScript.src.indexOf("//") + 2)),
	loginSettings: {
		authority: "https://idp-d.gsu.edu/",
		client_id: "@!DE0A.9C27.805E.9101!0001!2E8F.F37E!0008!48AF.805B",
		redirect_uri: "http://localhost:8080/redirect.html",
		silent_redirect_uri: "http://localhost:8080/silent.html",
		popup_redirect_uri: "http://localhost:8080/popup.html",
		post_logout_redirect_uri: "http://localhost:8080/logout.html",
		response_type: 'id_token token',
		scope: "openid profile gsupersonpantherid user_name email",
		automaticSilentRenew: true,
		silentRequestTimeout: 11000, //ms
		monitorSession: true,
		filterProtocolClaims: false,
		loadUserInfo: true,
		revokeAccessTokenOnSignout: true,
		userinfoHeaderBug: true,
	},
	uri_logout: "http://localhost:8080/logout_helper.html",
	await_interval: 101, //ms
	login_loop_wait: 2500, //ms
	iframe_style: {
		width: "100%",
		height: "20em",
	},
	status_elm: "PAWS-OIDC-bridge-status",
}
