import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Item, ItemCart } from '~/types';
import { ProductCard } from './ProductCard';
import { Colors, Spacing, Fonts } from '~/styles';

type ProductListProps = {
    items: Item[];
    onUpdateCart: (item: Item, quantity: number) => void;
    cartItems: ItemCart[];
};

export function ProductList({ items, onUpdateCart, cartItems }: ProductListProps) {
    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Não há itens disponíveis.</Text>
                <Text style={styles.emptySubText}>Adicione itens ou verifique seu estoque.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                keyExtractor={(item) => `${item.categoryId}-${item.id}`}
                renderItem={({ item }) => (
                    <ProductCard
                        item={item}
                        onUpdateCart={onUpdateCart}
                        cartQuantity={cartItems.find(cartItem => (cartItem.id === item.id && cartItem.categoryId === item.categoryId))?.qty || 0}
                    />
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Spacing.medium,
        paddingTop: Spacing.small,
        backgroundColor: Colors.background
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.large,
        backgroundColor: Colors.background
    },
    emptyText: {
        fontSize: Fonts.large,
        fontWeight: 'bold',
        textAlign: 'center',
        color: Colors.text,
    },
    emptySubText: {
        fontSize: Fonts.regular,
        color: Colors.textLight,
        textAlign: 'center',
        marginTop: Spacing.small,
    },
    listContent: {
        paddingBottom: Spacing.large,
        flexGrow: 1,
    },
});