import { View } from 'react-native';
import { useSellPage } from '~/hooks';
import { CategorySelector } from './CategorySelector';
import { Header } from './Header';
import { ProductList } from './ProductList';
import { SearchAndCart } from './SearchAndCart';
import { StackScreenProps } from '@react-navigation/stack';

type RootStackParamList = {
    SellPage: undefined;
};

type SellPageProps = StackScreenProps<RootStackParamList, 'SellPage'>

export function SellPage({ navigation } : SellPageProps ) {
    const { categories, money, profit, currentItems, cart, selectedCategory, onSelectCategory, onSearch, updateCart, goToShoppingCart } = useSellPage(navigation);
    return (
        <View style={{flex: 1}}>
            <Header money={money} profit={profit} />
            <SearchAndCart cartItems={cart} onSearch={onSearch} goToShoppingCart={goToShoppingCart} />
            <CategorySelector categories={categories} selectedCategory={selectedCategory} onSelectCategory={onSelectCategory} />
            <ProductList items={currentItems} onUpdateCart={updateCart} cartItems={cart} />
        </View>
    ) 
}