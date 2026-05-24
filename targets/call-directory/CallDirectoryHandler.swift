import CallKit
import Foundation

// Must match app.json ios.entitlements and the main app's CallDetectorModule.
private let appGroupId = "group.com.epirusbank.shield"
private let dataFileName = "call-directory.json"

// Layer A — Call Directory extension.
// Runs as a separate process; the system invokes it to learn which numbers to
// identify on the incoming-call screen. The number list is written by the main
// app into the shared App Group container.
class CallDirectoryHandler: CXCallDirectoryProvider {

  private struct DirectoryEntry {
    let number: CXCallDirectoryPhoneNumber
    let label: String
  }

  override func beginRequest(with context: CXCallDirectoryExtensionContext) {
    context.delegate = self

    // Every reload reflects the full current list: on an incremental request
    // clear the previous entries first, then add the current set fresh.
    if context.isIncremental {
      context.removeAllIdentificationEntries()
    }

    for entry in loadEntries() {
      context.addIdentificationEntry(
        withNextSequentialPhoneNumber: entry.number,
        label: entry.label
      )
    }

    context.completeRequest()
  }

  private func loadEntries() -> [DirectoryEntry] {
    guard
      let containerURL = FileManager.default.containerURL(
        forSecurityApplicationGroupIdentifier: appGroupId),
      let data = try? Data(
        contentsOf: containerURL.appendingPathComponent(dataFileName)),
      let json = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]]
    else {
      return []
    }

    let parsed = json.compactMap { item -> DirectoryEntry? in
      guard
        let number = (item["number"] as? NSNumber)?.int64Value,
        let label = item["label"] as? String
      else {
        return nil
      }
      return DirectoryEntry(number: number, label: label)
    }

    // CXCallDirectory requires strictly ascending, de-duplicated numbers.
    var unique: [DirectoryEntry] = []
    for entry in parsed.sorted(by: { $0.number < $1.number }) {
      if unique.last?.number != entry.number {
        unique.append(entry)
      }
    }
    return unique
  }
}

extension CallDirectoryHandler: CXCallDirectoryExtensionContextDelegate {
  func requestFailed(
    for extensionContext: CXCallDirectoryExtensionContext,
    withError error: Error
  ) {
    // Inspect the NSError for Call Directory error codes if a reload fails.
  }
}
