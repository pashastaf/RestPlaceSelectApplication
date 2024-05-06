import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Stack } from "expo-router";
import { Pressable, View } from "react-native";

import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScreenStackHeaderSearchBarView } from "react-native-screens";

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
									<MaterialCommunityIcons
										name="logout"
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
							<Link href="/sign-up" asChild>
								<Pressable>
									{({ pressed }) => (
										<FontAwesome
											name="cog"
											size={25}
											color={Colors.light.tint}
											style={{
												marginRight: 15,
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
