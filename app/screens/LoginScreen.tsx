import React, { useState, useEffect } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    ResetPassword: undefined;
    Home: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Added state for password visibility

    const headerHeight = useHeaderHeight();

    useEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTintColor: Colors.white,
            headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
            },
            headerTitleStyle: {
                color: Colors.white,
            },
        });
    }, [navigation]);

    const handleSignIn = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);
        if (error) {
            Alert.alert("Error", error.message);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert(
                "Error",
                "Please enter your email to reset your password."
            );
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "yourapp://reset-password",
        });

        setLoading(false);
        if (error) {
            Alert.alert("Error", error.message);
        } else {
            Alert.alert(
                "Success",
                "A password reset link has been sent to your email."
            );
        }
    };

    return (
        <LinearGradient
            colors={[Colors.primary, Colors.black]}
            style={styles.background}
        >
            <SafeAreaView style={styles.safeArea}>
                <View
                    style={[styles.content, { paddingTop: headerHeight + 20 }]}
                >
                    <Text style={styles.title}>Login</Text>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={Colors.white}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            accessibilityLabel="Email"
                        />
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Password"
                                placeholderTextColor={Colors.white}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword
                                accessibilityLabel="Password"
                            />
                            <TouchableOpacity
                                style={styles.toggleButton}
                                onPress={() => setShowPassword(!showPassword)}
                                accessibilityLabel={
                                    showPassword
                                        ? "Hide Password"
                                        : "Show Password"
                                }
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={20}
                                    color={Colors.secondary}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                loading && styles.buttonDisabled,
                            ]}
                            onPress={handleSignIn}
                            disabled={loading}
                            accessibilityLabel="Login Button"
                        >
                            <Text style={styles.buttonText}>
                                {loading ? "Logging in..." : "Login"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text style={styles.link}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text style={styles.link}>
                            Don't have an account? Register
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        width: "85%",
        alignItems: "center",
        alignSelf: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: Colors.white,
        marginBottom: 30,
    },
    formContainer: {
        width: "100%",
        backgroundColor: Colors.glassBackground,
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: Colors.glassInputBorder,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginVertical: 12,
        color: Colors.white,
        backgroundColor: Colors.glassInputBackground,
    },
    passwordContainer: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        borderColor: Colors.glassInputBorder,
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 12,
        backgroundColor: Colors.glassInputBackground,
    },
    passwordInput: {
        flex: 1,
        height: "100%",
        paddingHorizontal: 12,
        color: Colors.white,
    },
    toggleButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        justifyContent: "center",
    },
    toggleText: {
        color: Colors.secondary,
        fontSize: 14,
        fontWeight: "600",
    },
    button: {
        backgroundColor: Colors.secondary,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 18,
        color: Colors.white,
        fontWeight: "600",
    },
    link: {
        color: Colors.secondary,
        textDecorationLine: "underline",
        marginTop: 20,
        fontSize: 16,
    },
});

export default LoginScreen;
