import { View, Text, StyleSheet } from "react-native";
import * as Progress from 'react-native-progress';
import { Colors, Spacing, Fonts } from '~/styles';
import { SafePage } from "./SafePage";

type LoadingProps = {
    text: string;
}

export function Loading({ text }: LoadingProps) {

    const loadingView = (
        <View style={styles.container}>
            <Progress.CircleSnail 
                color={Colors.primary}
                size={60}
                thickness={4}
            />
            <Text style={styles.loadingText}>{text}...</Text>
        </View>
    )
    
    return <SafePage element={loadingView}/>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.large,
        backgroundColor: Colors.background
    },
    loadingText: {
        marginTop: Spacing.medium,
        fontSize: Fonts.regular,
        color: Colors.textLight,
    },
});