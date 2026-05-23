import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getSeedVerifiedNumbers } from '@/domain/data';
import { ScamReport } from '@/domain/verification';
import { colors } from '@/lib/colors';
import { getScamReports } from '@/lib/reports';
import { useCallDetection } from '@/providers/CallDetectionProvider';

function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="mb-2 mt-6 font-sans-semibold text-sm uppercase text-muted">
      {children}
    </Text>
  );
}

function timeLabel(date: Date): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mo} ${hh}:${mm}`;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { simulateVerified, simulateScam, clearCall } = useCallDetection();
  const verifiedNumbers = useMemo(() => getSeedVerifiedNumbers(), []);
  const [reports, setReports] = useState<ScamReport[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getScamReports().then((loaded) => {
        if (active) {
          setReports(loaded);
        }
      });
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <View className="flex-1 bg-[#eceef3]">
      <StatusBar style="dark" />

      <View
        className="flex-row items-center gap-3 border-b border-border bg-background px-6 pb-4"
        style={{ paddingTop: insets.top + 12 }}>
        <Pressable
          accessibilityLabel="Πίσω"
          accessibilityRole="button"
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-surface-elevated">
          <Ionicons name="arrow-back" size={20} color={colors.foreground} />
        </Pressable>
        <Text className="font-sans-bold text-xl text-foreground">
          Epirus Shield
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 24,
          paddingBottom: insets.bottom + 32,
        }}>
        <SectionTitle>Demo κλήσης</SectionTitle>
        <Card className="gap-3 p-4">
          <Text className="text-sm text-muted">
            Προσομοίωση κατάστασης κλήσης για επίδειξη.
          </Text>
          <Button
            label="Επαληθευμένη κλήση Epirus"
            onPress={() => {
              simulateVerified();
              router.push('/');
            }}
          />
          <Button
            label="Ύποπτη κλήση (απάτη)"
            variant="secondary"
            onPress={() => simulateScam('+306971234567')}
          />
          <Button
            label="Τερματισμός κλήσης"
            variant="outline"
            onPress={() => clearCall()}
          />
        </Card>

        <SectionTitle>Επαληθευμένοι αριθμοί Epirus Bank</SectionTitle>
        <Card>
          {verifiedNumbers.map((number, index) => (
            <View
              key={number.id}
              className={`p-4 ${index > 0 ? 'border-t border-border' : ''}`}>
              <Text className="font-sans-semibold text-base text-foreground">
                {number.phone}
              </Text>
              <Text className="text-sm text-muted">
                {number.department}
                {number.label ? ` — ${number.label}` : ''}
              </Text>
            </View>
          ))}
        </Card>

        <SectionTitle>Αναφορές απάτης</SectionTitle>
        <Card>
          {reports.length === 0 ? (
            <View className="p-4">
              <Text className="text-sm text-muted">
                Δεν υπάρχουν αναφορές ακόμη.
              </Text>
            </View>
          ) : (
            reports.map((report, index) => (
              <View
                key={report.id}
                className={`flex-row items-center justify-between p-4 ${
                  index > 0 ? 'border-t border-border' : ''
                }`}>
                <View className="flex-row items-center gap-3">
                  <Ionicons name="warning" size={18} color={colors.secondary} />
                  <Text className="font-sans-medium text-sm text-foreground">
                    {report.reportedNumber}
                  </Text>
                </View>
                <Text className="text-xs text-muted">
                  {timeLabel(report.reportedAt)}
                </Text>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </View>
  );
}
