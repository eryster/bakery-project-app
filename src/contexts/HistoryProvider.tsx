import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { salesManager } from '~/databaseUtils';
import { History, ItemSale, Year, Month, Day, Sales } from '~/types';

interface HistoryContextType {
    history: History;
    currentYear: number | null;
    currentMonth: number | null;
    currentDay: number | null;
    currentSales: string | null;
    year: Year | undefined;
    month: Month | undefined;
    day: Day | undefined;
    sales: Sales | undefined;
    setCurrentYear: React.Dispatch<React.SetStateAction<number | null>>;
    setCurrentMonth: React.Dispatch<React.SetStateAction<number | null>>;
    setCurrentDay: React.Dispatch<React.SetStateAction<number | null>>;
    setCurrentSales: React.Dispatch<React.SetStateAction<string | null>>;
    deleteSales: (salesId: string, items: ItemSale[]) => Promise<void>;
    deleteItem: (item: ItemSale) => Promise<void>;
}

export const HistoryContext = createContext<HistoryContextType | null>(null);

type HistoryProviderProps = {
    children: ReactNode;
}

export function HistoryProvider({ children }: HistoryProviderProps) {
    const [history, setHistory] = useState<History>({ years: [] });

    const [currentYear, setCurrentYear] = useState<number | null>(null);
    const [currentMonth, setCurrentMonth] = useState<number | null>(null);
    const [currentDay, setCurrentDay] = useState<number | null>(null);
    const [currentSales, setCurrentSales] = useState<string | null>(null);
    
    const year = history.years.find(y => y.year === currentYear);
    const month = year?.months.find(m => m.month === currentMonth);
    const day = month?.days.find(d => d.day === currentDay);
    const sales = day?.sales.find(s => s.id === currentSales);

    const deleteSales = async (saleId: string, items: ItemSale[]) => {
        try {
            await salesManager.deleteSale(saleId);
        } catch (error) {
            console.error('Error during sale deletion operation:', error);
        }
    }

    const deleteItem = async (item: ItemSale) => {
        const id = sales?.id;
        if (!id) return;
        try {
            await salesManager.deleteItemFromSale(id, item.id, item.categoryId);
        } catch (error) {
            console.error('Error during item deletion operation:', error);
        }
    }
    
    useEffect(() => {
        const unsubscribe = salesManager.subscribeToHistory((updatedHistory) => {
            setHistory(updatedHistory);
        });
        
        return () => unsubscribe();
    }, []);

    const contextValue = {
        history,
        currentYear,
        currentMonth,
        currentDay,
        currentSales,
        year,
        month,
        day,
        sales,
        setCurrentYear,
        setCurrentMonth,
        setCurrentDay,
        setCurrentSales,
        deleteSales,
        deleteItem
    };

    return (
        <HistoryContext.Provider value={contextValue}>
            {children}
        </HistoryContext.Provider>
    );
}

export const useHistoryProvider = () => {
    const context = useContext(HistoryContext);
    if (context === null) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
};