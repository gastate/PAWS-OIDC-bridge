PAWS_OIDC_bridge.ENV = {
	loginSettings: {
		authority: "https://idp-d.gsu.edu/",
		client_id: "@!DE0A.9C27.805E.9101!0001!2E8F.F37E!0008!48AF.805B",
		redirect_uri: "https://cdn-dev.gsu.edu/PAWS-OIDC-bridge/redirect",
		silent_redirect_uri: "https://cdn-dev.gsu.edu/PAWS-OIDC-bridge/silent",
		popup_redirect_uri: "https://cdn-dev.gsu.edu/PAWS-OIDC-bridge/popup",
		post_logout_redirect_uri: "https://cdn-dev.gsu.edu/PAWS-OIDC-bridge/logout",
		response_type: 'id_token token',
		scope: "openid profile gsupersonpantherid",
		automaticSilentRenew: true,
		monitorSession: true,
		filterProtocolClaims: false,
		loadUserInfo: true,
		revokeAccessTokenOnSignout: true
	}
}
PAWS_OIDC_bridge.status_elm = "PAWS-OIDC-bridge-status";
