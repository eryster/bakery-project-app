import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts } from '~/styles';

export function EmptyListMessage({ message = "Histórico vazio" }: { message?: string }) {
  return (
    <View style={emptyStyles.container}>
      <MaterialCommunityIcons name="history" size={60} color={Colors.textLight} />
      <Text style={emptyStyles.text}>{message}</Text>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.large,
  },
  text: {
    marginTop: Spacing.small,
    fontSize: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
  },
});