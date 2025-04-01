import React from "react";
import {
    View,
    StatusBar,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../constants/Colors";
import Button from "@/components/Buttons";

const WelcomeScreen = () => {
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
                        resizeMode="cover"
                    />
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <Button
                        title="Login"
                        onPress={() => console.log("Login Pressed")}
                        type="primary"
                    />
                    <Button
                        title="Register"
                        onPress={() => console.log("Register Pressed")}
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
        flex: 1,
        justifyContent: "center",
        width: "90%",
        height: 200,
        borderRadius: 20,
        marginVertical: 20,
    },
    featureImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
    },
});

export default WelcomeScreen;
