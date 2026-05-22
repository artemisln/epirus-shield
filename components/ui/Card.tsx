import { View, type ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated';
}

export function Card({
  variant = 'default',
  className = '',
  style,
  children,
  ...rest
}: CardProps) {
  const elevatedStyle =
    variant === 'elevated'
      ? {
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
        }
      : undefined;

  return (
    <View
      className={`rounded-2xl border border-border bg-surface ${className}`}
      style={[elevatedStyle, style]}
      {...rest}>
      {children}
    </View>
  );
}
