import React from 'react';
import { View, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { EmptyListMessage } from './EmptyListMessage';
import { Header } from './Header';
import { Colors, Spacing } from '~/styles';

type GenericListProps<T> = {
    data: T[];
    title: string;
    renderItem: ListRenderItem<T>;
    listFooter?: React.ComponentType<any> | React.ReactElement | null;
    onBackPress?: () => void;
};

export function GenericList<T>({ data, title, renderItem, listFooter, onBackPress }: GenericListProps<T>) {
    return (
        <View style={styles.container}>
            <Header title={title} onBackPress={onBackPress} />
            <FlatList
                data={data}
                keyExtractor={(item: any) => {
                    if (item.id) {
                        return `${item.id}-${item.categoryId}`;
                    }
                    if (item.year && item.month && item.day) {
                        return `${item.year}-${item.month}-${item.day}`;
                    }
                    if (item.year && item.month) {
                        return `${item.year}-${item.month}`;
                    }
                    if (item.year) {
                        return `${item.year}`;
                    }
                    return Math.random().toString();
                }}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListFooterComponent={listFooter}
                ListEmptyComponent={<EmptyListMessage />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: Colors.background,
    },
    listContainer: {
        flexGrow: 1,
        paddingVertical: Spacing.small,
    },
});