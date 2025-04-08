import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
        "Supabase URL or ANON KEY is missing. Check your environment variables."
    );
}

// Basic validation for Supabase URL
const urlRegex = /^https:\/\/[a-z0-9-]+\.supabase\.co$/;
if (!urlRegex.test(SUPABASE_URL)) {
    throw new Error(
        "Supabase URL is invalid. It should be in the format https://your-project-id.supabase.co"
    );
}

// Basic validation for anon key
if (SUPABASE_ANON_KEY.length < 20) {
    throw new Error("Supabase ANON KEY is invalid. It should be a valid key.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
