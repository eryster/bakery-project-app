import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BakeryAddProductsPage, BakeryHistoryPage, BakerySellsPage } from '~/Pages';
import { Colors } from '~/styles';

const Tab = createBottomTabNavigator();

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const iconMap: Record<string, { focused: IoniconsName; unfocused: IoniconsName }> = {
  Vender: { focused: 'cart', unfocused: 'cart-outline' },
  Produtos: { focused: 'cube', unfocused: 'cube-outline' },
  Histórico: { focused: 'calendar', unfocused: 'calendar-outline' }
};

export function Navigator() {
    return (
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                const iconData = iconMap[route.name as keyof typeof iconMap];

                if (iconData) {
                  const iconName = focused ? iconData.focused : iconData.unfocused;
                  return <Ionicons name={iconName} size={size} color={color} />;
                }
                
                return null;
              },
              tabBarActiveTintColor: Colors.primary, 
              tabBarInactiveTintColor: Colors.textLight, 
            })}
          >
            <Tab.Screen name="Vender" component={BakerySellsPage} options={{ headerShown: false }} />
            <Tab.Screen name="Produtos" component={BakeryAddProductsPage} options={{ headerShown: false }} />
            <Tab.Screen name="Histórico" component={BakeryHistoryPage} options={{ headerShown: false }} />
          </Tab.Navigator>
        </NavigationContainer>
    )
}