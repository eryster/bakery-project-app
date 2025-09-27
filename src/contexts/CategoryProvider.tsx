import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { Loading } from '~/components';
import { categoryManager, salesManager } from '~/databaseUtils';
import { Category } from '~/types';

interface CategoryContextType {
    categories: Category[];
    money: number;
    profit: number;
}

export const CategoryContext = createContext<CategoryContextType | null>(null);

type CategoryProviderProps = {
    children: ReactNode;
}

export function CategoryProvider({ children }: CategoryProviderProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [money, setMoney] = useState(0);
    const [profit, setProfit] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeCategories = categoryManager.onCategoriesAndProductsChange((newCategories: Category[]) => {
            setCategories(newCategories);
        });

        const unsubscribeSummary = salesManager.onTodaySummaryChange((todaySummary) => {
            if (todaySummary) {
                setMoney(todaySummary.totalPrice);
                setProfit(todaySummary.profit)
            }
            setLoading(false);
        });

        return () => {
            unsubscribeCategories();
            unsubscribeSummary();
        };
    }, []);

    if (loading) {
        return <Loading text="Carregando dados de produtos..." />;
    }

    const contextValue = {
        categories,
        money,
        profit
    };

    return (
        <CategoryContext.Provider value={contextValue}>
            {children}
        </CategoryContext.Provider>
    );
}

export const useCategoriesProvider = () => {
    const context = useContext(CategoryContext);
    if (context === null) {
        throw new Error('useCategories must be used within a CategoryProvider');
    }
    return context;
};