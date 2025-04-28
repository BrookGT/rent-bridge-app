// screens/HousesScreen.tsx
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Colors from "../../../components/constants/Colors";
import { supabase } from "../../../utils/supabase";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
    HouseDetail: { houseId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface House {
    id: string;
    title: string;
    location: string;
    price: number;
    type: string;
    images: string[];
}

const HousesScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [houses, setHouses] = useState<House[]>([]);
    const [filteredHouses, setFilteredHouses] = useState<House[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    useEffect(() => {
        const fetchHouses = async () => {
            const { data, error } = await supabase
                .from("houses")
                .select("id, title, location, price, type, images")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching houses:", error);
            } else {
                setHouses(data);
                setFilteredHouses(data);
            }
        };

        fetchHouses();
    }, []);

    useEffect(() => {
        let filtered = houses;

        if (searchQuery) {
            filtered = filtered.filter(
                (house) =>
                    house.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    house.location
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        if (typeFilter) {
            filtered = filtered.filter((house) => house.type === typeFilter);
        }

        if (locationFilter) {
            filtered = filtered.filter((house) =>
                house.location
                    .toLowerCase()
                    .includes(locationFilter.toLowerCase())
            );
        }

        setFilteredHouses(filtered);
    }, [searchQuery, typeFilter, locationFilter, houses]);

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
            <TextInput
                style={styles.searchBar}
                placeholder="Search houses..."
                placeholderTextColor={Colors.grayDark}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <View style={styles.filters}>
                <Picker
                    selectedValue={typeFilter}
                    onValueChange={(value) => setTypeFilter(value)}
                    style={styles.picker}
                >
                    <Picker.Item label="All Types" value="" />
                    <Picker.Item label="Apartment" value="Apartment" />
                    <Picker.Item label="Villa" value="Villa" />
                    <Picker.Item label="Condo" value="Condo" />
                </Picker>
                <TextInput
                    style={styles.locationFilter}
                    placeholder="Location..."
                    placeholderTextColor={Colors.grayDark}
                    value={locationFilter}
                    onChangeText={setLocationFilter}
                />
            </View>
            <FlatList
                data={filteredHouses}
                renderItem={renderHouseItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.houseList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.tealDark, // Changed to match the app's theme
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    searchBar: {
        backgroundColor: Colors.white, // Changed to white for better contrast
        color: Colors.black, // Text color changed to black
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Colors.grayMedium, // Adjusted border color for subtle contrast
    },
    filters: {
        flexDirection: "row",
        marginBottom: 15,
    },
    picker: {
        flex: 1,
        backgroundColor: Colors.white, // Changed to white for consistency
        color: Colors.black, // Text color changed to black
        borderRadius: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: Colors.grayMedium, // Adjusted border color
    },
    locationFilter: {
        flex: 1,
        backgroundColor: Colors.white, // Changed to white for consistency
        color: Colors.black, // Text color changed to black
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.grayMedium, // Adjusted border color
    },
    houseList: {
        paddingBottom: 20,
    },
    houseCard: {
        backgroundColor: Colors.white, // Changed to white for better readability
        borderRadius: 15,
        marginBottom: 15,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: Colors.grayMedium, // Adjusted border color
        shadowColor: Colors.black, // Added shadow for better card elevation
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
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
        color: Colors.tealDark, // Changed to tealDark for consistency
    },
    houseLocation: {
        fontSize: 14,
        color: Colors.grayMediumDark, // Adjusted to grayMediumDark for subtle contrast
        marginVertical: 5,
    },
    housePrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.secondary, // Kept secondary color for price
    },
});

export default HousesScreen;
