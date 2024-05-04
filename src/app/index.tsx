import { Link, Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";
import Button from "../components/Button";
import { View } from "../components/Themed";
import { supabase } from "../lib/supabase";
import { useAuth } from "../providers/AuthProvider";

const index = () => {
	const { session, loading, isAdmin, isManager, isConsultant, profile } = useAuth();

	if (loading) {
		return <ActivityIndicator />;
	}
	console.log("INDEX", session);
	console.log("INDEX", profile);
	if (!session) {
		return <Redirect href={"/sign-in"} />;
	}

	if (isAdmin) {
		return <Redirect href={"/(admin)"} />;
	} else if (isManager) {
		return <Redirect href={"/(manager)"} />;
	} else if (isConsultant) {
		return <Redirect href={"/(consultant)"} />;
	} else {
		return <Redirect href={"/(user)"} />;
	}
};

export default index;
