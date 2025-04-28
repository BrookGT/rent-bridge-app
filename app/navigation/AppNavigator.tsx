import React, { useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Session } from "@supabase/supabase-js";
import Colors from "../../components/constants/Colors";
import { supabase } from "../../utils/supabase";

// Auth Screens
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/auth-screens/LoginScreen";
import RegisterScreen from "../screens/auth-screens/RegisterScreen";
import ResetPasswordScreen from "../screens/auth-screens/ResetPasswordScreen";

// Main Screens
import HomeScreen from "../screens/main-screens/HomeScreen";
import HousesScreen from "../screens/main-screens/HousesScreen";
import HouseDetailScreen from "../screens/main-screens/HouseDetailScreen";
import ChatScreen from "../screens/main-screens/ChatScreen";
import FavoritesScreen from "../screens/main-screens/FavoriteScreen";
import AccountScreen from "../screens/main-screens/AccountScreen";
import PostHouseScreen from "../screens/main-screens/PostHouseScreen";

// Admin Screen
import AdminDashboard from "../screens/AdminDashboard";

type RootStackParamList = {
    Welcome: { session: Session | null; isAdmin: boolean };
    Login: undefined;
    Register: undefined;
    Main: undefined;
    HouseDetail: { houseId: string };
    Chat: { houseId: string; renterId: string };
    PostHouse: undefined;
    AdminDashboard: undefined;
    ResetPassword: { email?: string };
};

type MainTabParamList = {
    Home: undefined;
    Houses: undefined;
    Favorites: undefined;
    Chats: undefined;
    Account: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap =
                    "help-circle-outline";
                if (route.name === "Home") {
                    iconName = focused ? "home" : "home-outline";
                } else if (route.name === "Houses") {
                    iconName = focused ? "search" : "search-outline";
                } else if (route.name === "Favorites") {
                    iconName = focused ? "heart" : "heart-outline";
                } else if (route.name === "Chats") {
                    iconName = focused ? "chatbubbles" : "chatbubbles-outline";
                } else if (route.name === "Account") {
                    iconName = focused ? "person" : "person-outline";
                }

                if (focused) {
                    return (
                        <View
                            style={[
                                styles.iconContainer,
                                styles.iconContainerActive,
                            ]}
                        >
                            <Ionicons
                                name={iconName}
                                size={28}
                                color={Colors.white}
                            />
                        </View>
                    );
                }

                return (
                    <Ionicons
                        name={iconName}
                        size={28}
                        color={Colors.grayMediumDark}
                    />
                );
            },
            tabBarActiveTintColor: Colors.tealDark,
            tabBarInactiveTintColor: Colors.grayMediumDark,
            tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
            tabBarStyle: {
                backgroundColor: Colors.white,
                paddingBottom: 5,
                paddingTop: 5,
                height: 70,
            },
            headerShown: false,
        })}
    >
        <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ tabBarLabel: "Home" }}
        />
        <Tab.Screen
            name="Houses"
            component={HousesScreen}
            options={{ tabBarLabel: "Search" }}
        />
        <Tab.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{ tabBarLabel: "Favorites" }}
        />
        <Tab.Screen
            name="Chats"
            component={ChatScreen}
            options={{ tabBarLabel: "Chat" }}
        />
        <Tab.Screen
            name="Account"
            component={AccountScreen}
            options={{ tabBarLabel: "Account" }}
        />
    </Tab.Navigator>
);

import { ViewStyle } from "react-native";

const styles = {
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.white,
        justifyContent: "center" as ViewStyle["justifyContent"],
        alignItems: "center" as ViewStyle["alignItems"],
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconContainerActive: {
        borderWidth: 2,
        borderColor: Colors.tealDark,
        backgroundColor: Colors.tealDark,
        marginBottom: 5,
    },
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
    state: { hasError: boolean; error: Error | null } = {
        hasError: false,
        error: null,
    };

    static getDerivedStateFromError(error: Error): {
        hasError: boolean;
        error: Error;
    } {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Colors.black,
                    }}
                >
                    <Text style={{ color: Colors.white, fontSize: 18 }}>
                        Something went wrong: {this.state.error?.toString()}
                    </Text>
                </View>
            );
        }
        return this.props.children;
    }
}

export default function AppNavigator() {
    const [session, setSession] = useState<Session | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        // Use onAuthStateChange as the single source of truth
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("Auth state changed:", session);
            setSession(session);
            if (session) {
                checkUserRole(session.user.id);
            } else {
                setIsAdmin(false);
                setInitializing(false); // Auth state resolved
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkUserRole = async (userId: string) => {
        console.log("Checking user role for ID:", userId);
        const { data, error } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", userId)
            .single();

        if (error) {
            console.error("Error fetching user role:", error);
            setIsAdmin(false);
        } else {
            console.log("User role:", data?.is_admin);
            setIsAdmin(data?.is_admin || false);
        }
        setInitializing(false); // Auth state resolved
    };

    if (initializing) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: Colors.black,
                }}
            >
                <Text style={{ color: Colors.white, fontSize: 18 }}>
                    Loading...
                </Text>
            </View>
        );
    }

    // Dynamically set initial route based on session and isAdmin
    const initialRoute = session
        ? isAdmin
            ? "AdminDashboard"
            : "Main"
        : "Welcome";

    return (
        <ErrorBoundary>
            <Stack.Navigator
                initialRouteName={initialRoute}
                screenOptions={{
                    headerStyle: { backgroundColor: Colors.black },
                    headerTintColor: Colors.white,
                    headerTitleStyle: { fontWeight: "bold" },
                    gestureEnabled: Platform.OS !== "web",
                    cardStyleInterpolator: ({ current, layouts }) => ({
                        cardStyle: {
                            transform: [
                                {
                                    translateX: current.progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [layouts.screen.width, 0],
                                    }),
                                },
                            ],
                        },
                    }),
                }}
            >
                <Stack.Screen name="Welcome" options={{ headerShown: false }}>
                    {(props) => (
                        <WelcomeScreen
                            {...props}
                            session={session}
                            isAdmin={isAdmin}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ title: "Login" }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ title: "Register" }}
                />
                <Stack.Screen
                    name="ResetPassword"
                    component={ResetPasswordScreen}
                    options={{ title: "Reset Password" }}
                />
                <Stack.Screen
                    name="Main"
                    component={MainTabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="HouseDetail"
                    component={HouseDetailScreen}
                    options={{ title: "House Details" }}
                />
                <Stack.Screen
                    name="Chat"
                    component={ChatScreen}
                    options={{ title: "Chat" }}
                />
                <Stack.Screen
                    name="PostHouse"
                    component={PostHouseScreen}
                    options={{ title: "Post a House" }}
                />
                <Stack.Screen
                    name="AdminDashboard"
                    component={AdminDashboard}
                    options={{
                        title: "Admin Dashboard",
                        headerLeft: () => null,
                    }}
                />
            </Stack.Navigator>
        </ErrorBoundary>
    );
}
