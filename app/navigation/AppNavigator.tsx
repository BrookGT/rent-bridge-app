// navigation/AppNavigator.tsx
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
    Welcome: undefined;
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
                    "help-circle-outline"; // Default icon
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
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: Colors.secondary,
            tabBarInactiveTintColor: Colors.grayLight,
            tabBarStyle: {
                backgroundColor: Colors.black,
                borderTopColor: Colors.grayLight,
                borderTopWidth: 1,
                paddingBottom: 5,
                paddingTop: 5,
            },
            headerShown: false,
        })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Houses" component={HousesScreen} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
        <Tab.Screen name="Chats" component={ChatScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
);

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
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                checkUserRole(session.user.id);
            }
            setInitializing(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                checkUserRole(session.user.id);
            } else {
                setIsAdmin(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkUserRole = async (userId: string) => {
        const { data, error } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", userId)
            .single();

        if (error) {
            console.error("Error fetching user role:", error);
            setIsAdmin(false);
        } else {
            setIsAdmin(data?.is_admin || false);
        }
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

    return (
        <ErrorBoundary>
            <Stack.Navigator
                initialRouteName={
                    session ? (isAdmin ? "AdminDashboard" : "Main") : "Welcome"
                }
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
                {session ? (
                    <>
                        {isAdmin ? (
                            <Stack.Screen
                                name="AdminDashboard"
                                component={AdminDashboard}
                                options={{
                                    title: "Admin Dashboard",
                                    headerLeft: () => null,
                                }}
                            />
                        ) : (
                            <>
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
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="Welcome"
                            component={WelcomeScreen}
                            options={{ headerShown: false }}
                        />
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
                    </>
                )}
            </Stack.Navigator>
        </ErrorBoundary>
    );
}
