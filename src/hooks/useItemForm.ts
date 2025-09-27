import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useCategoriesProvider } from '~/contexts/CategoryProvider';
import { categoryManager } from '~/databaseUtils';
import { FormAttribute, ItemTypeSave } from '~/types';

export function useItemForm(attributes: FormAttribute[], itemSave: ItemTypeSave, navigation: any) {
  const { categories } = useCategoriesProvider();

  const [isSaving, setIsSaving] = useState(false);
  const categoryId = itemSave.categoryId;
  const productId = itemSave.productId;
  const category = categories.find(c => c.id === itemSave.categoryId);
  const products = category?.items;

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const saveItem = useCallback(async (data: any) => {
    try {
      if (itemSave.type === 'Category') {
        if (category) {
          await categoryManager.addOrUpdateCategory({ ...category, name: data.name });
        } else {
          const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
          await categoryManager.addOrUpdateCategory({ id: newId, name: data.name, items: [] });
        }
      } else {
        if (!categoryId || !products) return;
        const { name, stock, price, cost } = data;
        if (productId) {
          await categoryManager.addOrUpdateProduct({ categoryId, id: productId, name, stock, price, cost });
        } else {
          const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
          await categoryManager.addOrUpdateProduct({ categoryId, id: newId, name, stock, price, cost });
        }
      }
      onBackPress();
    } catch (error) {
      const errorMessage = itemSave.type === 'Category' ? "Error saving category:" : "Error saving product:";
      console.error(errorMessage, error);
    }
  }, [itemSave, category, categories, onBackPress, categoryId, products, productId]);

  const defaultValues = attributes.reduce((acc, attr) => {
    acc[attr.name] = attr.initialValue !== undefined ? String(attr.initialValue) : '';
    return acc;
  }, {} as Record<string, string>);

  const { control, handleSubmit, formState: { errors, isValid }, getValues } = useForm({
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = useCallback(async (data: Record<string, string>) => {
    if (isSaving) return;
    setIsSaving(true);
    
    const finalData: Record<string, any> = {};
    for (const key in data) {
      const attr = attributes.find(a => a.name === key);
      if (attr?.type === 'number') {
        const cleanedValue = data[key].replace(',', '.');
        finalData[key] = Number(cleanedValue);
      } else {
        finalData[key] = data[key];
      }
    }

    await saveItem(finalData);

    setIsSaving(false);
  }, [isSaving, attributes, saveItem]);
  
  const validationRules = useCallback((attr: FormAttribute) => ({
    required: 'Necessário preencher este campo.',
    validate: (value: string) => {
      if (attr.type === 'number') {
        const cleanedValue = String(value).replace(',', '.');
        const parsedValue = Number(cleanedValue);
        if (isNaN(parsedValue)) return 'Digite um número válido.';
        if (parsedValue < 0) return 'O valor não pode ser negativo.';
      }

      if (attr.name === 'price' || attr.name === 'cost') {
        const priceValue = String(getValues('price')).replace(',', '.');
        const costValue = String(getValues('cost')).replace(',', '.');
        const price = Number(priceValue);
        const cost = Number(costValue);
        if (attr.name === 'price' && price <= 0) return 'O preço não pode ser 0 ou negativo.';
        if (!isNaN(price) && !isNaN(cost) && cost >= price) return 'O custo não pode ser igual ou maior que o preço.';
      }

      return true;
    },
  }), [getValues]);

  return {
    control,
    handleSubmit,
    errors,
    isSaving,
    onSubmit,
    validationRules,
    onBackPress,
    isValid,
  };
}