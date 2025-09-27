import { Month } from "~/types";
import { Formatter } from "~/utils/Formatter";
import { ListRenderItem } from "react-native";
import { DynamicListItem, GenericList } from "~/components";
import { StackScreenProps } from "@react-navigation/stack";
import { useHistoryProvider } from "~/contexts/HistoryProvider";
import { useEffect } from "react";

type RootStackParamList = {
    Months: undefined;
    Days: undefined;
};

type MonthsProps = StackScreenProps<RootStackParamList, 'Months'>

export function Months({ navigation } : MonthsProps ) {
    const { year, setCurrentMonth } = useHistoryProvider();

    useEffect(() => {
        if (!year) {
            navigation.goBack(); 
        }
    }, [year, navigation]);

    if (!year) {
        return null; 
    }

    const goToMonths = () => {
        navigation.navigate('Days');
    }

    const selectMonth = (month: number) => {
        setCurrentMonth(month);
        goToMonths();
    }
      
    const renderMonthItem: ListRenderItem<Month> = ({ item }) => {
        const stats = [
            { label: "Items vendidos", value: item.itemsSelledCount },
            { label: "Valor total", value: Formatter.currency(item.totalPrice) },
            { label: "Lucro", value: Formatter.currency(item.profit) },
        ];
        return (
            <DynamicListItem
                mainText={Formatter.getMonthName(item.month)}
                stats={stats}
                onPress={() => selectMonth(item.month)}
            />
        );
    };

    return (
        <GenericList
            title={`Meses do ano ${year.year}`}
            data={year.months}
            renderItem={renderMonthItem}
            onBackPress={() => navigation.goBack()}
        />
    );
}