// App.tsx
import "react-native-url-polyfill/auto"; // Move the polyfill import here
import React, { useEffect } from "react";
import { AppRegistry } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";

// Deep linking configuration
const linking = {
    prefixes: ["yourapp://"],
    config: {
        screens: {
            ResetPassword: "reset-password",
        },
    },
};

export default function App() {
    useEffect(() => {
        console.log("App initialized successfully");
    }, []);

    return (
        <NavigationContainer linking={linking}>
            <AppNavigator />
        </NavigationContainer>
    );
}

// Register the main component for React Native
AppRegistry.registerComponent("main", () => App);
