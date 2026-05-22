import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EpirusLogo } from '@/components/EpirusLogo';
import { addScamReport } from '@/lib/reports';

interface WarningOverlayProps {
  /** The number of the incoming call, if known. */
  callerNumber?: string;
  /** Dismiss the warning (close the screen / return to idle). */
  onDismiss: () => void;
}

const SAFETY_TIPS = [
  'Η τράπεζα δεν ζητά ποτέ κωδικούς τηλεφωνικά',
  'Μην κάνετε μεταφορές κατά τη διάρκεια κλήσης',
  'Σε αμφιβολία, κλείστε και καλέστε εσείς την τράπεζα',
];

/**
 * Full-screen scam warning. Shown when a call is detected — the core message
 * is that Epirus Bank never phones customers. Ported from the web ScamActionSheet.
 */
export function WarningOverlay({ callerNumber, onDismiss }: WarningOverlayProps) {
  const [isReporting, setIsReporting] = useState(false);
  const [reported, setReported] = useState(false);

  const handleReport = async () => {
    setIsReporting(true);
    try {
      await addScamReport(callerNumber ?? 'Άγνωστος');
      setReported(true);
    } catch {
      Alert.alert('Σφάλμα', 'Η αναφορά δεν καταχωρήθηκε. Δοκιμάστε ξανά.');
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <View className="flex-1 bg-secondary">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6">
          <View className="grow py-6">
            <View className="items-center">
              <EpirusLogo width={108} variant="white" />
            </View>

            <View className="grow items-center justify-center py-8">
              <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-white/15">
                <Ionicons name="warning" size={52} color="#ffffff" />
              </View>

              <Text className="text-center font-sans-bold text-4xl text-secondary-foreground">
                ΠΡΟΣΟΧΗ
              </Text>
              <Text className="mt-2 text-center font-sans-bold text-lg text-secondary-foreground">
                Η Epirus Bank ΔΕΝ σας καλεί ποτέ
              </Text>
              <Text className="mt-3 text-center text-base text-secondary-foreground/85">
                Αυτή η κλήση δεν προέρχεται από την τράπεζα. Μην δώσετε κωδικούς ή
                προσωπικά στοιχεία και μην κάνετε μεταφορές.
              </Text>
              {callerNumber ? (
                <Text className="mt-3 font-sans-semibold text-sm text-secondary-foreground/70">
                  Αριθμός κλήσης: {callerNumber}
                </Text>
              ) : null}
            </View>

            <View className="rounded-2xl bg-white/10 p-4">
              <Text className="mb-2 font-sans-semibold text-sm text-secondary-foreground">
                Συμβουλές Ασφαλείας
              </Text>
              {SAFETY_TIPS.map((tip) => (
                <View key={tip} className="mb-1 flex-row gap-2">
                  <Text className="text-sm text-secondary-foreground/85">•</Text>
                  <Text className="flex-1 text-sm text-secondary-foreground/85">
                    {tip}
                  </Text>
                </View>
              ))}
            </View>

            <View className="mt-6 gap-3">
              {reported ? (
                <View className="items-center rounded-full bg-white/20 py-4">
                  <Text className="font-sans-bold text-base text-secondary-foreground">
                    ✓ Η αναφορά καταχωρήθηκε
                  </Text>
                </View>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  disabled={isReporting}
                  onPress={handleReport}
                  className={`items-center rounded-full bg-white py-4 active:opacity-90 ${
                    isReporting ? 'opacity-60' : ''
                  }`}>
                  <Text className="font-sans-bold text-base text-secondary">
                    {isReporting ? 'Αναφορά…' : 'Αναφέρετε την κλήση'}
                  </Text>
                </Pressable>
              )}

              <Pressable
                accessibilityRole="button"
                onPress={onDismiss}
                className="items-center rounded-full border border-white/40 py-4 active:opacity-90">
                <Text className="font-sans-semibold text-base text-secondary-foreground">
                  Κλείστε αμέσως το τηλέφωνο
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
