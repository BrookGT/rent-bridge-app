// utils/supabase.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Get environment variables
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn(
        "Supabase URL or ANON KEY is missing. Check your environment variables."
    );
}

// Basic validation for Supabase URL
const urlRegex = /^https:\/\/[a-z0-9-]+\.supabase\.co$/;
if (SUPABASE_URL && !urlRegex.test(SUPABASE_URL)) {
    console.warn(
        "Supabase URL is invalid. It should be in the format https://your-project-id.supabase.co"
    );
}

// Basic validation for anon key
if (SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length < 20) {
    console.warn("Supabase ANON KEY is invalid. It should be a valid key.");
}

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
