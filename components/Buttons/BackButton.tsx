// components/BackButton.tsx
import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native"; // Use Text as a placeholder
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
            onPress={() => navigation.goBack()}
        >
            <Text style={{ color: Colors.white, fontSize: 20 }}>←</Text>
            {"<"}
            {/* Placeholder */}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        zIndex: 10,
    },
});

export default BackButton;
