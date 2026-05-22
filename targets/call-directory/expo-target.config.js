/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
// Layer A — the Call Directory extension. Labels verified Epirus Bank numbers
// and known scam numbers on the native incoming-call screen. Shares its number
// list with the main app through the App Group container.
module.exports = (config) => ({
  type: 'call-directory',
  name: 'CallDirectory',
  bundleIdentifier: 'com.epirusbank.shield.CallDirectory',
  frameworks: ['CallKit'],
  entitlements: {
    'com.apple.security.application-groups':
      config.ios.entitlements['com.apple.security.application-groups'],
  },
});
