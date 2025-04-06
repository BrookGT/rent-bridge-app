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
            Alert.alert("Success", "You're successfully registered.");
            navigation.navigate("Login");
        }
    };

    return (
        <LinearGradient
            colors={[Colors.primary, Colors.black]}
            style={styles.background}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.content, { paddingTop: headerHeight }]}>
                    <Text style={styles.title}>Register</Text>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor={Colors.grayMedium}
                            value={fullName}
                            onChangeText={setFullName}
                            accessibilityLabel="Full Name"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={Colors.grayMedium}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            accessibilityLabel="Email"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={Colors.grayMedium}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            accessibilityLabel="Password"
                        />
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
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        alignItems: "center",
    },
    content: {
        width: "85%",
        marginTop: 50,
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
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 12,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: Colors.grayLight,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginVertical: 12,
        color: Colors.black,
        backgroundColor: "#F9FAFB",
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

export default RegisterScreen;
