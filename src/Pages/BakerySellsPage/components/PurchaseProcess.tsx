import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import { PurchaseStatus } from '~/types';
import { Colors, Spacing, Fonts } from '~/styles';

type PurchaseProcessProps = {
    status: PurchaseStatus;
}

export function PurchaseProcess({ status }: PurchaseProcessProps) {
    if (status === 'idle') {
        return null;
    }

    return (
        <View style={styles.container}>
            {status === 'processing' && (
                <View style={styles.content}>
                    <Progress.CircleSnail 
                        color={Colors.primary} 
                        size={60} 
                        thickness={4} 
                    />
                    <Text style={styles.text}>Processando sua compra...</Text>
                </View>
            )}
            {status === 'success' && (
                <View style={styles.content}>
                    <MaterialCommunityIcons 
                        name="check-circle" 
                        size={100} 
                        color={Colors.success} 
                    />
                    <Text style={[styles.text, { color: Colors.success }]}>Compra Concluída!</Text>
                </View>
            )}
            {status === 'fail' && (
                <View style={styles.content}>
                    <MaterialCommunityIcons 
                        name="close-circle" 
                        size={100} 
                        color={Colors.error} 
                    />
                    <Text style={[styles.text, { color: Colors.error }]}>Falha na Compra!</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.backgroundLight,
        zIndex: 1000,
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: Spacing.medium,
        fontSize: Fonts.large,
        textAlign: 'center',
        fontWeight: 'bold',
        color: Colors.text,
    },
});