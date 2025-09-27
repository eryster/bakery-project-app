import { DynamicListItem, GenericList } from "~/components";
import { ItemSale } from "~/types";
import { Formatter } from "~/utils/Formatter";
import { ListRenderItem } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useHistoryProvider } from "~/contexts/HistoryProvider";
import { useEffect } from "react";

type RootStackParamList = {
    Items: undefined;
};

type ItemsProps = StackScreenProps<RootStackParamList, 'Items'>

export function Items({ navigation }: ItemsProps) {
    const { sales, deleteItem } = useHistoryProvider();

    useEffect(() => {
        if (!sales) {
            navigation.goBack(); 
        }
    }, [sales, navigation]);

    if (!sales) {
        return;
    }

    const renderItemSale: ListRenderItem<ItemSale> = ({ item }) => {
        const stats = [
            { label: "Quantidade", value: item.qty },
            { label: "Valor total", value: Formatter.currency(item.totalPrice) },
            { label: "Lucro", value: Formatter.currency(item.profit) },
        ];
        return (
            <DynamicListItem
                mainText={item.name}
                stats={stats}
                onPress={() => {}}
                onDelete={() => deleteItem(item)}
            />
        );
    };

    return (
        <GenericList
            title={`Itens da #${sales.count} Venda`}
            data={sales.items}
            renderItem={renderItemSale}
            onBackPress={() => navigation.goBack()}
        />
    );
}