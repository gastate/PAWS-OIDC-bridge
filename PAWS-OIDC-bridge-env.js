PAWS_OIDC_bridge.ENV = {
	loginSettings: {
		authority: "https://idp-d.gsu.edu/",
		client_id: "@!DE0A.9C27.805E.9101!0001!2E8F.F37E!0008!48AF.805B",
		redirect_uri: "http://localhost:8080/redirect",
		silent_redirect_uri: "http://localhost:8080/silent",
		popup_redirect_uri: "http://localhost:8080/popup",
		post_logout_redirect_uri: "http://localhost:8080/logout",
		response_type: 'id_token token',
		scope: "openid profile gsupersonpantherid",
		automaticSilentRenew: true,
		monitorSession: true,
		filterProtocolClaims: false,
		loadUserInfo: true,
		revokeAccessTokenOnSignout: true
	}
}
PAWS_OIDC_bridge.uri_logout = "http://localhost:8080/logout_helper";
PAWS_OIDC_bridge.status_elm = "PAWS-OIDC-bridge-status";
PAWS_OIDC_bridge.iframe_style = { 
	width: "100%",
	height: "15em",
}
