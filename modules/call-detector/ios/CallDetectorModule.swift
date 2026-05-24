import CallKit
import ExpoModulesCore

// App Group shared with the Call Directory extension. Must match
// app.json ios.entitlements and targets/call-directory/expo-target.config.js.
private let appGroupId = "group.com.epirusbank.shield"
private let callDirectoryFileName = "call-directory.json"

/// One phone-number entry handed to the Call Directory extension.
struct CallDirectoryEntryRecord: Record {
  @Field var number: Double = 0
  @Field var label: String = ""
}

/// CXCallObserverDelegate inherits from NSObjectProtocol, so the delegate must
/// be an NSObject. Expo's `Module` is not one, so observation is delegated to
/// this small helper that forwards changes back to the module.
class CallObserverDelegate: NSObject, CXCallObserverDelegate {
  var onCallChanged: (() -> Void)?

  func callObserver(_ callObserver: CXCallObserver, callChanged call: CXCall) {
    onCallChanged?()
  }
}

public class CallDetectorModule: Module {
  private var callObserver: CXCallObserver?
  private let observerDelegate = CallObserverDelegate()

  // The Call Directory extension's bundle id is the main app id + ".CallDirectory".
  private var callDirectoryExtensionId: String {
    (Bundle.main.bundleIdentifier ?? "com.epirusbank.shield") + ".CallDirectory"
  }

  public func definition() -> ModuleDefinition {
    Name("CallDetector")

    Events("onCallStateChange")

    // ---- Layer B: foreground call observation ----
    // Create the CXCallObserver eagerly at app startup so a call that is
    // already in progress when the user opens the app is detectable straight
    // away (isCallActive). CXCallObserver still only works while the app is
    // alive — iOS does not wake a suspended app for an incoming call.
    OnCreate {
      DispatchQueue.main.async {
        guard self.callObserver == nil else { return }
        self.observerDelegate.onCallChanged = { [weak self] in
          self?.emitCallState()
        }
        let observer = CXCallObserver()
        observer.setDelegate(self.observerDelegate, queue: nil)
        self.callObserver = observer
      }
    }

    // Synchronous snapshot of whether a call is currently in progress.
    Function("isCallActive") { () -> Bool in
      return self.callObserver?.calls.contains { !$0.hasEnded } ?? false
    }

    // ---- Layer A: Call Directory extension data sync ----

    // Writes the number list into the shared App Group container and asks the
    // system to reload the Call Directory extension.
    AsyncFunction("syncCallDirectory") {
      (entries: [CallDirectoryEntryRecord], promise: Promise) in
      guard
        let containerURL = FileManager.default.containerURL(
          forSecurityApplicationGroupIdentifier: appGroupId)
      else {
        promise.reject("ERR_APP_GROUP", "App Group container is unavailable.")
        return
      }

      let payload = entries.map { entry -> [String: Any] in
        ["number": Int64(entry.number), "label": entry.label]
      }

      do {
        let data = try JSONSerialization.data(withJSONObject: payload)
        try data.write(
          to: containerURL.appendingPathComponent(callDirectoryFileName))
      } catch {
        promise.reject("ERR_WRITE", error.localizedDescription)
        return
      }

      CXCallDirectoryManager.sharedInstance.reloadExtension(
        withIdentifier: self.callDirectoryExtensionId
      ) { error in
        if let error = error {
          promise.reject("ERR_RELOAD", error.localizedDescription)
        } else {
          promise.resolve(nil)
        }
      }
    }

    // Reports whether the user has enabled the Call Directory extension
    // in Settings → Phone → Call Blocking & Identification.
    AsyncFunction("getCallDirectoryStatus") { (promise: Promise) in
      CXCallDirectoryManager.sharedInstance.getEnabledStatusForExtension(
        withIdentifier: self.callDirectoryExtensionId
      ) { status, error in
        if let error = error {
          promise.reject("ERR_STATUS", error.localizedDescription)
          return
        }
        switch status {
        case .enabled: promise.resolve("enabled")
        case .disabled: promise.resolve("disabled")
        case .unknown: promise.resolve("unknown")
        @unknown default: promise.resolve("unknown")
        }
      }
    }
  }

  fileprivate func emitCallState() {
    let active = self.callObserver?.calls.contains { !$0.hasEnded } ?? false
    self.sendEvent("onCallStateChange", ["state": active ? "active" : "idle"])
  }
}
