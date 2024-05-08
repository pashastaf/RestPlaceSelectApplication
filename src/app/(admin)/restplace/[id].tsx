import { useFeaturesByPlacesId, useFeaturesForPlaces, useRestPlace } from "@/src/api/restplace";
import { DefaultImage } from "@/src/components/DestinationListItem";
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
			id: number,
			title: string,
		}
	}

	const { id: idSting } = useLocalSearchParams();
	const id = Number.parseFloat(
		typeof idSting === "string" ? idSting : idSting[0],
	);
	const [selectedServices, setSelectedServices] = useState<number[]>([],);

	const { data: restPlace, error, isLoading } = useRestPlace(id);
	// const { data: features } = useFeaturesForPlaces();
	const { data: featuresByPlaceId } = useFeaturesByPlacesId(id) as {
		data: FeaturesByRestPlace[];
	};

	if (!restPlace) {
		return <Text> destination not found</Text>;
	}

	console.log(featuresByPlaceId)

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
			<Image
				style={styles.image}
				source={{ uri: DefaultImage }}
				resizeMode="contain"
			/>
			<Text style={styles.destinationId}>
				{" "}
				{restPlace.destination_catalogue_id}{" "}
			</Text>
			<FlatList
				data={featuresByPlaceId}
				numColumns={2}
				renderItem={({ item }) => {
					return (
						<View style={styles.flatView}>
							<TouchableOpacity
								style={styles.touchView}
							>
								<Text>{item.features.title}</Text>
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
	flatView: {
		width: "50%",
		height: 60,
		justifyContent: "center",
		alignItems: "center",
	},
	touchView: {
		borderWidth: 1,
		borderRadius: 20,
		width: "90%",
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
});

export default RestPlaceDetailScreen;
