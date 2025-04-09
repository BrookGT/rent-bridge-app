// screens/main-screens/PostHouseScreen.tsx
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    FlatList,
    Alert,
    ScrollView,
    Modal,
    SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { Picker } from "@react-native-picker/picker";
import Colors from "../../../components/constants/Colors";
import { supabase } from "../../../utils/supabase";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
    PostHouse: undefined;
    Account: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const PostHouseScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [type, setType] = useState("");
    const [customType, setCustomType] = useState("");
    const [showCustomTypeInput, setShowCustomTypeInput] = useState(false);
    const [location, setLocation] = useState("");
    const [latitude, setLatitude] = useState(9.03); // Addis Ababa, Ethiopia
    const [longitude, setLongitude] = useState(38.74); // Addis Ababa, Ethiopia
    const [images, setImages] = useState<string[]>([]);
    const [isMapModalVisible, setIsMapModalVisible] = useState(false);
    const [tempLatitude, setTempLatitude] = useState(9.03);
    const [tempLongitude, setTempLongitude] = useState(38.74);

    const houseTypes = [
        "Apartment",
        "Villa",
        "Condo",
        "Townhouse",
        "Studio",
        "Other",
    ];

    // Request location permissions and fetch current location
    const useCurrentLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission denied",
                "We need permission to access your location."
            );
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
        setTempLatitude(location.coords.latitude);
        setTempLongitude(location.coords.longitude);
        setLocation("Current Location");
    };

    const pickImage = async () => {
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
            quality: 1,
        });

        if (!result.canceled) {
            const { uri } = result.assets[0];
            const fileName = uri.split("/").pop();
            const fileExt = fileName?.split(".").pop() || "jpg";
            const filePath = `${Date.now()}.${fileExt}`;

            try {
                // Create a file object for Supabase
                const response = await fetch(uri);
                const blob = await response.blob();
                const file = new File([blob], filePath, {
                    type: `image/${fileExt}`,
                });

                // Upload to Supabase storage
                const { data, error } = await supabase.storage
                    .from("house-images")
                    .upload(filePath, file);

                if (error) {
                    console.error("Supabase upload error:", error);
                    Alert.alert(
                        "Error",
                        `Failed to upload image: ${error.message}`
                    );
                    return;
                }

                // Get the public URL
                const { data: publicUrlData } = supabase.storage
                    .from("house-images")
                    .getPublicUrl(filePath);

                if (!publicUrlData.publicUrl) {
                    console.error("Failed to get public URL");
                    Alert.alert("Error", "Failed to retrieve image URL.");
                    return;
                }

                setImages((prev) => [...prev, publicUrlData.publicUrl]);
                Alert.alert("Success", "Image uploaded successfully!");
            } catch (err) {
                console.error("Unexpected error during image upload:", err);
                Alert.alert(
                    "Error",
                    `An unexpected error occurred: ${(err as Error).message}`
                );
            }
        }
    };

    const handleSubmit = async () => {
        const finalType = type === "Other" ? customType : type;
        if (
            !title ||
            !description ||
            !price ||
            !finalType ||
            !location ||
            images.length === 0
        ) {
            Alert.alert(
                "Error",
                "Please fill in all fields and upload at least one image."
            );
            return;
        }

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            Alert.alert("Error", "User not authenticated. Please log in.");
            return;
        }

        const { error } = await supabase.from("houses").insert({
            user_id: user.id,
            title,
            description,
            price: parseFloat(price),
            type: finalType,
            location,
            latitude,
            longitude,
            images,
        });

        if (error) {
            console.error("Error posting house:", error);
            Alert.alert("Error", "Failed to post house.");
        } else {
            Alert.alert("Success", "House posted successfully!", [
                {
                    text: "OK",
                    onPress: () => navigation.navigate("Account"),
                },
            ]);
            // Reset form
            setTitle("");
            setDescription("");
            setPrice("");
            setType("");
            setCustomType("");
            setShowCustomTypeInput(false);
            setLocation("");
            setImages([]);
        }
    };

    const openMapModal = () => {
        setTempLatitude(latitude);
        setTempLongitude(longitude);
        setIsMapModalVisible(true);
    };

    const saveLocation = () => {
        setLatitude(tempLatitude);
        setLongitude(tempLongitude);
        setIsMapModalVisible(false);
        if (location !== "Current Location") {
            setLocation("Selected Location");
        }
    };

    const renderImageItem = ({ item }: { item: string }) => (
        <Image source={{ uri: item }} style={styles.uploadedImage} />
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    placeholderTextColor={Colors.grayLight}
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={[styles.input, { height: 100 }]}
                    placeholder="Description"
                    placeholderTextColor={Colors.grayLight}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />
                <TextInput
                    style={styles.input}
                    placeholder="Price ($/month)"
                    placeholderTextColor={Colors.grayLight}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={type}
                        onValueChange={(itemValue) => {
                            setType(itemValue);
                            setShowCustomTypeInput(itemValue === "Other");
                        }}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        <Picker.Item label="Select Type" value="" />
                        {houseTypes.map((houseType) => (
                            <Picker.Item
                                key={houseType}
                                label={houseType}
                                value={houseType}
                            />
                        ))}
                    </Picker>
                </View>
                {showCustomTypeInput && (
                    <TextInput
                        style={styles.input}
                        placeholder="Enter custom type"
                        placeholderTextColor={Colors.grayLight}
                        value={customType}
                        onChangeText={setCustomType}
                    />
                )}
                <TextInput
                    style={styles.input}
                    placeholder="Location (e.g., Downtown, City)"
                    placeholderTextColor={Colors.grayLight}
                    value={location}
                    onChangeText={setLocation}
                />
                <TouchableOpacity
                    style={styles.locationButton}
                    onPress={useCurrentLocation}
                >
                    <Text style={styles.locationButtonText}>
                        Use Current Location
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.locationButton}
                    onPress={openMapModal}
                >
                    <Text style={styles.locationButtonText}>
                        Select Location on Map
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={pickImage}
                >
                    <Text style={styles.uploadButtonText}>Upload Images</Text>
                </TouchableOpacity>
                {images.length === 0 ? (
                    <Text style={styles.noImagesText}>
                        No images uploaded yet.
                    </Text>
                ) : (
                    <FlatList
                        data={images}
                        renderItem={renderImageItem}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        style={styles.imageList}
                    />
                )}
                <View style={styles.bottomPadding} />
            </ScrollView>

            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
            >
                <Text style={styles.submitButtonText}>Post House</Text>
            </TouchableOpacity>

            <Modal
                visible={isMapModalVisible}
                animationType="slide"
                onRequestClose={() => setIsMapModalVisible(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <MapView
                        style={styles.fullScreenMap}
                        initialRegion={{
                            latitude: tempLatitude,
                            longitude: tempLongitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        onPress={(e) => {
                            setTempLatitude(e.nativeEvent.coordinate.latitude);
                            setTempLongitude(
                                e.nativeEvent.coordinate.longitude
                            );
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: tempLatitude,
                                longitude: tempLongitude,
                            }}
                        />
                    </MapView>
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.saveButton]}
                            onPress={saveLocation}
                        >
                            <Text style={styles.modalButtonText}>
                                Save Location
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={() => setIsMapModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 20,
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
    pickerContainer: {
        backgroundColor: Colors.glassBackground,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    picker: {
        color: Colors.white,
    },
    pickerItem: {
        color: Colors.white,
        backgroundColor: Colors.black,
    },
    locationButton: {
        backgroundColor: Colors.secondary,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
    },
    locationButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.white,
    },
    uploadButton: {
        backgroundColor: Colors.secondary,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
    },
    uploadButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.white,
    },
    imageList: {
        marginBottom: 15,
        maxHeight: 120,
    },
    uploadedImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
    },
    noImagesText: {
        color: Colors.grayLight,
        fontSize: 16,
        textAlign: "center",
        marginBottom: 15,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 20,
        marginBottom: 20,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.white,
    },
    bottomPadding: {
        height: 80,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    fullScreenMap: {
        flex: 1,
    },
    modalButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 20,
        backgroundColor: Colors.black,
    },
    modalButton: {
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        width: "45%",
    },
    saveButton: {
        backgroundColor: Colors.primary,
    },
    cancelButton: {
        backgroundColor: Colors.grayLight,
    },
    modalButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.white,
    },
});

export default PostHouseScreen;
