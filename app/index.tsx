import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EpirusLogo } from '@/components/EpirusLogo';
import { HeaderWaves } from '@/components/HeaderWaves';
import { ShieldBanner } from '@/components/ShieldBanner';
import { colors } from '@/lib/colors';
import { formatEuro } from '@/lib/format';
import { useCallDetection } from '@/providers/CallDetectionProvider';

const TOTAL_BALANCE = 12224.65;

const ACCOUNTS = [
  { id: 'a1', name: 'Basic account', number: '123/123456-78', balance: 10319.54 },
  { id: 'a2', name: 'Family account', number: '987/123456-54', balance: 256.23 },
  {
    id: 'a3',
    name: 'Λογ. Ταμιευτηρίου',
    number: '456/789012-30',
    balance: 1648.88,
  },
];

const TRANSACTIONS = [
  {
    id: 't1',
    day: '22',
    month: 'ΜΑΪ',
    title: 'Μεταφορά σε λογαριασμό μου',
    sub: 'Additional information',
    amount: -15.3,
    time: '15:20',
  },
  {
    id: 't2',
    day: '22',
    month: 'ΜΑΪ',
    title: 'Έμβασμα σε άλλη τράπεζα',
    sub: 'Μεταφορά από Mobile Banking',
    amount: -12.1,
    time: '08:55',
  },
  {
    id: 't3',
    day: '20',
    month: 'ΜΑΪ',
    title: 'Μισθοδοσία',
    sub: 'Πίστωση μισθού',
    amount: 1850.0,
    time: '09:00',
  },
  {
    id: 't4',
    day: '18',
    month: 'ΜΑΪ',
    title: 'ΔΕΗ',
    sub: 'Πληρωμή λογαριασμού',
    amount: -78.2,
    time: '12:30',
  },
  {
    id: 't5',
    day: '15',
    month: 'ΜΑΪ',
    title: 'COSMOTE',
    sub: 'Πληρωμή λογαριασμού',
    amount: -32.5,
    time: '18:45',
  },
];

function AccountCard({
  name,
  number,
  balance,
}: {
  name: string;
  number: string;
  balance: number;
}) {
  return (
    <View
      className="mr-3 w-60 rounded-2xl bg-surface p-4"
      style={{
        shadowColor: '#243B72',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}>
      <Text className="font-sans-semibold text-base text-primary">{name}</Text>
      <Text className="mb-3 text-xs text-muted">{number}</Text>
      <Text className="font-sans-bold text-xl text-foreground">
        {formatEuro(balance)}€
      </Text>
    </View>
  );
}

function ActionRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-2xl bg-surface p-4 active:opacity-90"
      style={{
        shadowColor: '#243B72',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      }}>
      <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
        <Ionicons name={icon} size={20} color="#ffffff" />
      </View>
      <View className="ml-3 flex-1">
        <Text className="font-sans-semibold text-base text-primary">
          {title}
        </Text>
        <Text className="text-sm text-muted">{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.mutedLight} />
    </Pressable>
  );
}

function TransactionRow({
  day,
  month,
  title,
  sub,
  amount,
  time,
  first,
}: {
  day: string;
  month: string;
  title: string;
  sub: string;
  amount: number;
  time: string;
  first: boolean;
}) {
  const incoming = amount > 0;
  return (
    <View
      className={`flex-row items-center px-4 py-3.5 ${
        first ? '' : 'border-t border-border'
      }`}>
      <View className="w-9 items-center">
        <Text className="font-sans-bold text-base text-foreground">{day}</Text>
        <Text className="text-[10px] uppercase text-muted">{month}</Text>
      </View>
      <View className="ml-3 flex-1">
        <Text className="font-sans-medium text-sm text-foreground">{title}</Text>
        <Text className="text-xs text-muted">{sub}</Text>
      </View>
      <View className="items-end">
        <Text
          className={`font-sans-bold text-sm ${
            incoming ? 'text-success' : 'text-error'
          }`}>
          {incoming ? '+' : '−'}
          {formatEuro(amount)}€
        </Text>
        <Text className="text-[11px] text-muted">{time}</Text>
      </View>
    </View>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  badge,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  badge?: number;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="flex-1 items-center py-1">
      <View>
        <Ionicons
          name={icon}
          size={24}
          color={active ? colors.primary : colors.muted}
        />
        {badge ? (
          <View className="absolute -right-2 -top-1 h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1">
            <Text className="font-sans-bold text-[10px] text-secondary-foreground">
              {badge}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { isCallActive } = useCallDetection();
  const [whole, cents] = formatEuro(TOTAL_BALANCE).split(',');

  return (
    <View className="flex-1 bg-[#eceef3]">
      <StatusBar style="light" />
      <ShieldBanner />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Navy wave header */}
        <View
          className="overflow-hidden pb-12"
          style={{ paddingTop: (isCallActive ? 0 : insets.top) + 14 }}>
          <HeaderWaves />
          <View className="px-5">
            <View className="mb-5 flex-row items-center justify-between">
              <EpirusLogo width={100} variant="white" />
              <Pressable
                accessibilityLabel="Ανανέωση"
                accessibilityRole="button"
                className="h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <Ionicons name="refresh" size={18} color="#ffffff" />
              </Pressable>
            </View>
            <View className="flex-row items-end">
              <Text className="font-sans-bold text-5xl text-primary-foreground">
                {whole}
              </Text>
              <Text className="mb-1.5 font-sans-bold text-2xl text-primary-foreground">
                ,{cents}€
              </Text>
            </View>
            <Text className="mt-1 text-sm text-primary-foreground/75">
              Συνολικό διαθέσιμο υπόλοιπο
            </Text>
          </View>
        </View>

        {/* Accounts */}
        <View className="-mt-6">
          <Text className="mb-3 px-5 font-sans-bold text-lg text-foreground">
            Λογαριασμοί ({ACCOUNTS.length})
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}>
            {ACCOUNTS.map((account) => (
              <AccountCard key={account.id} {...account} />
            ))}
          </ScrollView>
        </View>

        {/* Actions */}
        <View className="mt-6 px-5">
          <ActionRow
            icon="swap-horizontal"
            title="Μεταφορά χρημάτων"
            subtitle="Σε λογαριασμό της τράπεζας"
            onPress={() => router.push('/transfer')}
          />
          <ActionRow
            icon="receipt-outline"
            title="Πληρωμές"
            subtitle="Ρεύματος, νερού, ίντερνετ κλπ…"
          />
        </View>

        {/* Transactions */}
        <View className="mt-4 px-5">
          <Text className="mb-3 font-sans-bold text-lg text-foreground">
            Πρόσφατες συναλλαγές
          </Text>
          <View
            className="rounded-2xl bg-surface"
            style={{
              shadowColor: '#243B72',
              shadowOpacity: 0.08,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
              elevation: 2,
            }}>
            {TRANSACTIONS.map((tx, index) => (
              <TransactionRow key={tx.id} {...tx} first={index === 0} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom navigation */}
      <View
        className="flex-row border-t border-border bg-background px-2 pt-2"
        style={{ paddingBottom: insets.bottom + 6 }}>
        <NavItem icon="home" label="Αρχική" active />
        <NavItem
          icon="swap-horizontal"
          label="Μεταφορές"
          onPress={() => router.push('/transfer')}
        />
        <NavItem
          icon="notifications-outline"
          label="Ειδοποιήσεις"
          badge={4}
          onPress={() => router.push('/settings')}
        />
        <NavItem
          icon="person-outline"
          label="Προφίλ"
          onPress={() => router.push('/settings')}
        />
      </View>
    </View>
  );
}
