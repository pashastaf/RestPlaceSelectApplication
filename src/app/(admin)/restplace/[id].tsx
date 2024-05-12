import {
	useFeaturesByPlacesId,
	useFeaturesForPlaces,
	useRestPlace,
} from "@/src/api/restplace";
import { DefaultImage } from "@/src/components/DestinationListItem";
import RemoteImage from "@/src/components/RemoteImage";
import Colors from "@/src/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
	FlatList,
	Image,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
const RestPlaceDetailScreen = () => {
	interface FeaturesByRestPlace {
		id: number;
		features_id: number;
		rest_places_id: number;
		features: {
			id: number;
			title: string;
		};
	}

	const { id: idSting } = useLocalSearchParams();
	const id = Number.parseFloat(
		typeof idSting === "string" ? idSting : idSting[0],
	);

	const { data: restPlace, error, isLoading } = useRestPlace(id);
	const { data: featuresByPlaceId } = useFeaturesByPlacesId(id) as {
		data: FeaturesByRestPlace[];
	};

	const tagColors = [
		"#888888",
		"#00ffff",
		"#0000ff",
		"#ff8800",
		"#00ffff",
		"#ff00ff",
		"#ff8800",
		"#888888",
	];

	if (!restPlace) {
		return <Text> destination not found</Text>;
	}

	console.log(featuresByPlaceId);

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					title: "Rest Place",
					headerRight: () => (
						<Link href={`/(admin)/restplace/create?id=${id}`} asChild>
							<Pressable>
								{({ pressed }) => (
									<FontAwesome
										name="pencil"
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
					),
				}}
			/>

			<Stack.Screen options={{ title: restPlace.title }} />
			<RemoteImage
				path={restPlace.image_path}
				fallback={DefaultImage}
				style={styles.image}
			/>
			<Text style={styles.description}>{restPlace?.description}</Text>
			<FlatList
				data={featuresByPlaceId}
				horizontal
				renderItem={({ item, index }) => {
					const tagColor = tagColors[index % tagColors.length];
					return (
						<View style={[styles.flatView, { backgroundColor: tagColor }]}>
							<TouchableOpacity style={styles.touchView}>
								<Text style={styles.flatText}>{item.features.title}</Text>
							</TouchableOpacity>
						</View>
					);
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		flex: 1,
	},
	image: {
		width: "100%",
		aspectRatio: 1,
	},
	description: {
		fontSize: 16,
		alignSelf: "stretch",
		padding: 5,
	},
	flatView: {
		marginHorizontal: 5,
		marginBottom: 10,
		width: 150,
		height: 40,
		borderRadius: 10,
	},
	flatText: {
		alignSelf: "center",
		color: "white",
	},
	touchView: {
		padding: 10,
		flex: 1,
	},
	text: {
		marginHorizontal: 10,
		fontSize: 20,
		fontWeight: "bold",
	},
});

export default RestPlaceDetailScreen;
