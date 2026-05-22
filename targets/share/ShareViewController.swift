import SwiftUI
import UIKit

// Share Extension — receives shared email text/links from Mail, Gmail, etc.
// and shows an instant phishing verdict. Self-contained: the analysis runs
// here with no network and no main-app dependency.

// MARK: - Analysis

struct PhishingAnalysis {
  let isLikelyScam: Bool
  let title: String
  let reasons: [String]
}

enum EmailScamAnalyzer {
  // Genuine Epirus Bank domains (kept in sync with domain/data).
  static let verifiedDomains = [
    "epirusbank.gr", "epirus-bank.gr", "mail.epirusbank.gr",
  ]

  static func analyze(_ rawText: String) -> PhishingAnalysis {
    let text = rawText.lowercased()
    var reasons: [String] = []

    if text.isEmpty {
      return PhishingAnalysis(
        isLikelyScam: false,
        title: "Δεν βρέθηκε κείμενο",
        reasons: [
          "Επιλέξτε το κείμενο του email και μοιραστείτε το ξανά εδώ.",
        ])
    }

    // 1. Requests for credentials / card data — banks never ask.
    let credentialTerms = [
      "κωδικ", "password", "pin", "otp", "cvv", "cvc",
      "στοιχεία κάρτας", "αριθμό κάρτας", "3ψήφιο", "one-time",
    ]
    if credentialTerms.contains(where: { text.contains($0) }) {
      reasons.append(
        "Ζητούνται κωδικοί ή στοιχεία κάρτας — η Epirus Bank δεν τα ζητά ποτέ με email.")
    }

    // 2. Urgency / threats.
    let urgencyTerms = [
      "άμεσ", "επειγ", "εντός 24", "αναστ", "θα κλειδ", "θα απενεργοπ",
      "urgent", "immediately", "suspend", "blocked", "verify your account",
      "verify now", "within 24",
    ]
    if urgencyTerms.contains(where: { text.contains($0) }) {
      reasons.append(
        "Δημιουργεί επείγον ή απειλεί με κλείσιμο λογαριασμού — κλασική τακτική απάτης.")
    }

    // 3. Links / sender domains outside the bank's official domains.
    let domains = extractDomains(from: rawText)
    let mentionsBank =
      text.contains("epirus") || text.contains("ηπείρου")
      || text.contains("τράπεζ") || text.contains("bank")
    let hasVerified = domains.contains { isVerified($0) }
    let suspicious = Array(Set(domains.filter { !isVerified($0) })).sorted()

    if mentionsBank && !suspicious.isEmpty {
      reasons.append(
        "Περιέχει διευθύνσεις εκτός των επίσημων domain της Epirus Bank: "
          + suspicious.prefix(3).joined(separator: ", "))
    }

    if !reasons.isEmpty {
      return PhishingAnalysis(
        isLikelyScam: true, title: "Πιθανή απάτη", reasons: reasons)
    }
    if hasVerified {
      return PhishingAnalysis(
        isLikelyScam: false,
        title: "Φαίνεται γνήσιο",
        reasons: [
          "Ο αποστολέας χρησιμοποιεί επίσημο domain της Epirus Bank.",
          "Δεν εντοπίστηκαν ενδείξεις απάτης.",
        ])
    }
    return PhishingAnalysis(
      isLikelyScam: false,
      title: "Δεν εντοπίστηκαν ενδείξεις",
      reasons: [
        "Δεν βρέθηκαν σαφείς ενδείξεις απάτης, αλλά παραμείνετε προσεκτικοί.",
      ])
  }

  static func isVerified(_ domain: String) -> Bool {
    let d = domain.lowercased()
    return verifiedDomains.contains { d == $0 || d.hasSuffix("." + $0) }
  }

  /// Domains from both email addresses and http(s) links in the text.
  static func extractDomains(from text: String) -> [String] {
    let emails = matches(
      "[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})", in: text)
    let urls = matches("https?://([A-Za-z0-9.-]+)", in: text)
    return emails + urls
  }

  private static func matches(_ pattern: String, in text: String) -> [String] {
    guard
      let re = try? NSRegularExpression(
        pattern: pattern, options: [.caseInsensitive])
    else { return [] }
    let ns = text as NSString
    return re.matches(in: text, range: NSRange(location: 0, length: ns.length))
      .compactMap { match in
        guard match.numberOfRanges > 1 else { return nil }
        let range = match.range(at: 1)
        guard range.location != NSNotFound else { return nil }
        return ns.substring(with: range).lowercased()
      }
  }
}

