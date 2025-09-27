import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Years, Months, Days, SalesC, Items } from './components';
import { SafePage } from "~/components";

type HistoryStackParamList = {
    Years: undefined;
    Months: undefined;
    Days: undefined;
    Sales: undefined;
    Items: undefined;
};

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export function BakeryHistoryPage() {

    const nav = (
        <Stack.Navigator
            initialRouteName="Years"
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen name="Years" component={Years} />
            <Stack.Screen name="Months" component={Months} />
            <Stack.Screen name="Days" component={Days} />
            <Stack.Screen name="Sales" component={SalesC} />
            <Stack.Screen name="Items" component={Items} />
        </Stack.Navigator>
    );
    
    return <SafePage element={nav} />;
}