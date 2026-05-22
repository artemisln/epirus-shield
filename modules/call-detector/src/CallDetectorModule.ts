import { NativeModule, requireNativeModule } from 'expo';

import {
  CallDetectorModuleEvents,
  CallDirectoryEntry,
  CallDirectoryStatus,
} from './CallDetector.types';

declare class CallDetectorModule extends NativeModule<CallDetectorModuleEvents> {
  /** Returns true if a call is currently in progress (Layer B). */
  isCallActive(): boolean;
  /** Writes the number list to the App Group and reloads the extension (Layer A). */
  syncCallDirectory(entries: CallDirectoryEntry[]): Promise<void>;
  /** Reports whether the Call Directory extension is enabled in iOS Settings. */
  getCallDirectoryStatus(): Promise<CallDirectoryStatus>;
}

export default requireNativeModule<CallDetectorModule>('CallDetector');
