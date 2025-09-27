import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Fonts } from '~/styles';

type HeaderProps = {
    title: string;
    onBackPress?: () => void;
};

export function Header({ title, onBackPress }: HeaderProps) {
    return (
        <View style={styles.header}>
            <View style={styles.leftContainer}>
                {onBackPress && (
                    <Pressable
                        style={styles.backButton}
                        onPress={onBackPress}
                    >
                        <Feather name="chevron-left" size={24} color={Colors.text} />
                    </Pressable>
                )}
            </View>

            <View>
                <Text style={styles.title}>{title}</Text>
            </View>
            
            <View />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.large,
        paddingHorizontal: Spacing.medium,
        backgroundColor: Colors.backgroundLight,
        borderBottomWidth: 1,
        borderBottomColor: Colors.accent,
    },
    leftContainer: {
        position: 'absolute',
        left: Spacing.medium,
        zIndex: 1,
    },
    backButton: {
        padding: Spacing.small,
    },
    title: {
        fontSize: Fonts.large,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
    },
});