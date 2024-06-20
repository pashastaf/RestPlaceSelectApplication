import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import { Feather } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { StyleSheet, View, Text, Pressable } from "react-native";


export default function TabOneScreen() {
	return (
		<Pressable>
								{({ pressed }) => (
									<Feather
										name="log-out"
										size={25}
										color={Colors.light.tint}
										style={{
											marginRight: 15,
											opacity: pressed ? 0.5 : 1,
										}}
										onPress={() => supabase.auth.signOut()}
									/>
								)}
							</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
