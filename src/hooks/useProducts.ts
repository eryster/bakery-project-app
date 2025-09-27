import { useCategoriesProvider } from "~/contexts/CategoryProvider";
import { categoryManager } from "~/databaseUtils";
import { FormAttribute } from "~/types";

export function useProducts(categoryId: number, navigation: any) {
    const { categories } = useCategoriesProvider();
    const currentCategory = categories.find(c => c.id === categoryId);

    if (!currentCategory) {
        throw new Error('No category avaiable')
    }

    const categoryName = currentCategory.name
    const products = currentCategory.items
    
    const removeProduct = async (categoryId: number, productId: number) => {
        try {
            await categoryManager.removeProduct(categoryId.toString(), productId.toString());
        } catch (error) {
            console.error("Failed to remove product:", error);
        }
    };

    const navigateToItemForm = (productId?: number) => {
        const currentProduct = products.find(p => p.id === productId);

        const attributes: FormAttribute[] = [
            { name: 'name', label: 'Nome do produto', type: 'text', initialValue: currentProduct?.name || '' },
            { name: 'stock', label: 'Estoque do produto', type: 'number', initialValue: currentProduct?.stock || '' },
            { name: 'price', label: 'Preço do produto', type: 'number', initialValue: currentProduct?.price || '' },
            { name: 'cost', label: 'Custo do produto', type: 'number', initialValue: currentProduct?.cost || ''},
        ];

        const itemSave = {
            type: 'Product',
            categoryId,
            productId
        }

        navigation.navigate('ItemForm', {
            title: !productId ? 'Adicionar Produto' : 'Editar produto',
            attributes: attributes,
            itemSave: itemSave
        })
    }

    const onBackPress = () => {
        navigation.goBack();
    };

    return {
        products,
        categoryName,
        navigateToItemForm,
        onBackPress,
        removeProduct
    }
}