import { useState, useCallback } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import { Colors, Spacing, Fonts } from '~/styles';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

type StatsData = {
    label: string;
    value: string | number;
};

type DynamicListItemProps = {
    mainText: string | number;
    stats?: StatsData[];
    onPress: () => void;
    onEdit?: () => void;
    onDelete?: () => Promise<void> | void;
};

export function DynamicListItem({ mainText, stats, onPress, onEdit, onDelete }: DynamicListItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showConfirmationModal = () => {
        setIsModalVisible(true);
    };

    const handleConfirmDelete = useCallback(async () => {
        setIsModalVisible(false);
        if (!onDelete || isDeleting) {
            return;
        }
        setIsDeleting(true);
        try {
            await onDelete();
        } catch (error) {
            console.error('Erro ao deletar item:', error);
            setIsDeleting(false);
        }
    }, [onDelete, isDeleting]);

    const handleCancelDelete = () => {
        setIsModalVisible(false);
    };

    const cardOpacity = isDeleting ? 0.6 : 1;

    return (
        <View>
            <View style={[styles.card, { opacity: cardOpacity }]}>
                <TouchableOpacity onPress={onPress} style={styles.touchableArea} disabled={isDeleting}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.dataText} numberOfLines={2} ellipsizeMode="tail">
                            {mainText}
                        </Text>
                        {stats && stats.length > 0 && (
                            <View style={styles.statsContainer}>
                                {stats.map((stat, index) => (
                                    <Text key={index} style={styles.statsText}>
                                        <Text style={styles.statsLabel}>{stat.label}:</Text> {stat.value}
                                    </Text>
                                ))}
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
                <View style={styles.actionsWrapper}>
                    {isDeleting ? (
                        <Progress.CircleSnail size={30} color={[Colors.primary, Colors.primary]} thickness={2} />
                    ) : (
                        <View style={styles.actionsContainer}>
                            {onEdit && (
                                <TouchableOpacity
                                    onPress={onEdit}
                                    style={styles.actionButton}
                                >
                                    <Feather name="edit" size={20} color={Colors.textLight} />
                                </TouchableOpacity>
                            )}
                            {onDelete && (
                                <TouchableOpacity
                                    onPress={showConfirmationModal}
                                    style={styles.actionButton}
                                >
                                    <Feather name="trash-2" size={20} color={Colors.error} />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </View>

            <DeleteConfirmationModal 
                visible={isModalVisible} 
                onConfirm={handleConfirmDelete} 
                onCancel={handleCancelDelete} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.backgroundLight,
        marginVertical: Spacing.small,
        marginHorizontal: Spacing.medium,
        borderRadius: Spacing.small,
        shadowColor: Colors.text,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    touchableArea: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: Spacing.medium,
        paddingRight: Spacing.small,
    },
    dataText: {
        fontSize: Fonts.large,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.small,
    },
    statsContainer: {
        flexDirection: 'column',
    },
    statsText: {
        fontSize: Fonts.regular,
        color: Colors.textLight,
        marginBottom: Spacing.small / 4,
    },
    statsLabel: {
        fontWeight: 'bold',
        color: Colors.text,
    },
    actionsWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: Spacing.small,
        height: '100%',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    actionButton: {
        padding: Spacing.small,
        borderRadius: Spacing.small,
        backgroundColor: Colors.background,
        marginLeft: Spacing.small,
    },
});