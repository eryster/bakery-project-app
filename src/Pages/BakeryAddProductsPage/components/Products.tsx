import { View, FlatList, StyleSheet, Text } from "react-native";
import { Header, DynamicListItem } from "~/components";
import { useProducts } from "~/hooks";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts } from "~/styles";
import { StackScreenProps } from "@react-navigation/stack";
import { AddButton } from "./AddButton";

type RootStackParamList = {
    Products: { categoryId: number };
};

type ProductsProps = StackScreenProps<RootStackParamList, 'Products'>

export function Products({ navigation, route } : ProductsProps ) {
    const { categoryId } = route.params;
    const { products, categoryName, navigateToItemForm, removeProduct, onBackPress } = useProducts(categoryId, navigation);

    const isListEmpty = products.length === 0;

    return (
        <View style={styles.container}>
            <Header title={categoryName} onBackPress={() => onBackPress()} />

            {isListEmpty ? (
                <View style={styles.emptyListContainer}>
                    <MaterialCommunityIcons name="tag-outline" size={60} color={Colors.textLight} />
                    <Text style={styles.emptyListText}>Nenhum produto cadastrado.</Text>
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <DynamicListItem
                            mainText={item.name}
                            onPress={() => navigateToItemForm(item.id)}
                            onDelete={() => removeProduct(item.categoryId, item.id)}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            <View style={styles.buttonContainer}>
                <AddButton text="Adicionar Produto" onPress={() => navigateToItemForm()} />
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