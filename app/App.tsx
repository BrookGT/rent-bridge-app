import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppRegistry } from "react-native";
import AppNavigator from "./navigation/AppNavigator";

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

AppRegistry.registerComponent("main", () => App);
