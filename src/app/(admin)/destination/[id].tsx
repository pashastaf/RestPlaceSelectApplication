import { useDestination, useFeaturesByDestinationId } from "@/src/api/destination";
import { useRestPlacesByDestinationId } from "@/src/api/restplace";
import { DefaultImage } from "@/src/components/DestinationListItem";
import RemoteImage from "@/src/components/RemoteImage";
import RestPlaceListByDestination from "@/src/components/RestPlaceListByDestination";
import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
	FlatList,
	Image,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const DestinationDetailScreen = () => {
	interface FeaturesByDestination {
		id: number;
		features_id: number;
		destinations_id: number;
		features: {
			id: number,
			title: string,
		}
	}

	const { id: idSting } = useLocalSearchParams();
	const id = Number.parseFloat(
		typeof idSting === "string" ? idSting : idSting[0],
	);

	const { data: destination } = useDestination(id);
	const { data: restPlaces } = useRestPlacesByDestinationId(id);
	const { data: featuresByDestinationId } = useFeaturesByDestinationId(id) as {
		data: FeaturesByDestination[];
	}

	if (!destination) {
		return <Text> destination not found</Text>;
	}

	// supabase.storage.from('destination_images').copy('ee589a14-ad8d-472c-9a47-91e35c933d70.png', 'avats')
	console.log(destination.image_path)


	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					title: destination.title,
					headerRight: () => (
						<Link
							href={`/(admin)/destination/create?id=${id}`}
							asChild
						>
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
			<Text>{}</Text>
			<RemoteImage
        path={destination.image_path}
        fallback={DefaultImage}
        style={styles.image}
      />
      <Text>{destination?.image_path}</Text>
			<View style={{flexDirection: 'row', flex: 1}}>
			<FlatList
				data={restPlaces}
				numColumns={1}
				renderItem={({ item }) => (
					<RestPlaceListByDestination restPlace={item} />
				)}
				contentContainerStyle={{ gap: 10, padding: 10 }}
			/>
			<FlatList
				data={featuresByDestinationId}
				numColumns={1}
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
	contry: {
		fontSize: 18,
		fontWeight: "bold",
	},
	flatView: {
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

export default DestinationDetailScreen;
