import { useRestPlace, useRestPlaceRate } from "@/src/api/restplace";
import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import {
	Feather,
	FontAwesome,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
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
import { DefaultImage } from "../../(admin)";
import RemoteImage from "@/src/components/RemoteImage";
import { FeaturesByPlacesId, useFeaturesByPlacesId } from "@/src/api/features";

const RestPlaceDetailScreen = () => {
	const { id: idSting } = useLocalSearchParams();
	const id = Number.parseFloat(
		typeof idSting === "string" ? idSting : idSting[0],
	);

	const { data: restPlace, error, isLoading } = useRestPlace(id);
	const { data: featuresByPlaceId } = useFeaturesByPlacesId(id) as {
		data: FeaturesByPlacesId[];
	};
	
	const { data: restPlaceRate } = useRestPlaceRate(id);

	if (!restPlace) {
		return <Text> destination not found</Text>;
	}

	const renderStars = (rating: number) => {
		const fullStars = Math.floor(rating);
		const halfStar = rating - fullStars >= 0.5;
		const starsArray = [];
		for (let i = 0; i < fullStars; i++) {
			starsArray.push(<FontAwesome size={25} color='gold' name="star" key={`star-${i}`} />);
		}
		if (halfStar) {
			starsArray.push(<FontAwesome size={25} color='gold' name="star-half-empty" key={'half-star'} />);
		}
		const emptyStars = 5 - starsArray.length;
		for (let i = 0; i < emptyStars; i++) {
			starsArray.push(<FontAwesome size={25} color='gold' name="star-o" key={`empty-star-${i}`} />);
		}
		return starsArray;
	};

	return (
		<ScrollView style={styles.container}>
			<Stack.Screen
				options={{
					headerLeft: () => (
						<Link href="/(user)/restplace/" asChild>
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
					)
				}
			}
			/>
			<Stack.Screen options={{ title: restPlace.title }} />
			<RemoteImage
				path={restPlace.image_path}
				fallback={DefaultImage}
				style={styles.image}
			/>
			<View style={styles.textView}>
				<Text style={styles.title}>{restPlace.title} </Text>
				<Text style={styles.description}>{restPlace?.description}</Text>
				<View style={styles.starsView}>
					{renderStars(restPlaceRate?.rate ?? 0)}
					<Text style={styles.rateText}> {restPlaceRate?.rate} </Text>
				</View>
				<FlatList
					data={featuresByPlaceId}
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
		fontSize: 25,
		color: "gray",
	},
	flatView: {
		width: 100,
		borderRadius: 10,
	},
	flatText: {
		alignSelf: "center",
		color: "black",
	},
	touchView: {
		padding: 5,
		flex: 1,
	},
	textBeforeFlat: {
		fontSize: 22,
		fontWeight: "bold",
		marginLeft: 30,
		marginTop: 30,
	},
});

export default RestPlaceDetailScreen;
