import { useCartProvider } from "~/contexts/CartProvider";
import { useCategoriesProvider } from "~/contexts/CategoryProvider";

export function useShoppingCart(navigation: any) {
    const { categories } = useCategoriesProvider();
    const { status, cart, buyCart, updateCart  } = useCartProvider();
    const total = cart.reduce((sum, item) => sum + item.total, 0);
    const isCartEmpty = cart.length === 0;

    const findItemStock = (categoryId: number, productId: number) => {
        return categories.find(c => c.id === categoryId)?.items?.find(p => p.id === productId)?.stock
    }

    const onBuyCart = async () => {
        await buyCart();
        onBackPress();
    }

    const onBackPress = () => {
        navigation.goBack();
    };

    return {
        status,
        cart,
        total,
        isCartEmpty,
        onBuyCart,
        updateCart,
        findItemStock,
        onBackPress
    }
}