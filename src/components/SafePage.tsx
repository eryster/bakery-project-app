import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet, View } from 'react-native';
import { Colors } from '~/styles';
import { ReactNode } from 'react';

type SafePageProps = {
  element: ReactNode;
};

export function SafePage({ element }: SafePageProps) {
  return (
    <View style={styles.statusBarBackground}>
      <StatusBar
        animated={true}
        backgroundColor={Colors.primary}
        barStyle="dark-content"
      />
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeAreaContainer}>
          {element}
        </SafeAreaView>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBarBackground: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});