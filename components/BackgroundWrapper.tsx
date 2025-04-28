// components/BackgroundWrapper.tsx
import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import Colors from "./constants/Colors";

interface BackgroundWrapperProps {
    children: React.ReactNode;
}

const BackgroundWrapper = ({ children }: BackgroundWrapperProps) => {
    return (
        <View style={styles.background}>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>{children}</View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: Colors.homeScreenBackground, // Teal background
    },
    container: {
        flex: 1,
        backgroundColor: Colors.grayLight, // White content area
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    content: {
        flex: 1,
        padding: 20,
        paddingTop: 40,
    },
});

export default BackgroundWrapper;
