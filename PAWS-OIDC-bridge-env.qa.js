if( typeof PAWS_OIDC_bridge === "undefined" ) { PAWS_OIDC_bridge = {}; }
PAWS_OIDC_bridge.ENV = {
	name: "QA",
	await_interval: 400,
	loginSettings: {
		authority: "https://idp-qa.gsu.edu/",
		client_id: "@!0820.7AAD.866E.4E4C!0001!A644.9660!0008!25B4.3F2E",
		redirect_uri: "https://cdn-qa.gsu.edu/PAWS-OIDC-bridge/redirect.html",
		silent_redirect_uri: "https://cdn-qa.gsu.edu/PAWS-OIDC-bridge/silent.html",
		popup_redirect_uri: "https://cdn-qa.gsu.edu/PAWS-OIDC-bridge/popup.html",
		post_logout_redirect_uri: "https://cdn-qa.gsu.edu/PAWS-OIDC-bridge/logout.html",
		response_type: 'id_token token',
		scope: "openid profile gsupersonpantherid",
		automaticSilentRenew: true,
		silentRequestTimeout: 11000, //ms
		monitorSession: true,
		filterProtocolClaims: false,
		loadUserInfo: true,
		revokeAccessTokenOnSignout: true,
		pageOrigin: "https://pawsqaportal.gsu.edu",
		scriptOrigin: document.currentScript.src.substr(0, document.currentScript.src.indexOf("/", document.currentScript.src.indexOf("//") + 2)),
	},
	uri_logout: "https://cdn-qa.gsu.edu/PAWS-OIDC-bridge/logout_helper.html",
	status_elm: "PAWS-OIDC-bridge-status",
	iframe_style: { 
		display: "none",
		visibility: "hidden"
	},
}
