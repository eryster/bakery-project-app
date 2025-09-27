import { useCategoriesProvider } from "~/contexts/CategoryProvider";
import { categoryManager } from "~/databaseUtils";
import { Category, FormAttribute } from "~/types";

export function useCategories(navigation: any) {
    const { categories } = useCategoriesProvider()

    const removeCategory = async (category: Category) => {
        try {
            await categoryManager.removeCategory(category.id.toString());
        } catch (error) {
            console.error("Failed to remove category:", error);
        }
    };
    
    const navigateToItemForm = (categoryId?: number) => {
        const categoryToEdit = categories.find(c => c.id === categoryId);

        const attributes: FormAttribute[] = [
            { 
                name: 'name', 
                label: 'Nome da categoria', 
                type: 'text', 
                initialValue: categoryToEdit?.name || '' 
            },
        ];

        const itemSave = {
            type: 'Category',
            categoryId
        }

        navigation.navigate('ItemForm', {
            title: !categoryId ? 'Adicionar Categoria' : 'Editar Categoria',
            attributes,
            itemSave
        });
    };

    const navigateToProduct = (categoryId: number) => {
        navigation.navigate('Products', {
            categoryId
        });
    };

    return {
        categories,
        navigateToProduct,
        navigateToItemForm,
        removeCategory,
    };
}