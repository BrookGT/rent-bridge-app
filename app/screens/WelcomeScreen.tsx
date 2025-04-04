import React from "react";
import {
    View,
    StatusBar,
    Image,
    Text,
    StyleSheet,
    Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../components/constants/Colors";
import Button from "@/components/Buttons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define navigation types
type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
};

type WelcomeScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "Welcome"
>;

const { width, height } = Dimensions.get("window"); // Get screen dimensions

const WelcomeScreen = () => {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={Colors.black}
                translucent
            />

            {/* Gradient Background */}
            <LinearGradient
                colors={[Colors.primary, Colors.black]}
                style={styles.background}
            >
                <View style={styles.content}>
                    {/* Logo & Title */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={require("../../assets/images/imagelogo.png")}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.rentText}>RENTING</Text>
                    </View>
                    <Text style={styles.welcomeText}>
                        Welcome to RENT-BRIDGE
                        {"\n"}Find your dream home with us!
                    </Text>
                </View>

                {/* Image Section */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require("../../assets/images/pngwing.com (21).png")}
                        style={styles.featureImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <Button
                        title="Login"
                        onPress={() => navigation.navigate("Login")}
                        type="primary"
                    />
                    <Button
                        title="Register"
                        onPress={() => navigation.navigate("Register")}
                        type="secondary"
                    />
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 50,
    },
    content: {
        alignItems: "center",
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    logo: {
        width: 120,
        height: 120,
    },
    rentText: {
        fontSize: 32,
        fontWeight: "bold",
        color: Colors.white,
        marginTop: -10,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: "bold",
        color: Colors.text,
        textAlign: "center",
    },
    imageContainer: {
        flex: 1, // Allows it to grow but not take over completely
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        maxHeight: height * 0.4, // Limits the height so buttons always have space
    },
    featureImage: {
        width: "100%",
        height: "100%",
    },
    buttonContainer: {
        width: "90%", // Ensures the buttons take up 90% of the screen width
        alignSelf: "center", // Centers the container horizontally
        marginBottom: 30, // Keeps the buttons near the bottom
        alignItems: "center", // Centers the buttons inside the container horizontally
    },
});

export default WelcomeScreen;
