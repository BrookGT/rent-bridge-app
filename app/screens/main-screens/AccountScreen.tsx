// screens/AccountScreen.tsx
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
} from "react-native";
import Colors from "../../../components/constants/Colors";
import { supabase } from "../../../utils/supabase";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
    PostHouse: undefined;
    HouseDetail: { houseId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Profile {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string;
}

interface House {
    id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
}

const AccountScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [postedHouses, setPostedHouses] = useState<House[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            setEmail(user.email);

            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("id, full_name, username, avatar_url")
                .eq("id", user.id)
                .single();

            if (profileError) {
                console.error("Error fetching profile:", profileError);
            } else {
                setProfile(profileData);
            }

            const { data: housesData, error: housesError } = await supabase
                .from("houses")
                .select("id, title, location, price, images")
                .eq("user_id", user.id);

            if (housesError) {
                console.error("Error fetching posted houses:", housesError);
            } else {
                setPostedHouses(housesData);
            }
        };

        fetchData();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    const renderHouseItem = ({ item }: { item: House }) => (
        <TouchableOpacity
            style={styles.houseCard}
            onPress={() =>
                navigation.navigate("HouseDetail", { houseId: item.id })
            }
        >
            <Image source={{ uri: item.images[0] }} style={styles.houseImage} />
            <View style={styles.houseInfo}>
                <Text style={styles.houseTitle}>{item.title}</Text>
                <Text style={styles.houseLocation}>{item.location}</Text>
                <Text style={styles.housePrice}>${item.price}/month</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.profileSection}>
                <Image
                    source={{
                        uri:
                            profile?.avatar_url ||
                            "https://via.placeholder.com/150",
                    }}
                    style={styles.avatar}
                />
                <Text style={styles.fullName}>
                    {profile?.full_name || "User"}
                </Text>
                <Text style={styles.username}>
                    @{profile?.username || "username"}
                </Text>
                <Text style={styles.email}>{email || "email@example.com"}</Text>
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.postButton}
                onPress={() => navigation.navigate("PostHouse")}
            >
                <Text style={styles.postButtonText}>Post a House</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Your Posted Houses</Text>
            <FlatList
                data={postedHouses}
                renderItem={renderHouseItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.houseList}
            />
            <TouchableOpacity
                style={styles.signOutButton}
                onPress={handleSignOut}
            >
                <Text style={styles.signOutButtonText}>Sign Out</Text>
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
    profileSection: {
        alignItems: "center",
        marginBottom: 30,
        backgroundColor: Colors.glassBackground,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    fullName: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.white,
    },
    username: {
        fontSize: 16,
        color: Colors.grayLight,
        marginVertical: 5,
    },
    email: {
        fontSize: 16,
        color: Colors.grayLight,
        marginBottom: 15,
    },
    editButton: {
        backgroundColor: Colors.glassBackground,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    editButtonText: {
        fontSize: 16,
        color: Colors.white,
    },
    postButton: {
        backgroundColor: Colors.secondary,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 20,
    },
    postButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.white,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: Colors.white,
        marginBottom: 15,
    },
    houseList: {
        paddingBottom: 20,
    },
    houseCard: {
        backgroundColor: Colors.glassBackground,
        borderRadius: 15,
        marginBottom: 15,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    houseImage: {
        width: "100%",
        height: 200,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    houseInfo: {
        padding: 15,
    },
    houseTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.white,
    },
    houseLocation: {
        fontSize: 14,
        color: Colors.grayLight,
        marginVertical: 5,
    },
    housePrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.secondary,
    },
    signOutButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 20,
    },
    signOutButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.white,
    },
});

export default AccountScreen;
