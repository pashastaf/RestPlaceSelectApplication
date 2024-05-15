import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Stack } from "expo-router";
import { Pressable, View } from "react-native";

import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export default function RestPlaceStack() {
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
							<Link href="/(user)/settings" asChild>
								<Pressable>
									{({ pressed }) => (
										<Feather
											name="settings"
											size={25}
											color={Colors.light.tint}
											style={{
												opacity: pressed ? 0.5 : 1,
											}}
										/>
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
