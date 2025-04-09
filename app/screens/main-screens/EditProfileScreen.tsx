// screens/main-screens/EditProfileScreen.tsx
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../../components/constants/Colors";
import { supabase } from "../../../utils/supabase";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
    Account: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Profile {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string;
}

const EditProfileScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("profiles")
                .select("id, full_name, username, avatar_url")
                .eq("id", user.id)
                .single();

            if (error) {
                console.error("Error fetching profile:", error);
                Alert.alert("Error", "Failed to load profile.");
            } else {
                setProfile(data);
                setFullName(data.full_name || "");
                setUsername(data.username || "");
                setAvatarUrl(data.avatar_url || "");
            }
        };

        fetchProfile();
    }, []);

    const pickAvatar = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission denied",
                "We need permission to access your photos."
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const { uri } = result.assets[0];
            const fileName = uri.split("/").pop();
            const fileExt = fileName?.split(".").pop() || "jpg";
            const filePath = `avatars/${Date.now()}.${fileExt}`;

            try {
                const response = await fetch(uri);
                const blob = await response.blob();
                const file = new File([blob], filePath, {
                    type: `image/${fileExt}`,
                });

                const { data, error } = await supabase.storage
                    .from("avatars")
                    .upload(filePath, file);

                if (error) {
                    console.error("Supabase upload error:", error);
                    Alert.alert(
                        "Error",
                        `Failed to upload avatar: ${error.message}`
                    );
                    return;
                }

                const { data: publicUrlData } = supabase.storage
                    .from("avatars")
                    .getPublicUrl(filePath);

                if (!publicUrlData.publicUrl) {
                    Alert.alert("Error", "Failed to retrieve avatar URL.");
                    return;
                }

                setAvatarUrl(publicUrlData.publicUrl);
            } catch (err) {
                console.error("Unexpected error during avatar upload:", err);
                const errorMessage =
                    err instanceof Error ? err.message : "Unknown error";
                Alert.alert(
                    "Error",
                    `An unexpected error occurred: ${errorMessage}`
                );
            }
        }
    };

    const handleSave = async () => {
        if (!fullName || !username) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        setLoading(true);
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            Alert.alert("Error", "User not authenticated.");
            setLoading(false);
            return;
        }

        const { error } = await supabase
            .from("profiles")
            .update({
                full_name: fullName,
                username,
                avatar_url: avatarUrl,
            })
            .eq("id", user.id);

        if (error) {
            console.error("Error updating profile:", error);
            Alert.alert("Error", "Failed to update profile.");
        } else {
            Alert.alert("Success", "Profile updated successfully!", [
                {
                    text: "OK",
                    onPress: () => navigation.navigate("Account"),
                },
            ]);
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={pickAvatar}
                style={styles.avatarContainer}
            >
                <Image
                    source={{
                        uri: avatarUrl || "https://via.placeholder.com/150",
                    }}
                    style={styles.avatar}
                />
                <Text style={styles.changeAvatarText}>Change Avatar</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={Colors.grayLight}
                value={fullName}
                onChangeText={setFullName}
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={Colors.grayLight}
                value={username}
                onChangeText={setUsername}
            />
            <TouchableOpacity
                style={[styles.saveButton, loading && styles.disabledButton]}
                onPress={handleSave}
                disabled={loading}
            >
                <Text style={styles.saveButtonText}>
                    {loading ? "Saving..." : "Save Profile"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    changeAvatarText: {
        fontSize: 16,
        color: Colors.secondary,
    },
    input: {
        backgroundColor: Colors.glassBackground,
        color: Colors.white,
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: Colors.grayDark,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.white,
    },
});

export default EditProfileScreen;
