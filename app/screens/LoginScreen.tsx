// LoginScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from "react-native";
import Colors from "../../components/constants/Colors";
import { StackNavigationProp } from "@react-navigation/stack"; // Import StackNavigationProp

// Define the parameter list for your stack navigation
type RootStackParamList = {
    Home: undefined; // Example Home screen
    Register: undefined; // Example Register screen
    Login: undefined; // Login screen
};

// Type the navigation prop for the LoginScreen
type LoginScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "Login"
>;

interface Props {
    navigation: LoginScreenNavigationProp; // Type the navigation prop
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // Implement login logic here
        console.log("Login button pressed");
        // After successful login, navigate to the Home screen
        navigation.navigate("Home");
    };

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={Colors.black}
                translucent
            />
            <View style={styles.formContainer}>
                <Text style={styles.title}>Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity onPress={handleLogin} style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate("Register")}
                    style={styles.registerLink}
                >
                    <Text style={styles.registerText}>
                        Don't have an account? Register
                    </Text>
                </TouchableOpacity>
            </View>
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
    formContainer: {
        width: "80%",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingLeft: 10,
    },
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: 15,
        borderRadius: 5,
        marginBottom: 15,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    registerLink: {
        alignItems: "center",
    },
    registerText: {
        color: Colors.primary,
        textDecorationLine: "underline",
    },
});

export default LoginScreen;
