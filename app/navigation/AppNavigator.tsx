import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform } from "react-native";
import { supabase } from "../../utils/supabase";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import AdminDashboard from "../screens/AdminDashboard";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import { Session } from "@supabase/supabase-js";

type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    Home: undefined;
    AdminDashboard: undefined;
    ResetPassword: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const [session, setSession] = useState<Session | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        // Check the current session on app start
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                checkUserRole(session.user.id);
            }
            setInitializing(false);
        });

        // Listen for auth state changes
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
        return null; // Show a loading screen while checking the session
    }

    return (
        <Stack.Navigator
            initialRouteName={
                session ? (isAdmin ? "AdminDashboard" : "Home") : "Welcome"
            }
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: "#000" },
                headerTintColor: "#fff",
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
                        <Stack.Screen
                            name="Home"
                            component={HomeScreen}
                            options={{ title: "Home", headerLeft: () => null }}
                        />
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
    );
}
