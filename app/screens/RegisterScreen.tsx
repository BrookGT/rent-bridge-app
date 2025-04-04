import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Colors from "../../components/constants/Colors";
import { supabase } from "../../utils/supabase";

type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const RegisterScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
                emailRedirectTo: "yourapp://home",
            },
        });

        setLoading(false);
        if (error) {
            if (error.message.includes("User already registered")) {
                Alert.alert(
                    "Error",
                    "This email is already registered. Please log in."
                );
            } else {
                Alert.alert("Error", error.message);
            }
        } else {
            Alert.alert(
                "Success",
                "Please check your email for a confirmation link to complete your registration."
            );
            navigation.navigate("Login");
        }
    };

    return (
        <LinearGradient
            colors={[Colors.primary, Colors.black]}
            style={styles.background}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Register</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor={Colors.white}
                    value={fullName}
                    onChangeText={setFullName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={Colors.white}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={Colors.white}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSignUp}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Registering..." : "Register"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.link}>
                        Already have an account? Log in
                    </Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        width: "80%",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.white,
        marginBottom: 20,
    },
    input: {
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        color: Colors.white,
        padding: 12,
        borderRadius: 8,
        marginVertical: 10,
    },
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginVertical: 10,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 18,
        color: Colors.white,
        fontWeight: "bold",
    },
    link: {
        color: Colors.white,
        textDecorationLine: "underline",
        marginTop: 10,
    },
});

export default RegisterScreen;