// MARK: - Verdict UI

struct ShareResultView: View {
  let analysis: PhishingAnalysis
  let onClose: () -> Void

  private var accent: Color {
    analysis.isLikelyScam
      ? Color(red: 0.733, green: 0.086, blue: 0.086)  // alert red
      : Color(red: 0.0, green: 0.541, blue: 0.020)  // success green
  }

  var body: some View {
    VStack(spacing: 0) {
      VStack(spacing: 10) {
        Image(
          systemName: analysis.isLikelyScam
            ? "exclamationmark.triangle.fill" : "checkmark.shield.fill"
        )
        .font(.system(size: 46))
        .foregroundColor(.white)
        Text(analysis.title)
          .font(.title2).bold()
          .foregroundColor(.white)
        Text("Έλεγχος email — Epirus Shield")
          .font(.footnote)
          .foregroundColor(.white.opacity(0.85))
      }
      .frame(maxWidth: .infinity)
      .padding(.vertical, 28)
      .background(accent)

      ScrollView {
        VStack(alignment: .leading, spacing: 14) {
          ForEach(analysis.reasons, id: \.self) { reason in
            HStack(alignment: .top, spacing: 10) {
              Image(systemName: "circle.fill")
                .font(.system(size: 6))
                .foregroundColor(accent)
                .padding(.top, 7)
              Text(reason)
                .font(.body)
                .foregroundColor(.primary)
            }
          }
        }
        .padding(20)
      }

      Spacer(minLength: 0)

      Button(action: onClose) {
        Text("Κλείσιμο")
          .font(.headline)
          .foregroundColor(.white)
          .frame(maxWidth: .infinity)
          .padding(.vertical, 16)
          .background(Color(red: 0.141, green: 0.231, blue: 0.447))  // navy
          .cornerRadius(14)
      }
      .padding(20)
    }
  }
}

// MARK: - Extension entry point

class ShareViewController: UIViewController {
  override func viewDidLoad() {
    super.viewDidLoad()
    view.backgroundColor = .systemBackground

    loadSharedText { [weak self] text in
      DispatchQueue.main.async {
        self?.showResult(for: text)
      }
    }
  }

  private func loadSharedText(completion: @escaping (String) -> Void) {
    guard let items = extensionContext?.inputItems as? [NSExtensionItem] else {
      completion("")
      return
    }

    var collected = ""
    let group = DispatchGroup()
    let typeIds = ["public.plain-text", "public.text", "public.url"]

    for item in items {
      if let attributed = item.attributedContentText?.string,
        !attributed.isEmpty
      {
        collected += attributed + "\n"
      }
      for provider in item.attachments ?? [] {
        guard let typeId = typeIds.first(where: provider.hasItemConformingToTypeIdentifier)
        else { continue }
        group.enter()
        provider.loadItem(forTypeIdentifier: typeId, options: nil) { data, _ in
          if let string = data as? String {
            collected += string + "\n"
          } else if let url = data as? URL {
            collected += url.absoluteString + "\n"
          } else if let raw = data as? Data,
            let string = String(data: raw, encoding: .utf8)
          {
            collected += string + "\n"
          }
          group.leave()
        }
      }
    }

    group.notify(queue: .main) {
      completion(
        collected.trimmingCharacters(in: .whitespacesAndNewlines))
    }
  }

  private func showResult(for text: String) {
    let analysis = EmailScamAnalyzer.analyze(text)
    let rootView = ShareResultView(analysis: analysis) { [weak self] in
      self?.extensionContext?.completeRequest(
        returningItems: [], completionHandler: nil)
    }

    let host = UIHostingController(rootView: rootView)
    addChild(host)
    host.view.translatesAutoresizingMaskIntoConstraints = false
    view.addSubview(host.view)
    NSLayoutConstraint.activate([
      host.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      host.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
      host.view.topAnchor.constraint(equalTo: view.topAnchor),
      host.view.bottomAnchor.constraint(equalTo: view.bottomAnchor),
    ])
    host.didMove(toParent: self)
  }
}
