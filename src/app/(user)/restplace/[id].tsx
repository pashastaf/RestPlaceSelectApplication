import { useRestPlace } from "@/src/api/restplace";
import { DefaultImage } from "@/src/components/DestinationListItem";
import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import {
	FontAwesome,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
const RestPlaceDetailScreen = () => {
	const { id: idSting } = useLocalSearchParams();
	const id = Number.parseFloat(
		typeof idSting === "string" ? idSting : idSting[0],
	);

	const { data: restPlace, error, isLoading } = useRestPlace(id);

	if (!restPlace) {
		return <Text> destination not found</Text>;
	}

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					title: "Rest Place",
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

			<Stack.Screen options={{ title: restPlace.title }} />
			<Image
				style={styles.image}
				source={{ uri: DefaultImage }}
				resizeMode="contain"
			/>
			<Text style={styles.destinationId}>
				{" "}
				{restPlace.destinations_id}{" "}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		flex: 1,
		padding: 10,
	},
	image: {
		width: "100%",
		aspectRatio: 1,
	},
	destinationId: {
		fontSize: 18,
		fontWeight: "bold",
	},
});

export default RestPlaceDetailScreen;
