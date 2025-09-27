import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts } from '~/styles';

type AddButtonProps = {
    text?: string;
    onPress: () => void;
};

export function AddButton({ text, onPress }: AddButtonProps) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            {text && <Text style={styles.buttonText}>{text}</Text>}
            <View style={text ? styles.iconContainerWithText : styles.iconContainer}>
                <Ionicons name="add" size={24} color={Colors.textOnPrimary} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        borderRadius: Spacing.small,
        paddingVertical: Spacing.medium,
        paddingHorizontal: Spacing.large,
        margin: Spacing.medium,
    },
    buttonText: {
        color: Colors.textOnPrimary,
        fontSize: Fonts.regular,
        fontWeight: 'bold',
    },
    iconContainer: {
        paddingHorizontal: Spacing.small,
    },
    iconContainerWithText: {
        marginLeft: Spacing.small,
    },
});