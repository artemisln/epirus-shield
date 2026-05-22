import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ShieldBanner } from '@/components/ShieldBanner';
import { CallState } from '@/domain/verification';
import { colors } from '@/lib/colors';
import { formatEuro } from '@/lib/format';
import { useCallDetection } from '@/providers/CallDetectionProvider';

const SOURCE_ACCOUNT = { name: 'Βασικός λογαριασμός', balance: 10319.54 };

const METHODS = [
  {
    id: 'clipboard',
    icon: 'copy-outline' as const,
    title: 'Επικόλληση από clipboard',
    sub: '3330001234567-8',
  },
  {
    id: 'own',
    icon: 'person-outline' as const,
    title: 'Λογαριασμό μου',
    sub: 'Επιλέξτε από τους άλλους λογαριασμούς σας',
  },
  {
    id: 'iban',
    icon: 'wallet-outline' as const,
    title: 'Λογαριασμό εντός τράπεζας',
    sub: 'Με χρήση IBAN ή αρ. λογαριασμού',
  },
];

const PAYEES = [
  {
    id: 'p1',
    name: 'Βασιλική Παπαδοπούλου',
    account: '1112223334567-1',
    initial: 'Β',
  },
  {
    id: 'p2',
    name: 'Γιώργος',
    account: 'GR8701047397532547665461759',
    initial: 'Γ',
  },
];

function Row({
  leading,
  title,
  subtitle,
  onPress,
}: {
  leading: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-center py-3 active:opacity-60">
      {leading}
      <View className="ml-3 flex-1">
        <Text className="font-sans-medium text-base text-foreground">
          {title}
        </Text>
        <Text className="text-sm text-muted">{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.mutedLight} />
    </Pressable>
  );
}

export default function TransferScreen() {
  const insets = useSafeAreaInsets();
  const { isCallActive, callContext } = useCallDetection();

  const handleSelect = (label: string) => {
    if (isCallActive && callContext.state === CallState.SCAM) {
      Alert.alert(
        '⚠ Προσοχή — Είστε σε ύποπτη κλήση',
        'Μην πραγματοποιείτε μεταφορές ενώ βρίσκεστε σε κλήση. Η Epirus Bank δεν σας ζητά ποτέ να μεταφέρετε χρήματα τηλεφωνικά.',
        [{ text: 'Εντάξει' }],
      );
      return;
    }
    Alert.alert('Μεταφορά χρημάτων', `Demo: θα συνεχίζατε με «${label}».`);
  };

  return (
    <View className="flex-1 bg-[#eceef3]">
      <StatusBar style="light" />
      <ShieldBanner />

      {/* Navy header */}
      <View
        className="bg-primary px-3 pb-4"
        style={{ paddingTop: (isCallActive ? 0 : insets.top) + 12 }}>
        <View className="flex-row items-center">
          <Pressable
            accessibilityLabel="Πίσω"
            accessibilityRole="button"
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center">
            <Ionicons name="chevron-back" size={26} color="#ffffff" />
          </Pressable>
          <Text className="flex-1 text-center font-sans-bold text-xl text-primary-foreground">
            Μεταφορά χρημάτων
          </Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 24,
        }}>
        {/* Source account */}
        <Text className="mb-2 font-sans-medium text-base text-foreground">
          Από το λογαριασμό
        </Text>
        <Pressable
          accessibilityRole="button"
          className="flex-row items-center rounded-[14px] bg-surface p-4 active:opacity-90"
          style={{
            shadowColor: '#243B72',
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 2,
          }}>
          <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Ionicons name="wallet" size={18} color="#ffffff" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-sans-semibold text-base text-primary">
              {SOURCE_ACCOUNT.name}
            </Text>
            <Text className="text-sm text-foreground">
              {formatEuro(SOURCE_ACCOUNT.balance)}€
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color={colors.muted} />
        </Pressable>

        {/* Destination */}
        <Text className="mb-1 mt-7 font-sans-medium text-base text-foreground">
          Προς…
        </Text>

        {METHODS.map((method) => (
          <Row
            key={method.id}
            title={method.title}
            subtitle={method.sub}
            onPress={() => handleSelect(method.title)}
            leading={
              <View className="h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Ionicons name={method.icon} size={20} color="#ffffff" />
              </View>
            }
          />
        ))}

        <View className="my-2 ml-16 h-px bg-border" />

        {PAYEES.map((payee) => (
          <Row
            key={payee.id}
            title={payee.name}
            subtitle={payee.account}
            onPress={() => handleSelect(payee.name)}
            leading={
              <View
                className="h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: '#dfe3ef' }}>
                <Text className="font-sans-bold text-lg text-primary">
                  {payee.initial}
                </Text>
              </View>
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
