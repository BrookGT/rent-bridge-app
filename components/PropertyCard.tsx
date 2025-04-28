// components/PropertyCard.tsx
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "./constants/Colors";
import { Property } from "../types/types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
    HouseDetail: { houseId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface PropertyCardProps {
    property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <TouchableOpacity
            style={styles.container}
            accessible={true}
            onPress={() =>
                navigation.navigate("HouseDetail", { houseId: property.id })
            }
        >
            <Image
                source={{ uri: property.img }}
                style={styles.image}
                accessibilityLabel={`Image of ${property.title}`}
            />
            <View style={styles.content}>
                <Text style={styles.title}>{property.title}</Text>
                <Text style={styles.price}>{property.price}</Text>
                <Text style={styles.location}>{property.location}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%", // Full width of the parent (adjusted in PropertyCarousel)
        backgroundColor: Colors.white, // White background as per Figma
        borderRadius: 12,
        overflow: "hidden",
        elevation: 3,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    image: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.tealDark, // Matches Figma
        marginBottom: 8,
    },
    price: {
        fontSize: 16,
        color: Colors.tealMedium, // Matches Figma
        marginBottom: 4,
    },
    location: {
        fontSize: 14,
        color: Colors.grayMediumDark, // Matches Figma
    },
});
