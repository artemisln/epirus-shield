// Epirus Shield - Background Service Worker
// Handles communication between content script and API

// DEMO: Default verified domains (fallback if API unavailable)
const DEFAULT_VERIFIED_DOMAINS = [
  { domain: "epirusbank.gr", organization: "Epirus Bank" },
  { domain: "epirus-bank.gr", organization: "Epirus Bank" },
  { domain: "mail.epirusbank.gr", organization: "Epirus Bank" },
];

// Cache for verified domains
let verifiedDomainsCache = DEFAULT_VERIFIED_DOMAINS;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minute

// API endpoint - change this to your deployed URL in production
// DEMO: Using localhost for development
const API_BASE_URL = "http://localhost:3000";

async function fetchVerifiedDomains() {
  const now = Date.now();
  if (now - lastFetchTime < CACHE_DURATION) {
    return verifiedDomainsCache;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/verification/domains`);
    if (response.ok) {
      const data = await response.json();
      verifiedDomainsCache = data.domains || DEFAULT_VERIFIED_DOMAINS;
      lastFetchTime = now;
    }
  } catch (error) {
    console.log("Epirus Shield: Using cached/default domains", error);
  }

  return verifiedDomainsCache;
}

function extractDomain(email) {
  const match = email.match(/@([^@\s]+)$/);
  return match ? match[1].toLowerCase() : null;
}

function isDomainVerified(emailDomain, verifiedDomains) {
  const normalized = emailDomain.toLowerCase();
  return verifiedDomains.find(
    (d) => normalized === d.domain.toLowerCase() || normalized.endsWith(`.${d.domain.toLowerCase()}`)
  );
}

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "CHECK_EMAIL") {
    const email = request.email;
    const domain = extractDomain(email);

    if (!domain) {
      sendResponse({ verified: false, error: "Invalid email" });
      return true;
    }

    fetchVerifiedDomains().then((domains) => {
      const match = isDomainVerified(domain, domains);
      sendResponse({
        verified: !!match,
        organization: match?.organization,
        domain: match?.domain,
      });
    });

    return true; // Keep channel open for async response
  }

  if (request.type === "GET_VERIFIED_DOMAINS") {
    fetchVerifiedDomains().then((domains) => {
      sendResponse({ domains });
    });
    return true;
  }
});

// Fetch domains on install/update
chrome.runtime.onInstalled.addListener(() => {
  fetchVerifiedDomains();
});
