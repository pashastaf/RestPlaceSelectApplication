import { Link, useSegments } from "expo-router";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import type { RestPlace } from "../types";
import RemoteImage from "./RemoteImage";
import { DefaultImage } from "./DestinationListItem";

type RestPlaceListItemProps = {
	restPlace: RestPlace;
};

const RestPlaceListItem = ({ restPlace }: RestPlaceListItemProps) => {
	const segments = useSegments();

	return (
		<Link href={`/${segments[0]}/restplace/${restPlace.id}`} asChild>
			<Pressable style={styles.container}>
			<RemoteImage
        path={restPlace.image_path}
        fallback={DefaultImage}
        style={styles.image}
      />
			<Text style={styles.title}> {restPlace.title} </Text>
			</Pressable>
		</Link>
	);
};

export default RestPlaceListItem;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		padding: 10,
		flex: 1,
	},
	image: {
		width: 250,
		height: 250,
		borderRadius: 20
	},
	title: {
		alignSelf: 'stretch',
		fontSize: 16,
	}
});
