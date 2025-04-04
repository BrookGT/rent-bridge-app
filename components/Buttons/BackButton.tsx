// components/BackButton.tsx
import React from "react";
import { TouchableOpacity, StyleSheet, Text, StatusBar } from "react-native"; // Use Text as a placeholder
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Colors from "../constants/Colors";

type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    Home: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const BackButton = () => {
    const navigation = useNavigation<NavigationProp>();
    const routes = useNavigationState((state) => state.routes);

    const canGoBack = routes.length > 1;

    if (!canGoBack) {
        return null;
    }

    return (
        <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
                console.log("Back button pressed");
                navigation.goBack();
            }}
        >
            <Ionicons name="arrow-back" size={30} color={Colors.white} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    backButton: {
        position: "absolute",
        top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
        left: 20,
        zIndex: 100,
        padding: 5,
    },
});

export default BackButton;
