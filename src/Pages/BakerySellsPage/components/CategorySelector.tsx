import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Category } from '~/types';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Fonts } from '~/styles';
import { ScrollView } from 'react-native';

type CategorySelectorProps = {
    categories: Category[];
    selectedCategory: number | null;
    onSelectCategory: (categoryId: number | null) => void;
};

export function CategorySelector({ categories, selectedCategory, onSelectCategory }: CategorySelectorProps) {
    const isSelected = (id: number | null) => selectedCategory === id;
    const hasCategories = categories.length > 0;

    return (
        <View style={styles.container}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[!hasCategories && styles.centeredScrollView]}
            >
                <TouchableOpacity
                    style={[styles.categoryButton, isSelected(null) && styles.selectedCategoryButton]}
                    onPress={() => onSelectCategory(null)}
                >
                    <Feather name="grid" size={20} color={isSelected(null) ? Colors.textOnPrimary : Colors.text} />
                    <Text style={[styles.categoryText, isSelected(null) && styles.selectedCategoryText]}>Todos</Text>
                </TouchableOpacity>

                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[styles.categoryButton, isSelected(category.id) && styles.selectedCategoryButton]}
                        onPress={() => onSelectCategory(category.id)}
                    >
                        <Feather name={'tag'} size={20} color={isSelected(category.id) ? Colors.textOnPrimary : Colors.text} />
                        <Text style={[styles.categoryText, isSelected(category.id) && styles.selectedCategoryText]}>{category.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.small,
        borderBottomColor: Colors.accent,
        backgroundColor: Colors.background
    },
    centeredScrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.medium,
        paddingVertical: Spacing.small,
        backgroundColor: Colors.backgroundLight,
        borderRadius: Spacing.large,
        marginHorizontal: Spacing.small / 2,
        borderWidth: 1,
        borderColor: Colors.accent,
    },
    selectedCategoryButton: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    categoryText: {
        marginLeft: Spacing.small,
        fontSize: Fonts.regular,
        color: Colors.text,
        fontWeight: '500',
    },
    selectedCategoryText: {
        color: Colors.textOnPrimary,
    },
});