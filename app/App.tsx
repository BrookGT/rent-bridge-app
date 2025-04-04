import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppRegistry } from "react-native";
import AppNavigator from "./navigation/AppNavigator"; // Corrected path based on your file structure

function App() {
    return (
        <NavigationContainer>
            <AppNavigator />
        </NavigationContainer>
    );
}

// Register the App component as "main" for Expo
AppRegistry.registerComponent("main", () => App);

export default App;
