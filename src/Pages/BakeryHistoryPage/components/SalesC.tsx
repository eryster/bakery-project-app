import { DynamicListItem, GenericList } from "~/components";
import { Formatter } from "~/utils/Formatter";
import { ListRenderItem } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useHistoryProvider } from "~/contexts/HistoryProvider";
import { Sales } from "~/types";
import { useEffect } from "react";

type RootStackParamList = {
    Sales: undefined;
    Items: undefined;
};

type SalesProps = StackScreenProps<RootStackParamList, 'Sales'>

export function SalesC({ navigation }: SalesProps) {
    const { day, setCurrentSales, deleteSales } = useHistoryProvider();

    useEffect(() => {
        if (!day) {
            
            navigation.goBack(); 
        }
    }, [day, navigation]);

    if (!day) {
        return;
    }

    const goToItems = () => {
        navigation.navigate('Items');
    };

    const selectSale = (id: string) => {
        setCurrentSales(id);
        goToItems();
    };

    const renderSaleItem: ListRenderItem<Sales> = ({ item }) => {
        const stats = [
            { label: "Items vendidos", value: item.itemsSelledCount },
            { label: "Valor total", value: Formatter.currency(item.totalPrice) },
            { label: "Lucro", value: Formatter.currency(item.profit) },
        ];
        return (
            <DynamicListItem
                mainText={`#${item.count}`}
                stats={stats}
                onPress={() => selectSale(item.id)}
                onDelete={() => deleteSales(item.id, item.items)}
            />
        );
    };

    return (
        <GenericList
            title={`Vendas do dia ${day.day}`}
            data={day.sales}
            renderItem={renderSaleItem}
            onBackPress={() => navigation.goBack()}
        />
    );
}