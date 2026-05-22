import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ShieldBanner } from '@/components/ShieldBanner';
import { Button } from '@/components/ui/Button';
import { CallState } from '@/domain/verification';
import { colors } from '@/lib/colors';
import { formatEuro } from '@/lib/format';
import { useCallDetection } from '@/providers/CallDetectionProvider';

const AVAILABLE_BALANCE = 3247.65;

function Field({
  label,
  ...props
}: { label: string } & TextInputProps) {
  return (
    <View className="mb-4">
      <Text className="mb-2 font-sans-medium text-sm text-foreground">
        {label}
      </Text>
      <TextInput
        className="rounded-lg border border-border bg-surface px-4 py-3 text-base text-foreground"
        placeholderTextColor={colors.mutedLight}
        {...props}
      />
    </View>
  );
}

export default function TransferScreen() {
  const insets = useSafeAreaInsets();
  const { isCallActive, callContext } = useCallDetection();

  const [recipient, setRecipient] = useState('');
  const [iban, setIban] = useState('');
  const [amount, setAmount] = useState('');

  const canSubmit =
    recipient.trim().length > 0 &&
    iban.trim().length > 0 &&
    amount.trim().length > 0;

  const completeTransfer = () => {
    Alert.alert(
      'Η μεταφορά καταχωρήθηκε',
      `€${formatEuro(Number(amount.replace(',', '.')) || 0)} προς ${recipient.trim()}.`,
      [{ text: 'Εντάξει', onPress: () => router.back() }],
    );
  };

  const handleSubmit = () => {
    if (isCallActive && callContext.state === CallState.SCAM) {
      Alert.alert(
        '⚠ Προσοχή — Είστε σε ύποπτη κλήση',
        'Μην πραγματοποιείτε μεταφορές ενώ βρίσκεστε σε κλήση. Η Epirus Bank δεν σας ζητά ποτέ να μεταφέρετε χρήματα τηλεφωνικά.',
        [
          { text: 'Ακύρωση', style: 'cancel' },
          {
            text: 'Συνέχεια ούτως ή άλλως',
            style: 'destructive',
            onPress: completeTransfer,
          },
        ],
      );
      return;
    }
    completeTransfer();
  };

  return (
    <View className="flex-1 bg-[#eceef3]">
      <StatusBar style="light" />
      <ShieldBanner />

      <View
        className="bg-primary px-6 pb-6"
        style={{ paddingTop: (isCallActive ? 0 : insets.top) + 16 }}>
        <View className="flex-row items-center gap-3">
          <Pressable
            accessibilityLabel="Πίσω"
            accessibilityRole="button"
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
          </Pressable>
          <Text className="font-sans-bold text-xl text-primary-foreground">
            Μεταφορά
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 24 }}
          keyboardShouldPersistTaps="handled">
          <View
            className="mb-6 rounded-2xl bg-surface p-4"
            style={{
              shadowColor: '#243B72',
              shadowOpacity: 0.08,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
              elevation: 2,
            }}>
            <Text className="text-sm text-muted">Διαθέσιμο υπόλοιπο</Text>
            <Text className="font-sans-bold text-2xl text-foreground">
              {formatEuro(AVAILABLE_BALANCE)}€
            </Text>
          </View>

          <Field
            label="Όνομα παραλήπτη"
            placeholder="π.χ. Γιώργος Παπαδόπουλος"
            value={recipient}
            onChangeText={setRecipient}
            autoCapitalize="words"
          />
          <Field
            label="IBAN"
            placeholder="GR00 0000 0000 0000 0000 0000 000"
            value={iban}
            onChangeText={setIban}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <Field
            label="Ποσό (€)"
            placeholder="0,00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <Button
            label="Επιβεβαίωση μεταφοράς"
            size="lg"
            className="mt-2 w-full"
            disabled={!canSubmit}
            onPress={handleSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
