import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

const ExpoSecureStoreAdapter = {
	getItem: (key: string) => {
		return SecureStore.getItemAsync(key);
	},
	setItem: (key: string, value: string) => {
		SecureStore.setItemAsync(key, value);
	},
	removeItem: (key: string) => {
		SecureStore.deleteItemAsync(key);
	},
};

const supabaseUrl = "https://ixgyasaycsbhzdflbmqa.supabase.co";
const supabaseAnonKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4Z3lhc2F5Y3NiaHpkZmxibXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQzMDc3MzYsImV4cCI6MjAyOTg4MzczNn0.jpIq0cbc_AzahBnsznZ6t-tNWi1YlD_WJ57wCS54wMw";
const supabaseRoleKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4Z3lhc2F5Y3NiaHpkZmxibXFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNDMwNzczNiwiZXhwIjoyMDI5ODgzNzM2fQ.8DL6sdyR2M4LbcQcWsQ8XQXNSn4QEspabv3-G0xhn7U";

export const supabase = createClient(supabaseUrl, supabaseRoleKey, {
	auth: {
		storage: ExpoSecureStoreAdapter as any,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
