# PAWS-OIDC-bridge
Scripts for PAWS to find &amp; close the OIDC session that underlies its CAS session

Including `PAWS-OIDC-bridge.js` will create two global objects:

 * `Oidc`: The `oidc-client-js` object from https://github.com/IdentityModel/oidc-client-js
 
 * `PAWS_OIDC_bridge`: Functionality from this project
   * `main()`: *RUNS WHEN LOADED*, sets up OIDC library
   * `login()`: Call when PAWS is ready, detects existing OIDC session
   * `logout(callback)`: Call after user requests logout and before performing PAWS logout, ends OIDC session detected by `login()`
     * `callback(info)`: Invoked when OIDC session has been closed
       * `info`: The result of the logout request
         * `failure`: Logout failure indicated by `info.failure===true`
         * `error`: The Error object, if available

These methods will append status messated to the DOM element with ID `PAWS-OIDC-bridge-status`, if it exists.
