import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SellPage, ShoppingCart } from "./components";
import { CartProvider } from "~/contexts/CartProvider";
import { SafePage } from "~/components";

type RootStackParamList = {
    SellPage: undefined;
    ShoppingCart: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function BakerySellsPage() {

  const nav = (
    <CartProvider>
      <Stack.Navigator
          initialRouteName="SellPage"
          screenOptions={{
              headerShown: false,
              animation: 'slide_from_right'
          }}
      >
        <Stack.Screen name="ShoppingCart" component={ShoppingCart} options={{animation: 'fade_from_bottom'}} />
        <Stack.Screen name="SellPage" component={SellPage} />
      </Stack.Navigator>
    </CartProvider>
  )
  
  return <SafePage element={nav} />;
}