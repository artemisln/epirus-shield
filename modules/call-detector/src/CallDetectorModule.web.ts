import { NativeModule, registerWebModule } from 'expo';

import {
  CallDetectorModuleEvents,
  CallDirectoryStatus,
} from './CallDetector.types';

// Web has no telephony — this is an inert stub so the bundle resolves.
class CallDetectorModule extends NativeModule<CallDetectorModuleEvents> {
  isCallActive(): boolean {
    return false;
  }
  async syncCallDirectory(): Promise<void> {
    // no-op
  }
  async getCallDirectoryStatus(): Promise<CallDirectoryStatus> {
    return 'unknown';
  }
}

export default registerWebModule(CallDetectorModule, 'CallDetectorModule');
