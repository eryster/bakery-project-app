import { Modal, Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Spacing, Fonts } from '~/styles';

type DeleteConfirmationModalProps = {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

const screenWidth = Dimensions.get('window').width;

export function DeleteConfirmationModal({ visible, onConfirm, onCancel }: DeleteConfirmationModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Confirmação</Text>
                    <Text style={styles.modalText}>Tem certeza de que deseja excluir este item? Esta ação não pode ser desfeita.</Text>
                    
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonCancel]}
                            onPress={onCancel}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonDelete]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.buttonText}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        marginHorizontal: Spacing.large,
        backgroundColor: Colors.backgroundLight,
        borderRadius: Spacing.medium,
        padding: Spacing.large,
        alignItems: 'center',
        shadowColor: Colors.text,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: screenWidth > 600 ? 400 : '90%', 
        maxWidth: 500,
    },
    modalTitle: {
        marginBottom: Spacing.small,
        fontSize: Fonts.large,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
    },
    modalText: {
        marginBottom: Spacing.large,
        textAlign: 'center',
        fontSize: Fonts.regular,
        color: Colors.textLight,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        borderRadius: Spacing.small,
        paddingVertical: Spacing.medium,
        paddingHorizontal: Spacing.large,
        flex: 1,
        marginHorizontal: Spacing.small,
    },
    buttonCancel: {
        backgroundColor: Colors.primary,
    },
    buttonDelete: {
        backgroundColor: Colors.error,
    },
    buttonText: {
        color: Colors.textOnPrimary,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: Fonts.regular,
    },
});