import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Formatter } from '~/utils/Formatter';
import { Header } from '~/components';
import { CartItemCard } from './CartItemCard';
import { Colors, Spacing, Fonts } from '~/styles';
import { StackScreenProps } from '@react-navigation/stack';
import { useShoppingCart } from '~/hooks/useShoppingCart';
import { PurchaseProcess } from './PurchaseProcess';

type RootStackParamList = {
    SellPage: undefined;
    ShoppingCart: undefined;
};

type ShoppingCartProps = StackScreenProps<RootStackParamList, 'ShoppingCart'>

export function ShoppingCart({ navigation }: ShoppingCartProps) {
  const { status, cart, total, isCartEmpty, onBuyCart, updateCart, findItemStock, onBackPress } = useShoppingCart(navigation);

  return (
    <View style={styles.container}>

      <PurchaseProcess status={status}/>

      <Header title="Carrinho de Compras" onBackPress={onBackPress} />
      
      <FlatList
        data={cart}
        keyExtractor={(item) => `${item.id}+${item.categoryId}`}
        renderItem={({ item }) => <CartItemCard item={item} stock={findItemStock(item.categoryId, item.id) || 0} onUpdateCart={updateCart} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyCartContainer}>
            <Feather name="shopping-cart" size={50} color={Colors.textLight} />
            <Text style={styles.emptyCartText}>Seu carrinho está vazio.</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalValue}>{Formatter.currency(total)}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.checkoutButton, isCartEmpty && styles.disabledButton]} 
          onPress={onBuyCart}
          disabled={isCartEmpty}
        >
          <Text style={styles.checkoutButtonText}>Finalizar Pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    flexGrow: 1,
  },
  footer: {
    padding: Spacing.large,
    backgroundColor: Colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: Colors.accent,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.small,
  },
  totalText: {
    fontSize: Fonts.large,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalValue: {
    fontSize: Fonts.large,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.medium,
    borderRadius: Spacing.extraLarge,
    marginTop: Spacing.medium,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: Colors.textOnPrimary,
    fontSize: Fonts.regular,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: Colors.accent,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.extraLarge * 2,
  },
  emptyCartText: {
    fontSize: Fonts.regular,
    color: Colors.textLight,
    marginTop: Spacing.medium,
  }
});