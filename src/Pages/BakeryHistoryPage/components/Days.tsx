import { Day } from "~/types";
import { Formatter } from "~/utils/Formatter";
import { ListRenderItem } from "react-native";
import { DynamicListItem, GenericList } from "~/components";
import { StackScreenProps } from "@react-navigation/stack";
import { useHistoryProvider } from "~/contexts/HistoryProvider";
import { useEffect } from "react";

type RootStackParamList = {
    Days: undefined;
    Sales: undefined;
};

type DaysProps = StackScreenProps<RootStackParamList, 'Days'>

export function Days({ navigation }: DaysProps) {
    const { month, setCurrentDay } = useHistoryProvider();

    useEffect(() => {
        if (!month) {
            navigation.goBack(); 
        }
    }, [month, navigation]);

    if (!month) {
        return;
    }

    const goToSales = () => {
        navigation.navigate('Sales');
    }

    const selectDay = (day: number) => {
        setCurrentDay(day);
        goToSales();
    }
    
    const renderDayItem: ListRenderItem<Day> = ({ item }) => {
        const stats = [
            { label: "Items vendidos", value: item.itemsSelledCount },
            { label: "Valor total", value: Formatter.currency(item.totalPrice) },
            { label: "Lucro", value: Formatter.currency(item.profit) },
        ];
        return (
            <DynamicListItem
                mainText={`Dia: ${item.day}`}
                stats={stats}
                onPress={() => selectDay(item.day)}
            />
        );
    };

    return (
        <GenericList
            title={`Dias do mês de ${Formatter.getMonthName(month.month)}`}
            data={month.days}
            renderItem={renderDayItem}
            onBackPress={() => navigation.goBack()}
        />
    );
}