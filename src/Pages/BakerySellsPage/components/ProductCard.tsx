import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Item } from '~/types';
import { Feather } from '@expo/vector-icons';
import { Formatter } from '~/utils/Formatter';
import { Colors, Spacing, Fonts } from '~/styles';

type ProductCardProps = {
    item: Item;
    onUpdateCart: (item: Item, quantity: number) => void;
    cartQuantity: number;
};

export function ProductCard({ item, onUpdateCart, cartQuantity }: ProductCardProps) {
    const isAddDisabled = item.stock <= cartQuantity;
    const isRemoveDisabled = cartQuantity === 0;

    return (
        <View style={styles.card}>
            <View style={styles.infoContainer}>
                <Text
                    style={styles.productName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {item.name}
                </Text>
                <Text
                    style={styles.productPrice}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {Formatter.currency(item.price)}
                </Text>
                <Text style={styles.productStock}>Estoque: {item.stock}</Text>
            </View>
            <View style={styles.controlsContainer}>
                <TouchableOpacity
                    style={[styles.controlButton, isRemoveDisabled && styles.disabledButton]}
                    onPress={() => onUpdateCart(item, -1)}
                    disabled={isRemoveDisabled}
                >
                    <Feather name="minus" size={24} color={isRemoveDisabled ? Colors.textLight : Colors.primary} />
                </TouchableOpacity>

                <View style={styles.quantityContainer}>
                    <Text style={styles.quantityText}>{cartQuantity}</Text>
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
        backgroundColor: Colors.backgroundLight,
        borderRadius: Spacing.small,
        padding: Spacing.medium,
        marginBottom: Spacing.small,
        alignItems: 'center',
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoContainer: {
        flex: 1,
        flexShrink: 1,
        marginRight: Spacing.medium,
    },
    productName: {
        fontSize: Fonts.regular,
        fontWeight: 'bold',
        marginBottom: Spacing.small / 2,
        color: Colors.text,
    },
    productPrice: {
        fontSize: Fonts.regular,
        color: Colors.text,
        fontWeight: '600',
        marginBottom: Spacing.small / 2,
    },
    productStock: {
        fontSize: Fonts.small,
        color: Colors.textLight,
    },
    controlsContainer: {
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
    quantityText: {
        fontSize: Fonts.regular,
        fontWeight: 'bold',
        color: Colors.text,
    },
});