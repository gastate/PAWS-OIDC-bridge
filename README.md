# PAWS-OIDC-bridge
Scripts for PAWS to find &amp; close the OIDC session that underlies its CAS session

Including `PAWS-OIDC-bridge.js` will create two global objects:

 * `Oidc`: The `oidc-client-js` object from https://github.com/IdentityModel/oidc-client-js
 
 * `PAWS_OIDC_bridge`: Functionality from this project
   * `main()`: *RUNS WHEN LOADED*; sets up OIDC library, calls login unless `PAWS_OIDC_bridge.AUTOLOGIN === false`
   * `login()`: Called automatically, or call when ready; detects existing OIDC session
   * `logout(callback)`: Call after user requests logout and before performing PAWS logout; ends OIDC session detected by `login()`
     * `callback(info)`: Invoked when OIDC session has been closed
       * `info`: The result of the logout request
         * `failure`: Logout failure indicated by `info.failure===true`
         * `error`: The Error object, if available

These methods will append status messages to the DOM element with ID `PAWS-OIDC-bridge-status`, if it exists.

### Running Locally

This can be run locally with any simple web server.  Just serve the files in this directory.

Local URLs assume this directory is the root, and the server is running on port 8080 (the default for npm package`http-server`).

To run locally using npm package `http-server`:
* Install server: run `npm install http-server -g`
* Start server: In this directory, run `http-server`
* Point browser to http://localhost:8080/

