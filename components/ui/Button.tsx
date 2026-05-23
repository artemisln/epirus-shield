import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { colors } from '@/lib/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  /** Optional element rendered before the label (e.g. an icon). */
  icon?: React.ReactNode;
  /** Extra classes for the container, e.g. layout (`flex-1`, `w-full`). */
  className?: string;
}

const variantContainer: Record<ButtonVariant, string> = {
  primary: 'bg-primary active:opacity-90',
  secondary: 'bg-secondary active:opacity-90',
  outline: 'bg-transparent border border-border active:bg-surface-elevated',
  ghost: 'bg-transparent active:bg-surface-elevated',
};

const variantText: Record<ButtonVariant, string> = {
  primary: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  outline: 'text-primary',
  ghost: 'text-primary',
};

const sizeContainer: Record<ButtonSize, string> = {
  sm: 'px-4 py-2',
  md: 'px-5 py-3',
  lg: 'px-6 py-4',
};

const sizeText: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-base',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className = '',
}: ButtonProps) {
  const isInactive = disabled || loading;
  const spinnerColor =
    variant === 'primary' || variant === 'secondary'
      ? colors.primaryForeground
      : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isInactive}
      onPress={onPress}
      className={`flex-row items-center justify-center rounded-full ${variantContainer[variant]} ${sizeContainer[size]} ${isInactive ? 'opacity-50' : ''} ${className}`}>
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <>
          {icon ? <View className="mr-2">{icon}</View> : null}
          <Text
            className={`font-sans-semibold ${sizeText[size]} ${variantText[variant]}`}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
