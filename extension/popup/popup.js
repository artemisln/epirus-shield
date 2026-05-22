// Popup script - loads verified domains from background
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await chrome.runtime.sendMessage({ type: "GET_VERIFIED_DOMAINS" });
    const domains = response.domains || [];

    const list = document.getElementById("domains-list");
    if (domains.length > 0) {
      list.innerHTML = domains
        .map(
          (d) => `
        <li>
          <svg class="domain-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"/>
          </svg>
          <span>${d.domain}</span>
        </li>
      `
        )
        .join("");
    }
  } catch (error) {
    console.error("Failed to load domains:", error);
  }
});
