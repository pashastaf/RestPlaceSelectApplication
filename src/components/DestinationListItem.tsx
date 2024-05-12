import { Link, useSegments } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { Destination } from "../types";
import RemoteImage from "./RemoteImage";
import { useDestinationsRate } from "../api/destination";
import { FontAwesome } from "@expo/vector-icons";

export const DefaultImage =
	"https://previews.123rf.com/images/koblizeek/koblizeek2208/koblizeek220800254/190563481-no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment-placeholder.jpg";

type DestinationListItemProps = {
	destination: Destination;
};

const DestinationListItem = ({ destination }: DestinationListItemProps) => {
	const segments = useSegments();

	const {data: destinationRate} = useDestinationsRate(destination.id);

	const renderStars = (rating: number) => {
			const fullStars = Math.floor(rating);
			const halfStar = rating - fullStars >= 0.5;
			const starsArray = [];
			for (let i = 0; i < fullStars; i++) {
					starsArray.push(<FontAwesome size={25} style={styles.star} color='gold' name="star" />);
			}
			if (halfStar) {
					starsArray.push(<FontAwesome size={25} style={styles.star} color='gold' name="star-half-empty" />);
			}
			const emptyStars = 5 - starsArray.length;
			for (let i = 0; i < emptyStars; i++) {
					starsArray.push(<FontAwesome size={25} style={styles.star} color='gold' name="star-o" />);
			}
			return starsArray;
	};


	return (
			<Link
					href={`/${segments[0]}/destination/${destination.id}`}
					asChild
			>
					<Pressable style={styles.container}>
							<RemoteImage
									path={destination.image_path}
									fallback={DefaultImage}
									style={styles.image}
							/>

							<Text style={styles.title}> {destination.title} </Text>
							<Text style={styles.description}>
									{destination.description}
							</Text>
							<View style={styles.starsView}>
									{renderStars(destinationRate?.rate ?? 0)}
									<Text style={styles.rateText}> {destinationRate?.rate} </Text>
							</View>
					</Pressable>
			</Link>
	);
};

export default DestinationListItem;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		borderRadius: 20,
		borderWidth: 1,
		flex: 1,
		shadowColor: "black",
		elevation: 6,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		alignSelf: 'center',
		marginTop: 5
	},
	description: {
		fontSize: 16,
		fontWeight: "normal",
		alignSelf: 'center',
		padding: 15,
	},
	image: {
		width: "100%",
		aspectRatio: 1,
		borderRadius: 20,
	},
	star: {
		margin: 5,
	},
	starsView: {
		flexDirection: 'row',
		alignSelf: 'flex-end',
		marginVertical: 10,
		marginHorizontal: 10,
	},
	rateText: {
		fontSize: 25,
		color: 'gray',
	},
});
