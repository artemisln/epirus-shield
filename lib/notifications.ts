import * as Notifications from 'expo-notifications';

// Show scam-warning notifications even while the app is foregrounded.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/** Requests local-notification permission. Returns whether it was granted. */
export async function requestNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return true;
  }
  const result = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: false, allowSound: true },
  });
  return result.granted;
}

/** Fires an immediate local notification warning of a possible scam call. */
export async function notifyScamCall(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'ΠΡΟΣΟΧΗ — Πιθανή απάτη',
      body: 'Η Epirus Bank ΔΕΝ σας καλεί ποτέ. Αυτή η κλήση μπορεί να είναι απάτη.',
    },
    trigger: null,
  });
}
