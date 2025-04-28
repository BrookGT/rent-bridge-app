// components/SearchModal.tsx
import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from "react-native";
import Colors from "./constants/Colors";
import { Property } from "../types/types";
import { supabase } from "../utils/supabase";
import { PropertyCard } from "./PropertyCard";

interface SearchModalProps {
    visible: boolean;
    onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
    visible,
    onClose,
}) => {
    const [location, setLocation] = useState("");
    const [type, setType] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [searchResults, setSearchResults] = useState<Property[]>([]);

    const handleSearch = async () => {
        let query = supabase
            .from("houses")
            .select("id, title, location, price, images");

        if (location) {
            query = query.ilike("location", `%${location}%`);
        }
        if (type) {
            query = query.eq("type", type);
        }
        if (priceRange) {
            const [minPrice, maxPrice] = priceRange.split("-").map(Number);
            if (minPrice) query = query.gte("price", minPrice);
            if (maxPrice) query = query.lte("price", maxPrice);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error searching houses:", error);
            return;
        }

        const mappedResults: Property[] = data.map((house) => ({
            id: house.id,
            title: house.title,
            price: `$${house.price}/mo`,
            location: house.location,
            img: house.images[0] || "https://via.placeholder.com/600x400",
        }));

        setSearchResults(mappedResults);
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Search Houses</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Location (e.g., Downtown)"
                    placeholderTextColor={Colors.grayMediumDark}
                    value={location}
                    onChangeText={setLocation}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Type (e.g., Apartment)"
                    placeholderTextColor={Colors.grayMediumDark}
                    value={type}
                    onChangeText={setType}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Price Range (e.g., 1000-2000)"
                    placeholderTextColor={Colors.grayMediumDark}
                    value={priceRange}
                    onChangeText={setPriceRange}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                >
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
                <FlatList
                    data={searchResults}
                    renderItem={({ item }) => <PropertyCard property={item} />}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.resultsList}
                    ListEmptyComponent={
                        <Text style={styles.noResultsText}>
                            No results found.
                        </Text>
                    }
                />
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.background, // Light background to match Figma theme
        padding: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.tealDark,
        marginBottom: 20,
    },
    input: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grayLight,
        borderRadius: 10,
        padding: 15,
        color: Colors.textDark,
        marginBottom: 15,
    },
    searchButton: {
        backgroundColor: Colors.goldenrodDark,
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20,
    },
    searchButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: "bold",
    },
    resultsList: {
        paddingBottom: 20,
    },
    noResultsText: {
        fontSize: 16,
        color: Colors.grayMediumDark,
        textAlign: "center",
    },
    closeButton: {
        backgroundColor: Colors.grayMedium,
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    closeButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: "bold",
    },
});
