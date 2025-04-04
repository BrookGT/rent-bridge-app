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
import Button from "@/components/Buttons/Buttons";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import BackButton from "@/components/Buttons/BackButton";

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
                {/* Add the BackButton component */}
                <BackButton />

                <View style={styles.content}>
                    {/* Logo & Title */}
                    <LottieView
                        source={require("../../assets/animations/animation_3.json")}
                        autoPlay
                        loop
                        style={styles.logo}
                    />

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
        width: 300,
        height: 100,
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
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    featureImage: {
        width: "100%",
        height: "100%",
    },
    buttonContainer: {
        width: "90%",
        alignSelf: "center",
        marginBottom: 30,
        alignItems: "center",
    },
});

export default WelcomeScreen;
