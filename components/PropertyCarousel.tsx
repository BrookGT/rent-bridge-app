// components/PropertyCarousel.tsx
import React, { useState, useRef, useEffect } from "react";
import {
    View,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Text,
} from "react-native";
import Colors from "./constants/Colors";
import { Property } from "../types/types";
import { PropertyCard } from "./PropertyCard";
import { supabase } from "../utils/supabase";

export const PropertyCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [properties, setProperties] = useState<Property[]>([]);
    const flatListRef = useRef<FlatList>(null);

    const screenWidth = Dimensions.get("window").width;

    useEffect(() => {
        const fetchProperties = async () => {
            const { data, error } = await supabase
                .from("houses")
                .select("id, title, location, price, images")
                .order("created_at", { ascending: false })
                .limit(10);

            if (error) {
                console.error("Error fetching properties:", error);
                return;
            }

            const mappedProperties: Property[] = data.map((house) => ({
                id: house.id,
                title: house.title,
                price: `$${house.price}/mo`,
                location: house.location,
                img: house.images[0] || "https://via.placeholder.com/600x400",
            }));

            setProperties(mappedProperties);
        };

        fetchProperties();
    }, []);

    const handleNext = () => {
        if (currentIndex < properties.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex - 1,
                animated: true,
            });
            setCurrentIndex(currentIndex - 1);
        }
    };

    const renderItem = ({ item, index }: { item: Property; index: number }) => {
        const isVisible = index >= currentIndex && index < currentIndex + 3;
        if (!isVisible) return null;

        const offset = (index - currentIndex) * 20; // Adjust offset for stacking
        const scale = 1 - (index - currentIndex) * 0.05; // Slightly scale down cards in the back

        return (
            <View
                style={[
                    styles.cardWrapper,
                    {
                        transform: [{ translateX: offset }, { scale: scale }],
                        zIndex: 100 - index, // Higher zIndex for cards in front
                    },
                ]}
            >
                <PropertyCard property={item} />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {properties.length > 0 ? (
                <>
                    <FlatList
                        ref={flatListRef}
                        data={properties}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={screenWidth - 40}
                        decelerationRate="fast"
                        pagingEnabled
                        onMomentumScrollEnd={(event) => {
                            const newIndex = Math.round(
                                event.nativeEvent.contentOffset.x /
                                    (screenWidth - 40)
                            );
                            setCurrentIndex(newIndex);
                        }}
                    />
                    <View style={styles.navigationButtons}>
                        <TouchableOpacity
                            onPress={handlePrev}
                            style={[
                                styles.navButton,
                                { opacity: currentIndex === 0 ? 0.5 : 1 },
                            ]}
                            disabled={currentIndex === 0}
                            accessibilityLabel="Previous property"
                        >
                            <Text style={styles.navButtonText}>{"<"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleNext}
                            style={[
                                styles.navButton,
                                {
                                    opacity:
                                        currentIndex === properties.length - 1
                                            ? 0.5
                                            : 1,
                                },
                            ]}
                            disabled={currentIndex === properties.length - 1}
                            accessibilityLabel="Next property"
                        >
                            <Text style={styles.navButtonText}>{">"}</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <Text style={styles.noPropertiesText}>
                    No properties available.
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    cardWrapper: {
        position: "absolute",
        width: Dimensions.get("window").width - 40,
    },
    navigationButtons: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    navButton: {
        width: 40,
        height: 40,
        backgroundColor: Colors.white,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10,
        elevation: 3,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    navButtonText: {
        fontSize: 20,
        color: Colors.grayMediumDark,
    },
    noPropertiesText: {
        fontSize: 16,
        color: Colors.white,
        textAlign: "center",
    },
});
