import { StackScreenProps } from "@react-navigation/stack";
import { DynamicListItem, GenericList } from "~/components";
import { useHistoryProvider } from "~/contexts/HistoryProvider";
import { Year } from "~/types";
import { Formatter } from "~/utils/Formatter";

type RootStackParamList = {
    Years: undefined;
    Months: undefined;
};

type YearsProps = StackScreenProps<RootStackParamList, 'Years'>

export function Years({ navigation } : YearsProps ) {
    const { history, setCurrentYear } = useHistoryProvider();

    const goToMonths = () => {
        navigation.navigate('Months');
    }

    const selectYear = (year: number) => {
        setCurrentYear(year);
        goToMonths();
    }

    const renderYearItem = ({ item }: { item: Year }) => {
        const stats = [
            { label: "Items vendidos", value: item.itemsSelledCount },
            { label: "Valor total", value: Formatter.currency(item.totalPrice) },
            { label: "Lucro", value: Formatter.currency(item.profit) },
        ];
        return (
            <DynamicListItem 
                mainText={item.year} 
                stats={stats} 
                onPress={() => selectYear(item.year)}
            />
        );
    };

    return (
        <GenericList
            data={history.years}
            title="Anos"
            renderItem={renderYearItem}
        />
    );
}