import {
	useDestination,
	useDestinationsRate,
	useFeaturesByDestinationId,
} from "@/src/api/destination";
import { useRestPlacesByDestIdType } from "@/src/api/restplace";
import { DefaultImage } from "@/src/components/DestinationListItem";
import RemoteImage from "@/src/components/RemoteImage";
import RestPlaceListByDestination from "@/src/components/RestPlaceListByDestination";
import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import { FontAwesome } from "@expo/vector-icons";
import { roundToNearestHours } from "date-fns";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
	FlatList,
	Image,
	Pressable,
	ScrollView,
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
			id: number;
			title: string;
		};
	}

	const { id: idSting } = useLocalSearchParams();
	const id = Number.parseFloat(
		typeof idSting === "string" ? idSting : idSting[0],
	);

	const { data: destination } = useDestination(id);
	const { data: restPlacesRest } = useRestPlacesByDestIdType(id, "rest");
	const { data: restPlacesRestaurant } = useRestPlacesByDestIdType(id,"restaurant");
	const { data: restPlacesHotel } = useRestPlacesByDestIdType(id, "hotel");
	const { data: featuresByDestinationId } = useFeaturesByDestinationId(id) as {
		data: FeaturesByDestination[];
	};

	const { data: destinationRate } = useDestinationsRate(id);

	const renderStars = (rating: number) => {
		const fullStars = Math.floor(rating);
		const halfStar = rating - fullStars >= 0.5;
		const starsArray = [];
		for (let i = 0; i < fullStars; i++) {
			starsArray.push(
				<FontAwesome size={25} style={styles.star} color="gold" name="star" />,
			);
		}
		if (halfStar) {
			starsArray.push(
				<FontAwesome
					size={25}
					style={styles.star}
					color="gold"
					name="star-half-empty"
				/>,
			);
		}
		const emptyStars = 5 - starsArray.length;
		for (let i = 0; i < emptyStars; i++) {
			starsArray.push(
				<FontAwesome
					size={25}
					style={styles.star}
					color="gold"
					name="star-o"
				/>,
			);
		}
		return starsArray;
	};

	if (!destination) {
		return <Text> destination not found</Text>;
	}

	const tagColors = [
		"#888888",
		"#00ffff",
		"#0000ff",
		"#ffff00",
		"#00ffff",
		"#ff00ff",
		"#ff8800",
		"#888888",
	]; // Заранее приготовленный массив цветов


	return (
		<ScrollView style={styles.container}>
			<Stack.Screen
				options={{
					title: destination.title,
					headerRight: () => (
						<Link href={`/(admin)/destination/create?id=${id}`} asChild>
							<Pressable>
								{({ pressed }) => (
									<FontAwesome
										name="pencil"
										size={25}
										color={Colors.light.tint}
										style={{
											opacity: pressed ? 0.5 : 1,
										}}
									/>
								)}
							</Pressable>
						</Link>
					),
				}}
			/>
			<RemoteImage
				path={destination.image_path}
				fallback={DefaultImage}
				style={styles.image}
			/>
			<Text style={styles.description}>{destination?.description}</Text>
			<View style={styles.starsView}>
				{renderStars(destinationRate?.rate ?? 0)}
				<Text style={styles.rateText}> {destinationRate?.rate} </Text>
			</View>

			<FlatList
				data={featuresByDestinationId}
				numColumns={1}
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

			{restPlacesRest && restPlacesRest.length > 0 && (
				<Text style={styles.text}> Entertainment </Text>
			)}
			<FlatList
				data={restPlacesRest}
				numColumns={1}
				horizontal
				renderItem={({ item }) => (
					<RestPlaceListByDestination restPlace={item} />
				)}
				contentContainerStyle={{ gap: 10, padding: 10 }}
			/>
			{restPlacesRestaurant && restPlacesRestaurant.length > 0 && (
				<Text style={styles.text}> Restaurant </Text>
			)}
			<FlatList
				data={restPlacesRestaurant}
				numColumns={1}
				horizontal
				renderItem={({ item }) => (
					<RestPlaceListByDestination restPlace={item} />
				)}
				contentContainerStyle={{ gap: 10, padding: 10 }}
			/>
			{restPlacesHotel && restPlacesHotel.length > 0 && (
				<Text style={styles.text}> Hotel </Text>
			)}
			<FlatList
				data={restPlacesHotel}
				numColumns={1}
				horizontal
				renderItem={({ item }) => (
					<RestPlaceListByDestination restPlace={item} />
				)}
				contentContainerStyle={{ gap: 10, padding: 10 }}
			/>
		</ScrollView>
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
	star: {
		margin: 5,
	},
	starsView: {
		flexDirection: "row",
		alignSelf: "stretch",
		marginVertical: 10,
		marginHorizontal: 10,
	},
	rateText: {
		fontSize: 25,
		color: "gray",
	},
});

export default DestinationDetailScreen;
