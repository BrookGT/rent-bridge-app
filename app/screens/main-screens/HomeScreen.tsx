// screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import Colors from "../../../components/constants/Colors";
import { supabase } from "../../../utils/supabase";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const { width } = Dimensions.get("window");

type RootStackParamList = {
    Houses: undefined;
    HouseDetail: { houseId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Profile {
    id: string;
    full_name: string;
    username: string;
}

interface House {
    id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
}

const HomeScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [featuredHouses, setFeaturedHouses] = useState<House[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
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

            // Fetch the profile
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("id, full_name, username")
                .eq("id", user.id)
                .single();

            if (profileError) {
                console.error("Error fetching profile:", profileError);
            } else {
                setProfile(profileData);
            }

            // Fetch featured houses (e.g., 3 most recent houses)
            const { data: housesData, error: housesError } = await supabase
                .from("houses")
                .select("id, title, location, price, images")
                .order("created_at", { ascending: false })
                .limit(3);

            if (housesError) {
                console.error("Error fetching houses:", housesError);
            } else {
                setFeaturedHouses(housesData);
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    const renderHouseItem = ({
        item,
        index,
    }: {
        item: House;
        index: number;
    }) => (
        <Animated.View entering={FadeInDown.delay(index * 200).duration(600)}>
            <TouchableOpacity
                style={styles.houseCard}
                onPress={() =>
                    navigation.navigate("HouseDetail", { houseId: item.id })
                }
            >
                <Image
                    source={{ uri: item.images[0] }}
                    style={styles.houseImage}
                />
                <View style={styles.houseInfo}>
                    <Text style={styles.houseTitle}>{item.title}</Text>
                    <Text style={styles.houseLocation}>{item.location}</Text>
                    <Text style={styles.housePrice}>${item.price}/month</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

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
            <View style={styles.container}>
                <Animated.View
                    entering={FadeInDown.duration(600)}
                    style={styles.header}
                >
                    <Text style={styles.welcomeText}>
                        Welcome, {profile?.full_name || "User"}!
                    </Text>
                    <Text style={styles.subText}>
                        Find your perfect home today
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={() => navigation.navigate("Houses")}
                    >
                        <Text style={styles.searchButtonText}>
                            Search Houses
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                <Text style={styles.sectionTitle}>Featured Houses</Text>
                <FlatList
                    data={featuredHouses}
                    renderItem={renderHouseItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.houseList}
                />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: "bold",
        color: Colors.white,
        textAlign: "center",
    },
    subText: {
        fontSize: 18,
        color: Colors.grayLight,
        marginTop: 10,
        textAlign: "center",
    },
    searchButton: {
        backgroundColor: Colors.secondary,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 30,
    },
    searchButtonText: {
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
        width: width * 0.7,
        backgroundColor: Colors.glassBackground,
        borderRadius: 15,
        marginRight: 15,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    houseImage: {
        width: "100%",
        height: 150,
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
        color: Colors.grayDark,
        marginVertical: 5,
    },
    housePrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.secondary,
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
