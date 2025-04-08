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
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Colors from "../../../components/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
    Login: undefined;
    ResetPassword: { email: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, "ResetPassword">;
import { RouteProp as NavigationRouteProp } from "@react-navigation/native";

type RouteProp = NavigationRouteProp<RootStackParamList, "ResetPassword">;

const ResetPasswordScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProp>();
    const { email } = route.params;

    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleResetPassword = async () => {
        if (!code || !newPassword) {
            Alert.alert(
                "Error",
                "Please enter both the reset code and new password."
            );
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/verify-reset-code`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, code, newPassword }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to reset password");
            }

            Alert.alert("Success", "Password updated. Please log in.");
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert(
                "Error",
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={[Colors.primary, Colors.black]}
            style={styles.background}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Reset Password</Text>
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Reset Code"
                        placeholderTextColor={Colors.white}
                        value={code}
                        onChangeText={setCode}
                        keyboardType="numeric"
                        maxLength={6}
                        accessibilityLabel="Reset Code"
                    />
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="New Password"
                            placeholderTextColor={Colors.white}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showPassword}
                            accessibilityLabel="New Password"
                        />
                        <TouchableOpacity
                            style={styles.toggleButton}
                            onPress={() => setShowPassword(!showPassword)}
                            accessibilityLabel={
                                showPassword ? "Hide Password" : "Show Password"
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
                        onPress={handleResetPassword}
                        disabled={loading}
                        accessibilityLabel="Reset Password Button"
                    >
                        <Text style={styles.buttonText}>
                            {loading ? "Updating..." : "Update Password"}
                        </Text>
                    </TouchableOpacity>
                </View>
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
        width: "85%",
        alignItems: "center",
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
});

export default ResetPasswordScreen;
