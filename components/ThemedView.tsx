import { View, type ViewProps } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function ThemedView({ style, ...otherProps }: ViewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const backgroundColor = Colors[colorScheme].background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
