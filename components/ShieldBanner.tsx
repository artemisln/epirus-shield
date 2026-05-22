import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCallDetection } from '@/providers/CallDetectionProvider';
import { CallState } from '@/domain/verification';

/**
 * Always-visible top banner. Renders nothing while idle; a navy bar for a
 * verified Epirus Bank call; a tappable red bar for a suspected scam call.
 * Ported from the web ShieldOverlay.
 */
export function ShieldBanner() {
  const { callContext } = useCallDetection();
  const insets = useSafeAreaInsets();

  if (callContext.state === CallState.IDLE) {
    return null;
  }

  const isVerified = callContext.state === CallState.VERIFIED;

  return (
    <Pressable
      accessibilityRole={isVerified ? undefined : 'button'}
      onPress={() => {
        if (!isVerified) {
          router.push('/warning');
        }
      }}
      style={{ paddingTop: insets.top }}
      className={isVerified ? 'bg-primary' : 'bg-secondary'}>
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Ionicons
          name={isVerified ? 'shield-checkmark' : 'warning'}
          size={24}
          color="#ffffff"
        />
        <View className="flex-1">
          {isVerified ? (
            <>
              <Text className="font-sans-bold text-sm text-primary-foreground">
                ✓ Μιλάτε με την Epirus Bank
              </Text>
              {callContext.department ? (
                <Text className="text-xs text-primary-foreground/80">
                  {callContext.department}
                  {callContext.label ? ` — ${callContext.label}` : ''}
                </Text>
              ) : null}
            </>
          ) : (
            <>
              <Text className="font-sans-bold text-sm text-secondary-foreground">
                ⚠ ΔΕΝ μιλάμε μαζί σας αυτή τη στιγμή
              </Text>
              <Text className="text-xs text-secondary-foreground/80">
                Πατήστε για περισσότερες πληροφορίες
              </Text>
            </>
          )}
        </View>
        {isVerified ? null : (
          <Ionicons name="chevron-forward" size={20} color="#ffffff" />
        )}
      </View>
    </Pressable>
  );
}
