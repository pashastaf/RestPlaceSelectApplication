import {
	useDestination,
	useDestinationsRate,
} from "@/src/api/destination";
;
import { useRestPlacesByDestIdType } from "@/src/api/restplace";
import RemoteImage from "@/src/components/RemoteImage";
import RestPlaceListByDestination from "@/src/components/RestPlaceListByDestination";
import Colors from "@/src/constants/Colors";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
	FlatList,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { DefaultImage } from "..";
import { FeaturesByDestination, useFeaturesByDestinationId } from "@/src/api/features";

const DestinationDetailScreen = () => {
	const { id: idSting } = useLocalSearchParams();
	const id = Number.parseFloat(
		typeof idSting === "string" ? idSting : idSting[0],
	);

	const { data: destination } = useDestination(id);
	const { data: restPlacesRest } = useRestPlacesByDestIdType(id, 1);
	const { data: restPlacesRestaurant } = useRestPlacesByDestIdType(id,2,);
	const { data: restPlacesHotel } = useRestPlacesByDestIdType(id, 3);
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
				<FontAwesome
					size={25}
					color="gold"
					name="star"
					key={`star-${i}`}
				/>,
			);
		}
		if (halfStar) {
			starsArray.push(
				<FontAwesome
					size={25}
					color="gold"
					name="star-half-empty"
					key={"half-star"}
				/>,
			);
		}
		const emptyStars = 5 - starsArray.length;
		for (let i = 0; i < emptyStars; i++) {
			starsArray.push(
				<FontAwesome
					size={25}
					color="gold"
					name="star-o"
					key={`empty-star-${i}`}
				/>,
			);
		}
		return starsArray;
	};

	if (!destination) {
		return <Text> destination not found</Text>;
	}

	return (
		<ScrollView style={styles.container}>
			<Stack.Screen
				options={{
					title: destination.title,
					headerTitleAlign: "center",
					headerLeft: () => (
						<Link href="/(admin)/destination/" asChild>
								<Pressable>
									{({ pressed }) => (
										<Feather
											name="chevron-left"
											size={25}
											color={Colors.light.tint}
											style={{
												opacity: pressed ? 0.5 : 1,
												marginRight: 15,
											}}
										/>
									)}
								</Pressable>
							</Link>
					),
					headerRight: () => (
						<Link href={`/(admin)/destination/create?id=${id}`} asChild>
							<Pressable>
								{({ pressed }) => (
									<Feather
										name="edit"
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
			<View style={styles.textView}>
				<Text style={styles.title}>{destination.title} </Text>
				<Text style={styles.description}>{destination?.description}</Text>
				<View style={styles.starsView}>
					{renderStars(destinationRate?.rate ?? 0)}
					<Text style={styles.rateText}> {destinationRate?.rate} </Text>
				</View>

			<FlatList
				data={featuresByDestinationId}
				horizontal
				contentContainerStyle={{ gap: 10 }}
				renderItem={({ item, index }) => {
					return (
						<View style={[styles.flatView, { backgroundColor: item.features.color }]}>
							<TouchableOpacity style={styles.touchView}>
								<Text style={styles.flatText}>{item.features.title}</Text>
							</TouchableOpacity>
						</View>
					);
				}}
			/>
			</View>
			{restPlacesRest && restPlacesRest.length > 0 && (
				<Text style={styles.textBeforeFlat}>Entertainment</Text>
			)}
			<FlatList
				data={restPlacesRest}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.flatContent}
				renderItem={({ item }) => (
					<RestPlaceListByDestination restPlace={item} />
				)}
			/>
			{restPlacesRestaurant && restPlacesRestaurant.length > 0 && (
				<Text style={styles.textBeforeFlat}>Restaurant</Text>
			)}
			<FlatList
				data={restPlacesRestaurant}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.flatContent}
				renderItem={({ item }) => (
					<RestPlaceListByDestination restPlace={item} />
				)}
			/>
			{restPlacesHotel && restPlacesHotel.length > 0 && (
				<Text style={styles.textBeforeFlat}>Hotel</Text>
			)}
			<FlatList
				data={restPlacesHotel}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.flatContent}
				renderItem={({ item }) => (
					<RestPlaceListByDestination restPlace={item} />
				)}
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
	textView: {
		margin: 30,
		gap: 10
	},
	title: {
		fontSize: 30,
		fontWeight: "bold",
	},
	description: {
		fontSize: 16,
	},
	starsView: {
		flexDirection: "row",
		alignSelf: "stretch",
		gap: 10
	},
	rateText: {
		fontSize: 20,
		color: "gray",
	},
	flatView: {
		width: 150,
		borderRadius: 10,
	},
	flatText: {
		alignSelf: "center",
		color: "black",
	},
	touchView: {
		padding: 10,
		flex: 1,
	},
	textBeforeFlat: {
		fontSize: 22,
		fontWeight: "bold",
		marginLeft: 30,
		marginTop: 30,

	},
	flatContent: {
		gap: 50, 
		marginHorizontal: 30, 
		marginTop: 20,
		marginBottom: 40,
	},
});

export default DestinationDetailScreen;
