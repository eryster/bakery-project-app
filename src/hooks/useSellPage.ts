import { useCartProvider } from "~/contexts/CartProvider";
import { useCategoriesProvider } from "~/contexts/CategoryProvider";

export function useSellPage(navigation: any) {
    const { categories, money, profit } = useCategoriesProvider();
    const { cart, currentItems, selectedCategory, onSearch, onSelectCategory, updateCart } = useCartProvider();

    const goToShoppingCart = () => {
        navigation.navigate('ShoppingCart');
    }

    return {
        categories,
        money,
        profit,
        selectedCategory,
        currentItems,
        cart,
        onSearch,
        onSelectCategory,
        updateCart,
        goToShoppingCart
    }
}