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

const DestinationListItem = ({
	destination,
}: DestinationListItemProps) => {
	const segments = useSegments();

	const {data: destinationRate} = useDestinationsRate(destination.id);

	console.log(destinationRate)

	const stringDest = Math.floor(destinationRate?.rate);
	const secondDest = destinationRate?.rate % 1;
	console.log(stringDest)
	console.log(secondDest)

	const stars = [];
	for (let i = 0; i < stringDest; i++) {
		stars.push(<FontAwesome name="star" />)
		if (i > stringDest) {
		stars.push(<FontAwesome name="star-o" />)
		}
	}



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
				<View style={{flexDirection: 'row'}}> 
					{stars.map((i) => i)}
					{(secondDest > 0.30) ? <FontAwesome name="star-half" /> : <></> }
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
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		alignSelf: 'center',
		marginLeft: 5,
	},
	description: {
		fontSize: 16,
		fontWeight: "normal",
		alignSelf: 'center',
		padding: 10,
	},
	image: {
		width: "100%",
		aspectRatio: 1,
		borderRadius: 20,
	},
});
