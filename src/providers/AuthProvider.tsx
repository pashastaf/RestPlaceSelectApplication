import type { Session } from "@supabase/supabase-js";
import { type PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type AuthData = {
	session: Session | null;
	profile: any;
	loading: boolean;
	isAdmin: boolean;
	isConsultant: boolean;
	isManager: boolean;
};

const AuthContext = createContext<AuthData>({
	session: null,
	profile: null,
	loading: true,
	isAdmin: false,
	isConsultant: false,
	isManager: false,
});

interface UserProfile {
	id: number;
	email: string;
	group?: string;
	auth_id: string;
}

export default function AuthProvider({ children }: PropsWithChildren) {
	const [session, setSession] = useState<Session | null>(null);
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchProfile = async (userId: string) => {
		const { data } = await supabase.from("profiles").select("*").eq("auth_id", userId).single();
		setProfile(data || null);
	};

	useEffect(() => {
		const fetchSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setSession(session);

			if (session) {
				await fetchProfile(session.user.id);
			}
			setLoading(false);
		};

		fetchSession();

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			if (session) {
				fetchProfile(session.user.id);
			} else {
				setProfile(null);
			}
		});
	}, []);
	console.log("PROVIDER", session);
	console.log("PROVIDER", profile);

	return (
		<AuthContext.Provider
			value={{
				session,
				profile,
				loading,
				isAdmin: profile?.group === "admin",
				isConsultant: profile?.group === "consultant",
				isManager: profile?.group === "manager",
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
