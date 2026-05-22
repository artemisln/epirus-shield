import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { WarningOverlay } from '@/components/WarningOverlay';
import { useCallDetection } from '@/providers/CallDetectionProvider';

export default function WarningScreen() {
  const { callContext, clearCall } = useCallDetection();

  const handleDismiss = () => {
    clearCall();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <WarningOverlay
        callerNumber={callContext.callerNumber}
        onDismiss={handleDismiss}
      />
    </>
  );
}
