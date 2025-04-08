import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Colors from "../../../components/constants/Colors";
import { supabase } from "../../../utils/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    Home: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const RegisterScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
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

    const handleSignUp = async () => {
        if (fullName.length < 3) {
            Alert.alert(
                "Error",
                "Full Name must be at least 3 characters long."
            );
            return;
        }
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    username: fullName, // Set username to fullName
                },
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
            const { error: loginError } =
                await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

            if (loginError) {
                Alert.alert(
                    "Error",
                    "Registration successful, but login failed. Please log in manually."
                );
                navigation.navigate("Login");
            } else {
                setShowSuccessModal(true);
                setTimeout(() => {
                    setShowSuccessModal(false);
                    navigation.navigate("Home");
                }, 2000);
            }
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
                    <Text style={styles.title}>Register</Text>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor={Colors.white}
                            value={fullName}
                            onChangeText={setFullName}
                            accessibilityLabel="Full Name"
                            selectionColor={Colors.white}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={Colors.white}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            accessibilityLabel="Email"
                            selectionColor={Colors.white}
                        />
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Password"
                                placeholderTextColor={Colors.white}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                accessibilityLabel="Password"
                                selectionColor={Colors.white}
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
                            onPress={handleSignUp}
                            disabled={loading}
                            accessibilityLabel="Register Button"
                        >
                            <Text style={styles.buttonText}>
                                {loading ? "Registering..." : "Register"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={styles.link}>
                            Already have an account? Log in
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Success Modal */}
            <Modal
                visible={showSuccessModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowSuccessModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Success!</Text>
                        <Text style={styles.modalMessage}>
                            Welcome, {fullName || "User"}! You’ve successfully
                            registered.
                        </Text>
                        <Text style={styles.modalSubMessage}>
                            Redirecting to Home...
                        </Text>
                    </View>
                </View>
            </Modal>
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
    modalOverlay: {
        flex: 1,
        backgroundColor: Colors.overlay,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        width: "80%",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.success,
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        color: Colors.textDark,
        textAlign: "center",
        marginBottom: 10,
    },
    modalSubMessage: {
        fontSize: 14,
        color: Colors.grayMedium,
        textAlign: "center",
    },
});

export default RegisterScreen;
