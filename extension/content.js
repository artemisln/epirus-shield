// Epirus Shield — Gmail content script.
//
// For every opened message: if the body / subject mentions "Epirus Bank"
// (in Greek or English) AND the sender's domain is NOT one of the verified
// Epirus Bank domains, inject a prominent red phishing-warning banner at
// the top of the message.

const VERIFIED_DOMAINS = [
  'epirusbank.gr',
  'epirus-bank.gr',
  'mail.epirusbank.gr',
];

const TRIGGER_PATTERNS = [
  /epirus[\s-]*bank/i,
  /epirusbank/i,
  /τράπεζ[αη]\s*ηπείρου/i,
  /τραπεζ[αη]\s*ηπειρου/i,
  /ηπείρου/i,
  /ηπειρου/i,
];

function getDomainFromEmail(email) {
  const match = email && email.match(/@([^@\s>]+)$/);
  return match ? match[1].toLowerCase() : null;
}

function isVerifiedDomain(domain) {
  if (!domain) return false;
  const d = domain.toLowerCase();
  return VERIFIED_DOMAINS.some((v) => d === v || d.endsWith('.' + v));
}

function mentionsBank(text) {
  return TRIGGER_PATTERNS.some((p) => p.test(text));
}

function getOpenSubject() {
  const subject = document.querySelector('h2.hP');
  return subject ? subject.textContent || '' : '';
}

function processMessage(msgEl) {
  if (msgEl.dataset.epirusShieldChecked) return;

  const senderSpan = msgEl.querySelector('span[email]');
  if (!senderSpan) return;
  const senderEmail = senderSpan.getAttribute('email');
  if (!senderEmail) return;

  msgEl.dataset.epirusShieldChecked = '1';

  const bodyEl = msgEl.querySelector('.a3s');
  const bodyText = bodyEl ? bodyEl.innerText : '';
  const haystack = (getOpenSubject() + '\n' + bodyText).slice(0, 8000);

  if (!mentionsBank(haystack)) return;

  const domain = getDomainFromEmail(senderEmail);
  if (isVerifiedDomain(domain)) return;

  injectWarning(msgEl, senderEmail, domain || '');
}

function injectWarning(msgEl, senderEmail, domain) {
  if (msgEl.querySelector('.epirus-shield-warning-banner')) return;

  const banner = document.createElement('div');
  banner.className = 'epirus-shield-warning-banner';
  banner.innerHTML = `
    <div class="epirus-shield-warning-icon">⚠</div>
    <div class="epirus-shield-warning-body">
      <div class="epirus-shield-warning-title">Πιθανή απάτη — Epirus Shield</div>
      <div class="epirus-shield-warning-text">
        Αυτό το email αναφέρει την <strong>Epirus Bank</strong>, αλλά ο αποστολέας
        <code class="epirus-shield-sender"></code> δεν προέρχεται από επίσημο
        domain της τράπεζας (<code class="epirus-shield-domain"></code>).
        Μην κάνετε κλικ σε συνδέσμους και μη δίνετε ποτέ κωδικούς ή στοιχεία κάρτας.
      </div>
    </div>
    <button class="epirus-shield-warning-close" type="button" aria-label="Κλείσιμο">×</button>
  `;
  banner.querySelector('.epirus-shield-sender').textContent = senderEmail;
  banner.querySelector('.epirus-shield-domain').textContent = domain;
  banner
    .querySelector('.epirus-shield-warning-close')
    .addEventListener('click', () => banner.remove());

  msgEl.prepend(banner);
}

function scan() {
  document.querySelectorAll('.adn').forEach(processMessage);
}

const observer = new MutationObserver(() => {
  clearTimeout(observer._scanTimer);
  observer._scanTimer = setTimeout(() => {
    try {
      scan();
    } catch (err) {
      console.error('Epirus Shield error:', err);
    }
  }, 250);
});

observer.observe(document.body, { childList: true, subtree: true });
scan();

console.log('Epirus Shield: content script loaded');
