// screens/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../components/constants/Colors";
import { supabase } from "../../utils/supabase";

const AdminDashboard = () => {
    interface User {
        id: string;
        full_name?: string;
        username?: string;
        is_admin?: boolean;
    }

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase.from("profiles").select("*");

            if (error) {
                console.error("Error fetching users:", error);
            } else {
                setUsers(data);
            }
            setLoading(false);
        };

        fetchUsers();
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
                <Text style={styles.title}>Admin Dashboard</Text>
                <Text style={styles.subtitle}>All Users</Text>
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.userItem}>
                            <Text style={styles.userText}>
                                {item.full_name || "Unknown"} (
                                {item.username || "No username"})
                            </Text>
                            <Text style={styles.userText}>
                                Admin: {item.is_admin ? "Yes" : "No"}
                            </Text>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No users found.</Text>
                    }
                />
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
        paddingTop: 40,
    },
    content: {
        flex: 1,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.white,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 20,
        color: Colors.white,
        marginBottom: 10,
    },
    userItem: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        width: "90%",
        alignSelf: "center",
    },
    userText: {
        fontSize: 16,
        color: Colors.white,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.white,
        textAlign: "center",
        marginTop: 20,
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

export default AdminDashboard;
