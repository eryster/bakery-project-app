import { View, FlatList, StyleSheet, Text } from "react-native";
import { Header, DynamicListItem } from "~/components";
import { useCategories } from "~/hooks";
import { AddButton } from "./AddButton";
import { Colors, Spacing, Fonts } from "~/styles";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackScreenProps } from "@react-navigation/stack";

type RootStackParamList = {
    Categories: undefined;
    ProductsScreen: { categoryId: string };
};

type CategoriesProps = StackScreenProps<RootStackParamList, 'Categories'>

export function Categories({ navigation }: CategoriesProps) {
    const { categories, navigateToProduct, navigateToItemForm, removeCategory } = useCategories(navigation);

    const isListEmpty = categories.length === 0;

    return (
        <View style={styles.container}>
            <Header title="Categorias" />
            
            {isListEmpty ? (
                <View style={styles.emptyListContainer}>
                    <MaterialCommunityIcons name="format-list-bulleted-type" size={60} color={Colors.textLight} />
                    <Text style={styles.emptyListText}>Nenhuma categoria cadastrada.</Text>
                </View>
            ) : (
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <DynamicListItem
                            mainText={item.name}
                            onPress={() => navigateToProduct(item.id)}
                            onEdit={() => navigateToItemForm(item.id)}
                            onDelete={() => removeCategory(item)}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            <View style={styles.buttonContainer}>
                <AddButton text="Adicionar Categoria" onPress={() => navigateToItemForm()} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: Colors.background,
    },
    listContainer: {
        paddingVertical: Spacing.small,
        paddingBottom: Spacing.large * 2,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.background,
        paddingBottom: Spacing.medium,
        paddingHorizontal: Spacing.medium,
        paddingTop: Spacing.small,
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.large,
    },
    emptyListText: {
        fontSize: Fonts.regular,
        color: Colors.textLight,
        textAlign: 'center',
        marginTop: Spacing.medium,
        fontWeight: 'bold',
    }
});