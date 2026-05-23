// Epirus Shield — background service worker.
// The verified domains list is bundled (no backend), so this just answers
// the popup's request with the static list.

const VERIFIED_DOMAINS = [
  { domain: 'epirusbank.gr', organization: 'Epirus Bank' },
  { domain: 'epirus-bank.gr', organization: 'Epirus Bank' },
  { domain: 'mail.epirusbank.gr', organization: 'Epirus Bank' },
];

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request && request.type === 'GET_VERIFIED_DOMAINS') {
    sendResponse({ domains: VERIFIED_DOMAINS });
  }
});
