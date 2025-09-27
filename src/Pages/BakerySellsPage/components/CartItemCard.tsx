import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';
import { ItemCart } from "~/types";
import { Formatter } from "~/utils/Formatter";
import { Colors, Spacing, Fonts } from '~/styles';

type CartItemCardOption = {
    item: ItemCart;
    stock: number;
    onUpdateCart: Function;
}

export function CartItemCard({ item, onUpdateCart, stock }: CartItemCardOption) {
    const isRemoveDisabled = item.qty === 0;
    const isAddDisabled = stock <= item.qty;

    return (
        <View style={styles.card}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                <Text style={styles.itemPrice}>{Formatter.currency(item.total)}</Text>
            </View>
            <View style={styles.itemControls}>
                <TouchableOpacity
                    style={[styles.controlButton, isRemoveDisabled && styles.disabledButton]}
                    onPress={() => onUpdateCart(item, -1)}
                    disabled={isRemoveDisabled}
                >
                    <Feather name="minus" size={24} color={isRemoveDisabled ? Colors.textLight : Colors.primary} />
                </TouchableOpacity>
                <View style={styles.quantityContainer}>
                    <Text style={styles.itemQuantity}>{item.qty}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.controlButton, isAddDisabled && styles.disabledButton]}
                    onPress={() => onUpdateCart(item, 1)}
                    disabled={isAddDisabled}
                >
                    <Feather name="plus" size={24} color={isAddDisabled ? Colors.textLight : Colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.backgroundLight,
        borderRadius: Spacing.small,
        padding: Spacing.medium,
        marginBottom: Spacing.small,
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemInfo: {
        flex: 1,
        flexShrink: 1,
        marginRight: Spacing.medium,
    },
    itemName: {
        fontSize: Fonts.regular,
        fontWeight: 'bold',
        color: Colors.text,
    },
    itemPrice: {
        fontSize: Fonts.regular,
        color: Colors.textLight,
        marginTop: Spacing.small / 2,
    },
    itemControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    controlButton: {
        backgroundColor: Colors.background,
        width: Spacing.extraLarge,
        height: Spacing.extraLarge,
        borderRadius: Spacing.extraLarge / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: Colors.backgroundLight,
    },
    quantityContainer: {
        width: Spacing.large,
        height: Spacing.large,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: Spacing.small,
    },
    itemQuantity: {
        fontSize: Fonts.regular,
        fontWeight: 'bold',
        color: Colors.text,
    },
});