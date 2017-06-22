PAWS_OIDC_bridge.await_interval = 1000;
PAWS_OIDC_bridge.ENV = {
	loginSettings: {
		authority: "https://idp.gsu.edu/",
		client_id: "",
		redirect_uri: "https://cdn.gsu.edu/PAWS-OIDC-bridge/redirect.html",
		silent_redirect_uri: "https://cdn.gsu.edu/PAWS-OIDC-bridge/silent.html",
		popup_redirect_uri: "https://cdn.gsu.edu/PAWS-OIDC-bridge/popup.html",
		post_logout_redirect_uri: "https://cdn.gsu.edu/PAWS-OIDC-bridge/logout.html",
		response_type: 'id_token token',
		scope: "openid profile gsupersonpantherid",
		automaticSilentRenew: true,
		monitorSession: true,
		filterProtocolClaims: false,
		loadUserInfo: true,
		revokeAccessTokenOnSignout: true
	}
}
PAWS_OIDC_bridge.uri_logout = "https://cdn.gsu.edu/PAWS-OIDC-bridge/logout_helper.html";
PAWS_OIDC_bridge.status_elm = "PAWS-OIDC-bridge-status";
PAWS_OIDC_bridge.iframe_style = { 
	display: "none",
	visibility: "hidden"
}
