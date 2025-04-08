// screens/main-screens/PostHouseScreen.tsx
import React, { useState } from "react";
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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker } from "react-native-maps";
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
    const [location, setLocation] = useState("");
    const [latitude, setLatitude] = useState(37.78825);
    const [longitude, setLongitude] = useState(-122.4324);
    const [images, setImages] = useState<string[]>([]);

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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const { uri } = result.assets[0];
            const fileName = uri.split("/").pop();
            const fileType = fileName?.split(".").pop();
            const file = await fetch(uri)
                .then((res) => res.blob())
                .then(
                    (blob) =>
                        new File([blob], fileName || "image", {
                            type: `image/${fileType}`,
                        })
                );

            const { data, error } = await supabase.storage
                .from("house-images")
                .upload(`${Date.now()}-${fileName}`, file);

            if (error) {
                console.error("Error uploading image:", error);
                Alert.alert("Error", "Failed to upload image.");
            } else {
                const { data: publicUrlData } = supabase.storage
                    .from("house-images")
                    .getPublicUrl(data.path);
                setImages((prev) => [...prev, publicUrlData.publicUrl]);
            }
        }
    };

    const handleSubmit = async () => {
        if (
            !title ||
            !description ||
            !price ||
            !type ||
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
            type,
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
            setLocation("");
            setImages([]);
        }
    };

    const renderImageItem = ({ item }: { item: string }) => (
        <Image source={{ uri: item }} style={styles.uploadedImage} />
    );

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
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
                <TextInput
                    style={styles.input}
                    placeholder="Type (e.g., Apartment, Villa)"
                    placeholderTextColor={Colors.grayLight}
                    value={type}
                    onChangeText={setType}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Location (e.g., Downtown, City)"
                    placeholderTextColor={Colors.grayLight}
                    value={location}
                    onChangeText={setLocation}
                />
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude,
                        longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    onPress={(e) => {
                        setLatitude(e.nativeEvent.coordinate.latitude);
                        setLongitude(e.nativeEvent.coordinate.longitude);
                    }}
                >
                    <Marker coordinate={{ latitude, longitude }} />
                </MapView>
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
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Post House</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: Colors.black,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.black,
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
    map: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
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
        maxHeight: 120, // Limit the height of the image list
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
        marginBottom: 20, // Ensure there's space at the bottom
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.white,
    },
});

export default PostHouseScreen;
