// screens/HouseDetailScreen.tsx
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Colors from "../../../components/constants/Colors";
import { supabase } from "../../../utils/supabase";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const { width } = Dimensions.get("window");

type RootStackParamList = {
    Chat: { houseId: string; renterId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface House {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    type: string;
    latitude: number;
    longitude: number;
    images: string[];
    user_id: string;
}

const HouseDetailScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();
    const { houseId } = route.params as { houseId: string };
    const [house, setHouse] = useState<House | null>(null);

    useEffect(() => {
        const fetchHouse = async () => {
            const { data, error } = await supabase
                .from("houses")
                .select("*")
                .eq("id", houseId)
                .single();

            if (error) {
                console.error("Error fetching house:", error);
            } else {
                setHouse(data);
            }
        };

        fetchHouse();
    }, [houseId]);

    const handleContact = async () => {
        if (!house) return;

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Create or get a conversation
        const { data: conversation, error } = await supabase
            .from("conversations")
            .select("id")
            .eq("house_id", house.id)
            .eq("renter_id", house.user_id)
            .eq("borrower_id", user.id)
            .single();

        let conversationId;
        if (error || !conversation) {
            const { data: newConversation, error: insertError } = await supabase
                .from("conversations")
                .insert({
                    house_id: house.id,
                    renter_id: house.user_id,
                    borrower_id: user.id,
                })
                .select("id")
                .single();

            if (insertError) {
                console.error("Error creating conversation:", insertError);
                return;
            }
            conversationId = newConversation.id;
        } else {
            conversationId = conversation.id;
        }

        navigation.navigate("Chat", {
            houseId: house.id,
            renterId: house.user_id,
        });
    };

    if (!house) {
        return (
            <View style={styles.loading}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={house.images}
                renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={styles.image} />
                )}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
            />
            <View style={styles.content}>
                <Text style={styles.title}>{house.title}</Text>
                <Text style={styles.location}>{house.location}</Text>
                <Text style={styles.price}>${house.price}/month</Text>
                <Text style={styles.description}>{house.description}</Text>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: house.latitude,
                        longitude: house.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: house.latitude,
                            longitude: house.longitude,
                        }}
                    />
                </MapView>
                <TouchableOpacity
                    style={styles.contactButton}
                    onPress={handleContact}
                >
                    <Text style={styles.contactButtonText}>Contact Renter</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    image: {
        width: width,
        height: 300,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.white,
        marginBottom: 10,
    },
    location: {
        fontSize: 16,
        color: Colors.grayLight,
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.secondary,
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: Colors.white,
        marginBottom: 20,
    },
    map: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    contactButton: {
        backgroundColor: Colors.secondary,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    contactButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.white,
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

export default HouseDetailScreen;
