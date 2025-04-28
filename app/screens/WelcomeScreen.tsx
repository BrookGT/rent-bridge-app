import React, { useEffect } from "react";
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
import { Session } from "@supabase/supabase-js";

// Define navigation types
type RootStackParamList = {
    Welcome: { session: Session | null; isAdmin: boolean };
    Login: undefined;
    Register: undefined;
    Main: undefined;
    AdminDashboard: undefined;
};

type WelcomeScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "Welcome"
>;

const { width, height } = Dimensions.get("window");

interface WelcomeScreenProps {
    session: Session | null;
    isAdmin: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ session, isAdmin }) => {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();

    // Automatically navigate based on authentication status
    useEffect(() => {
        if (session) {
            if (isAdmin) {
                navigation.replace("AdminDashboard");
            } else {
                navigation.replace("Main"); // Navigates to the tab navigator (HomeScreen)
            }
        }
    }, [session, isAdmin, navigation]);

    // Render nothing or a loading state while navigating
    if (session) {
        return null; // Prevents flashing of WelcomeScreen during navigation
    }

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
                    <LottieView
                        source={require("../../assets/animations/animation_3.json")}
                        autoPlay
                        loop
                        style={styles.logo}
                    />

                    <Text style={styles.welcomeText}>
                        Welcome to Easy Rent
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
    logo: {
        width: 300,
        height: 150,
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
