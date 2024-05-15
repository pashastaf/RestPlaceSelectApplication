import { Link, useSegments } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { RestPlace } from "../types";
import RemoteImage from "./RemoteImage";
import { FontAwesome } from "@expo/vector-icons";
import { useRestPlaceRate } from "../api/restplace";
import { DefaultImage } from "../app/(admin)";

type RestPlaceListItemProps = {
	restPlace: RestPlace;
};

const RestPlaceListItem = ({ restPlace }: RestPlaceListItemProps) => {
	const segments = useSegments();

	const { data: restPlaceRate } = useRestPlaceRate(restPlace.id);

	const renderStars = (rating: number) => {
		const fullStars = Math.floor(rating);
		const halfStar = rating - fullStars >= 0.5;
		const starsArray = [];
		for (let i = 0; i < fullStars; i++) {
			starsArray.push(
				<FontAwesome size={18} color="gold" name="star" key={`star-${i}`} />,
			);
		}
		if (halfStar) {
			starsArray.push(
				<FontAwesome
					size={18}
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
					size={18}
					color="gold"
					name="star-o"
					key={`empty-star-${i}`}
				/>,
			);
		}
		return starsArray;
	};

	return (
		<Link href={`/${segments[0]}/restplace/${restPlace.id}` as `${string}:${string}`} asChild>
			<Pressable style={styles.container}>
				<View style={styles.textView}>
				<RemoteImage
					path={restPlace.image_path}
					fallback={DefaultImage}
					style={styles.image}
				/>
					<Text style={styles.title}>{restPlace.title} </Text>
					<View style={styles.starsView}>
						{renderStars(restPlaceRate?.rate ?? 0)}
						<Text style={styles.rateText}> {restPlaceRate?.rate} </Text>
					</View>
					<Text 
						style={styles.description}
						numberOfLines={2}
						>
							{restPlace?.description}
					</Text>
				</View>
			</Pressable>
		</Link>
	);
};

export default RestPlaceListItem;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		flex: 1,
	},
	image: {
		height: 250,
		borderRadius: 20,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
	},
	textView: {
		width: 250,
		gap: 10
	},
	description: {
		fontSize: 16,
	},
	starsView: {
		flexDirection: "row",
		gap: 10,
	},
	rateText: {
		fontSize: 16,
		color: "gray",
	},
});
