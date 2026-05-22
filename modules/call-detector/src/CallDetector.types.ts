/** Raw call state reported by the native CXCallObserver. */
export type NativeCallState = 'active' | 'idle';

export type CallStateChangeEvent = {
  state: NativeCallState;
};

export type CallDetectorModuleEvents = {
  onCallStateChange(event: CallStateChangeEvent): void;
};

/** One phone-number entry for the Call Directory extension. */
export type CallDirectoryEntry = {
  /** E.164 number without the leading '+', e.g. 302101234567. */
  number: number;
  /** Label shown on the incoming-call screen. */
  label: string;
};

/** Whether the user has enabled the Call Directory extension in iOS Settings. */
export type CallDirectoryStatus = 'enabled' | 'disabled' | 'unknown';
