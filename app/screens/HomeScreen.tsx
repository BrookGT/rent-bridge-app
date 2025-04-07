// screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../components/constants/Colors";
import { supabase } from "../../utils/supabase";

const HomeScreen = () => {
    interface Profile {
        id: string;
        full_name: string;
        username: string;
        // Removed email from Profile interface since it's not in the profiles table
    }

    const [profile, setProfile] = useState<Profile | null>(null);
    const [email, setEmail] = useState<string | undefined>(undefined); // Store email separately
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            // Get the authenticated user
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();
            if (authError || !user) {
                console.error("Error fetching user:", authError);
                setLoading(false);
                return;
            }

            // Set the email from auth.users
            setEmail(user.email);

            // Fetch the profile from the profiles table
            const { data, error } = await supabase
                .from("profiles")
                .select("id, full_name, username")
                .eq("id", user.id)
                .single();

            if (error) {
                console.error("Error fetching profile:", error);
            } else {
                setProfile(data);
            }
            setLoading(false);
        };

        fetchUserData();
    }, []);

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert("Error", error.message);
        }
        // Navigation to WelcomeScreen is handled by AppNavigator
    };

    if (loading) {
        return (
            <View style={styles.loading}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <LinearGradient
            colors={[Colors.primary, Colors.black]}
            style={styles.background}
        >
            <View style={styles.content}>
                <Text style={styles.title}>
                    Welcome, {profile?.full_name || "User"}!
                </Text>
                <Text style={styles.info}>
                    Username: {profile?.username || "Not set"}
                </Text>
                <Text style={styles.info}>Email: {email || "Not set"}</Text>
                <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                    <Text style={styles.buttonText}>Sign Out</Text>
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
    info: {
        fontSize: 18,
        color: Colors.white,
        marginVertical: 5,
    },
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginVertical: 20,
    },
    buttonText: {
        fontSize: 18,
        color: Colors.white,
        fontWeight: "bold",
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.black,
    },
    loadingText: {
        fontSize: 18,
        color: Colors.white,
    },
});

export default HomeScreen;
