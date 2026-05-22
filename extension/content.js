// Epirus Shield - Gmail Content Script
// Injects verification badges next to email senders

// GMAIL_SELECTOR: These selectors may change if Gmail updates its UI
// Update these if badges stop appearing
const SELECTORS = {
  // Email list view - sender name
  listSender: ".yW span[email]",
  // Email detail view - sender in header
  detailSender: ".gD",
  // Conversation view - each message sender
  messageSender: ".go",
};

// Badge HTML templates
function createVerifiedBadge(organization) {
  const badge = document.createElement("span");
  badge.className = "epirus-shield-badge epirus-shield-verified";
  badge.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"/>
    </svg>
    <span>Επαληθευμένος — ${organization}</span>
  `;
  badge.title = `Επαληθευμένος αποστολέας: ${organization}`;
  return badge;
}

function createWarningBadge() {
  const badge = document.createElement("span");
  badge.className = "epirus-shield-badge epirus-shield-warning";
  badge.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"/>
    </svg>
    <span>Μη επαληθευμένος</span>
  `;
  badge.title = "Προσοχή: Αυτός ο αποστολέας δεν είναι επαληθευμένος από την Epirus Bank";
  return badge;
}

// Track processed elements to avoid duplicates
const processedElements = new WeakSet();

// Check if an email looks like it's trying to impersonate the bank
function looksLikeBankEmail(email) {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  const suspiciousPatterns = [
    /epirus/i,
    /bank/i,
    /τραπεζ/i,
    /secure/i,
    /verify/i,
    /account/i,
  ];
  return suspiciousPatterns.some((p) => p.test(domain) || p.test(email));
}

async function checkAndBadgeElement(element) {
  if (processedElements.has(element)) return;
  processedElements.add(element);

  const email = element.getAttribute("email") || element.textContent?.match(/[\w.-]+@[\w.-]+/)?.[0];
  if (!email) return;

  // Only badge emails that look like they might be from a bank
  if (!looksLikeBankEmail(email)) return;

  // Remove any existing badge
  const existingBadge = element.parentElement?.querySelector(".epirus-shield-badge");
  if (existingBadge) existingBadge.remove();

  try {
    const response = await chrome.runtime.sendMessage({
      type: "CHECK_EMAIL",
      email: email,
    });

    const badge = response.verified
      ? createVerifiedBadge(response.organization)
      : createWarningBadge();

    // Insert badge after the element
    element.parentElement?.insertBefore(badge, element.nextSibling);
  } catch (error) {
    console.error("Epirus Shield: Failed to check email", error);
  }
}

function scanForSenders() {
  // Scan all selector types
  Object.values(SELECTORS).forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      checkAndBadgeElement(element);
    });
  });

  // Also scan for any element with email attribute
  document.querySelectorAll("[email]").forEach((element) => {
    checkAndBadgeElement(element);
  });
}

// Initial scan
scanForSenders();

// Watch for DOM changes (Gmail is a SPA)
const observer = new MutationObserver((mutations) => {
  let shouldScan = false;
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      shouldScan = true;
      break;
    }
  }
  if (shouldScan) {
    // Debounce scans
    clearTimeout(observer.scanTimeout);
    observer.scanTimeout = setTimeout(scanForSenders, 200);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

console.log("Epirus Shield: Content script loaded");
