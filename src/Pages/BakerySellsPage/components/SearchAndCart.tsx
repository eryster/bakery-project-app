import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ItemCart } from '~/types';
import { Colors, Spacing, Fonts } from '~/styles';

type SearchAndCartProps = {
    cartItems: ItemCart[];
    onSearch: (query: string) => void;
    goToShoppingCart: Function;
};

export function SearchAndCart({ cartItems, onSearch, goToShoppingCart }: SearchAndCartProps) {
    const totalItemsInCart = cartItems.reduce((sum, item) => sum + item.qty, 0);

    return (
        <View style={styles.headerContainer}>
            <View style={styles.searchBar}>
                <Feather name="search" size={20} color={Colors.textLight} style={styles.iconMargin} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar item..."
                    placeholderTextColor={Colors.textLight}
                    onChangeText={onSearch}
                />
            </View>
            <TouchableOpacity style={styles.cartIconContainer} onPress={() => goToShoppingCart()}>
                <Feather name="shopping-cart" size={24} color={Colors.text} />
                {totalItemsInCart > 0 && (
                    <View style={styles.cartCounter}>
                        <Text style={styles.cartCounterText}>{totalItemsInCart}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.medium,
        paddingVertical: Spacing.small,
        backgroundColor: Colors.background,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.backgroundLight,
        borderRadius: Spacing.large,
        paddingHorizontal: Spacing.small,
        paddingVertical: Spacing.small,
        marginRight: Spacing.medium,
    },
    iconMargin: {
        marginRight: Spacing.small,
    },
    searchInput: {
        flex: 1,
        height: Spacing.large,
        fontSize: Fonts.regular,
        paddingHorizontal: 0,
        paddingVertical: 0,
        color: Colors.text,
    },
    cartIconContainer: {
        position: 'relative',
    },
    cartCounter: {
        position: 'absolute',
        top: -Spacing.small,
        right: -Spacing.small,
        backgroundColor: Colors.error,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartCounterText: {
        color: Colors.textOnPrimary,
        fontSize: Fonts.small,
        fontWeight: 'bold',
    },
});