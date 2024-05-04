import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Stack } from "expo-router";
import { Pressable, View } from "react-native";

import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function DestinationStack() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: "Destinations",
					headerRight: () => (
						<View style={{ flexDirection: "row" }}>
							<Pressable>
								{({ pressed }) => (
									<MaterialCommunityIcons
										name="logout"
										size={25}
										color={Colors.light.tint}
										style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
										onPress={() => supabase.auth.signOut()}
									/>
								)}
							</Pressable>
							<Link href="/(admin)/destination/create" asChild>
								<Pressable>
									{({ pressed }) => (
										<FontAwesome name="plus" size={25} color={Colors.light.tint} style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} />
									)}
								</Pressable>
							</Link>
						</View>
					),
				}}
			/>
		</Stack>
	);
}
