// screens/main-screens/HomeScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    StatusBar,
    Image,
    Dimensions,
} from "react-native";
import Animated, {
    FadeInDown,
    SlideInRight,
    SlideInLeft,
} from "react-native-reanimated";
import Colors from "../../../components/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/utils/supabase";

type RootStackParamList = {
    Houses: undefined;
    Account: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface FeatureCard {
    id: string;
    title: string;
    description: string;
    image: any;
}

const features: FeatureCard[] = [
    {
        id: "1",
        title: "Find Your Dream Home",
        description:
            "Browse thousands of listings with high-quality photos and virtual tours",
        image: require("../../../assets/images/roberto unsplash.jpg"),
    },
    {
        id: "2",
        title: "Smart Search Filters",
        description:
            "Filter by price, location, amenities, and more to find exactly what you need",
        image: require("../../../assets/images/unsplash.jpg"),
    },
    {
        id: "3",
        title: "Post Listings Easily",
        description:
            "List your property in minutes with our simple submission process",
        image: require("../../../assets/images/brian-unsplash.jpg"),
    },
];

const HomeScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userName, setUserName] = useState<string | null>(null);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError) {
                    console.error("Error fetching user:", userError);
                    return;
                }

                if (user) {
                    const { data: profile, error: profileError } =
                        await supabase
                            .from("profiles")
                            .select("full_name")
                            .eq("id", user.id)
                            .single();

                    if (profileError) {
                        console.error("Error fetching profile:", profileError);
                    } else if (profile?.full_name) {
                        console.log("Fetched full_name:", profile.full_name);
                        setUserName(profile.full_name); // Set the user's name
                    } else {
                        console.warn("No full_name found for user.");
                    }
                }
            } catch (error) {
                console.error("Unexpected error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const newIndex = (currentIndex + 1) % features.length;
            setCurrentIndex(newIndex);
            flatListRef.current?.scrollToIndex({
                index: newIndex,
                animated: true,
            });
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [currentIndex]);

    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / (width * 0.8));
        if (index !== currentIndex) {
            setCurrentIndex(index % features.length);
        }
    };

    const handleSearchHouses = () => {
        navigation.navigate("Houses");
    };
    const handlePostHouses = () => {
        navigation.navigate("Account");
    };

    return (
        <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            style={styles.container}
        >
            <StatusBar
                barStyle="light-content"
                backgroundColor={Colors.homeScreenBackground}
                translucent
            />

            <Animated.View
                entering={FadeInDown.duration(600)}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>
                    Welcome, {userName || "User"}!
                </Text>
                <Text style={styles.headerSubtitle}>
                    Your journey to perfect housing starts here
                </Text>
            </Animated.View>

            <FlatList
                ref={flatListRef}
                data={features}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <Animated.View
                        entering={index % 2 === 0 ? SlideInRight : SlideInLeft}
                        style={styles.featureCard}
                    >
                        <Image
                            source={item.image}
                            style={styles.featureImage}
                        />
                        <LinearGradient
                            colors={["transparent", "rgba(0,0,0,0.8)"]}
                            style={styles.imageOverlay}
                        />
                        <View style={styles.featureContent}>
                            <Text style={styles.featureTitle}>
                                {item.title}
                            </Text>
                            <Text style={styles.featureDescription}>
                                {item.description}
                            </Text>
                        </View>
                    </Animated.View>
                )}
                contentContainerStyle={styles.carouselContainer}
                getItemLayout={(data, index) => ({
                    length: width * 0.8,
                    offset: width * 0.8 * index,
                    index,
                })}
            />

            <View style={styles.pagination}>
                {features.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index && styles.activeDot,
                        ]}
                    />
                ))}
            </View>

            <Animated.View
                entering={SlideInRight.delay(300)}
                style={[
                    styles.buttonContainer,
                    { marginBottom: 20 + insets.bottom },
                ]}
            >
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleSearchHouses}
                >
                    <Text style={styles.buttonText}>Start Searching</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handlePostHouses}
                >
                    <Text style={styles.buttonText}>List Your Property</Text>
                </TouchableOpacity>
            </Animated.View>
        </LinearGradient>
    );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight || 40,
    },
    header: {
        padding: 20,
        alignItems: "center",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "800",
        color: Colors.white,
        textAlign: "center",
        textShadowColor: "rgba(0,0,0,0.2)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    headerSubtitle: {
        fontSize: 18,
        color: Colors.white,
        marginTop: 10,
        textAlign: "center",
    },
    carouselContainer: {
        paddingHorizontal: 20,
    },
    featureCard: {
        width: width * 0.8,
        height: height * 0.433,
        borderRadius: 25,
        marginHorizontal: 10,
        overflow: "hidden",
        backgroundColor: Colors.white,
        elevation: 10,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    featureImage: {
        width: "100%",
        height: "100%",
        position: "absolute",
        borderRadius: 25,
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
    },
    featureContent: {
        padding: 25,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    featureTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: Colors.white,
        marginBottom: 10,
    },
    featureDescription: {
        fontSize: 16,
        color: Colors.white,
        lineHeight: 22,
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 20,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "rgba(255,255,255,0.4)",
        marginHorizontal: 5,
    },
    activeDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.white,
        marginHorizontal: 5,
    },
    buttonContainer: {
        paddingHorizontal: 30,
    },
    primaryButton: {
        backgroundColor: Colors.white,
        padding: 18,
        borderRadius: 15,
        alignItems: "center",
        marginBottom: 15,
        elevation: 5,
    },
    secondaryButton: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: Colors.white,
        padding: 18,
        borderRadius: 15,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.primary,
    },
});

export default HomeScreen;
