import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";
import { useAuth } from "../providers/AuthProvider";

const index = () => {
	const {
		session,
		loading,
		isAdmin,
		isManager,
		isConsultant,
		profile,
	} = useAuth();

	if (loading) {
		return <ActivityIndicator />;
	}
	console.log("INDEX S", session);
	console.log("INDEX P", profile);
	if (!session) {
		return <Redirect href={"/sign-in"} />;
	}

	if (isAdmin) {
		return <Redirect href={"/(admin)"} />;
	} 
	if (isManager) {
		return <Redirect href={"/(manager)"} />;
	} 
	if (isConsultant) {
		return <Redirect href={"/(consultant)"} />;
	} 
	if (!isAdmin && !isConsultant && !isManager) {
		return <Redirect href={"/(user)"} />;
	}
};

export default index;
