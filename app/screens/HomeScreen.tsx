import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../components/constants/Colors";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
    Home: undefined;
    Welcome: undefined;
};

type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, "Home">;
    route: RouteProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>
                🏡 Welcome to Home Screen! 🏡
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.replace("Welcome")} // Use 'replace' to avoid going back to Welcome after logout
            >
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.primary,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    buttonText: { color: Colors.primary, fontSize: 18, fontWeight: "bold" },
});

export default HomeScreen;
