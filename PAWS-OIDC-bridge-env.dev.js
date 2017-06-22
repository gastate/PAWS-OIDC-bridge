PAWS_OIDC_bridge.await_interval = 1000;
PAWS_OIDC_bridge.ENV = {
	loginSettings: {
		authority: "https://idp-d.gsu.edu/",
		client_id: "@!DE0A.9C27.805E.9101!0001!2E8F.F37E!0008!48AF.805B",
		redirect_uri: "https://cdn-dev.gsu.edu/PAWS-OIDC-bridge/redirect.html",
		silent_redirect_uri: "https://cdn-dev.gsu.edu/PAWS-OIDC-bridge/silent.html",
		popup_redirect_uri: "https://cdn-dev.gsu.edu/PAWS-OIDC-bridge/popup.html",
		post_logout_redirect_uri: "https://cdn-dev.gsu.edu/PAWS-OIDC-bridge/logout.html",
		response_type: 'id_token token',
		scope: "openid profile gsupersonpantherid",
		automaticSilentRenew: true,
		monitorSession: true,
		filterProtocolClaims: false,
		loadUserInfo: true,
		revokeAccessTokenOnSignout: true
	}
}
PAWS_OIDC_bridge.uri_logout = "https://cdn-dev.gsu.edu/PAWS-OIDC-bridge/logout_helper.html";
PAWS_OIDC_bridge.status_elm = "PAWS-OIDC-bridge-status";
PAWS_OIDC_bridge.iframe_style = { 
	width: "100%",
	height: "20em",
}
