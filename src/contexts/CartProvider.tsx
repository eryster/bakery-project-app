import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { salesManager } from '~/databaseUtils';
import { Item, ItemCart, ItemSale, PurchaseStatus } from '~/types';
import { useCategoriesProvider } from './CategoryProvider';
import { Formatter } from '~/utils/Formatter';

interface CartContextType {
    cart: ItemCart[];
    currentItems: Item[];
    status: PurchaseStatus;
    selectedCategory: number | null;
    onSelectCategory: (id: number | null) => void;
    onSearch: (text: string) => void;
    setCurrentItems: (items: Item[]) => void;
    updateCart: (item: Item | ItemCart, qty: number) => void;
    buyCart: () => Promise<void>;
}

const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { categories } = useCategoriesProvider();
    const [currentItems, setCurrentItems] = useState<Item[]>([]);
    const [cart, setCart] = useState<ItemCart[]>([]);
    const [status, setStatus] = useState<PurchaseStatus>('idle');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    
    const onSelectCategory = (id: number | null) => {
        setSelectedCategory(id);
    };

    const onSearch = (text: string) => {
        setSelectedCategory(null);

        const normalizedSearch = Formatter.normalizeText(text);

        setCurrentItems(
            categories.flatMap(c =>
                c.items.filter(item =>
                    (Formatter.normalizeText(item.name).includes(normalizedSearch) && item.stock > 0)
                )
            )
        );
    };
    
    const buyCart = async () => {
        if (cart.length <= 0) return;
        setStatus('processing');

        const allItems = categories.flatMap(c => c.items);
        const items: ItemSale[] = cart.map(cartItem => {
            const itemRef = allItems.find(i => i.id === cartItem.id && i.categoryId === cartItem.categoryId);
            const itemProfit = itemRef ? cartItem.qty * (itemRef.price - itemRef.cost) : 0;

            return {
                categoryId: cartItem.categoryId,
                id: cartItem.id,
                name: cartItem.name,
                qty: cartItem.qty,
                totalPrice: cartItem.total,
                profit: itemProfit,
            };
        });

        try {
            const success = await salesManager.addSale({ items });

            if (!success) {
                setStatus('fail');
                console.error("The sale couldn't be completed. Verify your stock.");
                return;
            }

            setCart([]);
            setStatus('success');
        } catch (error) {
            setStatus('fail');
            console.error("Error while trying to buy:", error);
        } finally {
            await sleep(2000);
            setStatus('idle');
        }
    };

    const updateCart = (item: Item | ItemCart, qty: number) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id && cartItem.categoryId === item.categoryId);

            if (existingItemIndex > -1) {
                const updatedCart = [...prevCart];
                const existingItem = updatedCart[existingItemIndex];
                const newQty = existingItem.qty + qty;

                if (newQty > 0) {
                    const pricePerUnit = "price" in item ? item.price : existingItem.total / existingItem.qty;
                    existingItem.qty = newQty;
                    existingItem.total = newQty * pricePerUnit;
                } else {
                    updatedCart.splice(existingItemIndex, 1);
                }
                return updatedCart;
            } else if (qty > 0 && "price" in item) {
                return [...prevCart, { categoryId: item.categoryId, id: item.id, name: item.name, qty, total: item.price * qty }];
            }
            return prevCart;
        });
    };

    useEffect(() => {
        if (categories.length === 0) {
            setCurrentItems([]);
            return;
        }

        if (selectedCategory !== null) {
            const category = categories.find(c => c.id === selectedCategory);
            setCurrentItems(category?.items?.filter(i => i.stock > 0) || []);
        } else {
            const allItems = categories.flatMap(c => c.items);
            setCurrentItems(allItems.filter(i => i.stock > 0));
        }
    }, [categories, selectedCategory]);

    useEffect(() => {
        const allItemsMap = new Map<string, Item>();
        categories.flatMap(c => c.items).forEach(item => {
            allItemsMap.set(`${item.categoryId}-${item.id}`, item);
        });

        setCart(prevCart => {
            if (prevCart.length === 0) {
                return prevCart;
            }

            const validatedCart = prevCart.reduce<ItemCart[]>((acc, cartItem) => {
                const product = allItemsMap.get(`${cartItem.categoryId}-${cartItem.id}`);

                if (!product || product.stock <= 0) {
                    return acc;
                }

                if (cartItem.qty > product.stock) {
                    const pricePerUnit = cartItem.total / cartItem.qty;
                    acc.push({
                        ...cartItem,
                        qty: product.stock,
                        total: product.stock * pricePerUnit,
                    });
                } else {
                    acc.push(cartItem);
                }

                return acc;
            }, []);
            
            if (JSON.stringify(prevCart) !== JSON.stringify(validatedCart)) {
                return validatedCart;
            }
            
            return prevCart;
        });
    }, [categories]);

    const contextValue = {
        status,
        cart,
        currentItems,
        selectedCategory,
        onSelectCategory,
        onSearch,
        setCurrentItems,
        updateCart,
        buyCart
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartProvider = () => {
    const context = useContext(CartContext);
    
    if (context === null) {
        throw new Error('useCartProvider must be used within a CartProvider');
    }
    
    return context;
};