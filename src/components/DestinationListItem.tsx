import { Link, useSegments } from "expo-router";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import type { Destination } from "../types";

export const DefaultImage =
	"https://previews.123rf.com/images/koblizeek/koblizeek2208/koblizeek220800254/190563481-no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment-placeholder.jpg";

type DestinationListItemProps = {
	destination: Destination;
};

const DestinationListItem = ({ destination }: DestinationListItemProps) => {
	const segments = useSegments();

	return (
		<Link href={`/${segments[0]}/destination/${destination.id}`} asChild>
			<Pressable style={styles.container}>
				<Image style={styles.image} source={{ uri: DefaultImage }} resizeMode="contain" />

				<Text style={styles.title}> {destination.title} </Text>
				<Text style={styles.contry}> {destination.country} </Text>
			</Pressable>
		</Link>
	);
};

export default DestinationListItem;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		padding: 10,
		borderRadius: 20,
		flex: 1,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	contry: {
		fontSize: 14,
		fontWeight: "normal",
		color: "blue",
	},
	image: {
		width: "100%",
		aspectRatio: 1,
	},
});
