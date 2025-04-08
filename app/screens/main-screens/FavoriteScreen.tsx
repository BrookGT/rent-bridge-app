// screens/FavoritesScreen.tsx
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from "react-native";
import Colors from "../../../components/constants/Colors";
import { supabase } from "../../../utils/supabase";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
    HouseDetail: { houseId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Favorite {
    house: {
        id: string;
        title: string;
        location: string;
        price: number;
        images: string[];
    };
}

const FavoritesScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [favorites, setFavorites] = useState<Favorite[]>([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("favorites")
                .select("house:house_id (id, title, location, price, images)")
                .eq("user_id", user.id);

            if (error) {
                console.error("Error fetching favorites:", error);
            } else {
                setFavorites(
                    data.map((item: any) => ({
                        house: {
                            id: item.house.id,
                            title: item.house.title,
                            location: item.house.location,
                            price: item.house.price,
                            images: item.house.images,
                        },
                    }))
                );
            }
        };

        fetchFavorites();
    }, []);

    const renderFavoriteItem = ({ item }: { item: Favorite }) => (
        <TouchableOpacity
            style={styles.favoriteCard}
            onPress={() =>
                navigation.navigate("HouseDetail", { houseId: item.house.id })
            }
        >
            <Image
                source={{ uri: item.house.images[0] }}
                style={styles.favoriteImage}
            />
            <View style={styles.favoriteInfo}>
                <Text style={styles.favoriteTitle}>{item.house.title}</Text>
                <Text style={styles.favoriteLocation}>
                    {item.house.location}
                </Text>
                <Text style={styles.favoritePrice}>
                    ${item.house.price}/month
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Favorites</Text>
            <FlatList
                data={favorites}
                renderItem={renderFavoriteItem}
                keyExtractor={(item) => item.house.id}
                contentContainerStyle={styles.favoriteList}
            />
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
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.white,
        marginBottom: 20,
    },
    favoriteList: {
        paddingBottom: 20,
    },
    favoriteCard: {
        backgroundColor: Colors.glassBackground,
        borderRadius: 15,
        marginBottom: 15,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    favoriteImage: {
        width: "100%",
        height: 200,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    favoriteInfo: {
        padding: 15,
    },
    favoriteTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.white,
    },
    favoriteLocation: {
        fontSize: 14,
        color: Colors.grayDark,
        marginVertical: 5,
    },
    favoritePrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.secondary,
    },
});

export default FavoritesScreen;
