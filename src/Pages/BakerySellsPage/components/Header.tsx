import { View, Text, StyleSheet } from "react-native";
import { Formatter } from "~/utils/Formatter";
import { Colors, Spacing, Fonts } from "~/styles";

type HeaderProps = {
    money: number;
    profit: number;
};

export function Header({ money, profit }: HeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.infoGroup}>
                <Text style={styles.label}>Dinheiro</Text>
                <Text
                    style={styles.value}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {Formatter.currency(money)}
                </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.infoGroup}>
                <Text style={styles.label}>Lucro</Text>
                <Text
                    style={styles.value}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {Formatter.currency(profit)}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.backgroundLight,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.large,
        paddingVertical: Spacing.medium,
        borderBottomWidth: 1,
        borderBottomColor: Colors.accent,
        elevation: 2,
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    infoGroup: {
        alignItems: 'center',
        flex: 1,
    },
    label: {
        fontSize: Fonts.regular,
        color: Colors.textLight,
        marginBottom: Spacing.small / 2,
    },
    value: {
        fontSize: Fonts.large,
        fontWeight: '600',
        color: Colors.text,
        flexShrink: 1,
    },
    separator: {
        height: '60%',
        width: 1,
        backgroundColor: Colors.accent,
        marginHorizontal: Spacing.small,
    },
});