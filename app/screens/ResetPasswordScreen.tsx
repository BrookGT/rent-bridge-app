// screens/ResetPasswordScreen.tsx
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

type RootStackParamList = {
    Login: undefined;
    ResetPassword: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ResetPasswordScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if the user is authenticated (Supabase logs them in via the magic link)
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error || !session) {
                Alert.alert("Error", "Invalid or expired reset link.");
                navigation.navigate("Login");
            }
        });
    }, []);

    const handleResetPassword = async () => {
        setLoading(true);
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        setLoading(false);
        if (error) {
            Alert.alert("Error", error.message);
        } else {
            Alert.alert(
                "Success",
                "Your password has been updated. Please log in."
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
                <Text style={styles.title}>Reset Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    placeholderTextColor={Colors.white}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                />
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleResetPassword}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Updating..." : "Update Password"}
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
});

export default ResetPasswordScreen;
