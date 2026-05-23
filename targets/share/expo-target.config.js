/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
// Share Extension — appears in the iOS Share sheet as "EpirusBank".
// From Mail/Gmail, share a suspicious email (or its selected text) here
// to get an instant phishing verdict.
module.exports = () => ({
  type: 'share',
  name: 'ShareCheck',
  displayName: 'EpirusBank',
  bundleIdentifier: 'com.epirusbank.shield.ShareCheck',
  icon: '../../assets/icon.png',
  frameworks: ['UIKit', 'SwiftUI'],
});
