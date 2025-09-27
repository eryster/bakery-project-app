import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Categories, ItemForm, Products } from './components';
import { FormAttribute } from '~/types';
import { ItemTypeSave } from '~/types/ItemTypeSave';
import { SafePage } from '~/components';

type RootStackParamList = {
    Categories: undefined;
    Products: { categoryId: number };
    ItemForm: {
        title: string;
        attributes: FormAttribute[];
        itemSave: ItemTypeSave
    };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function BakeryAddProductsPage() {

    const nav = (
        <Stack.Navigator
            initialRouteName="Categories"
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen name="ItemForm" component={ItemForm} options={{animation: 'fade_from_bottom'}}/>
            <Stack.Screen name="Categories" component={Categories} />
            <Stack.Screen name="Products" component={Products} />
        </Stack.Navigator>
    )

    return <SafePage element={nav}/>;
}