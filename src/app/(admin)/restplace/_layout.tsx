import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Stack } from "expo-router";
import { Pressable, View } from "react-native";

import Colors from "@/src/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { supabase } from "@/src/lib/supabase";

export default function RestPlaceStack() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: "Rest Places",
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
							<Link href="/(admin)/restplace/create" asChild>
								<Pressable>
									{({ pressed }) => (
										<Feather
											name="plus"
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
