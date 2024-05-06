import { Link, useSegments } from "expo-router";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import type { RestPlace } from "../types";

type RestPlaceListItemProps = {
	restPlace: RestPlace;
};

const RestPlaceListItem = ({ restPlace }: RestPlaceListItemProps) => {
	const segments = useSegments();

	return (
		<Link href={`/${segments[0]}/restplace/${restPlace.id}`} asChild>
			<Pressable style={styles.container}>
				<Text style={styles.title}>
					{restPlace.id}. {restPlace.title}{" "}
				</Text>
			</Pressable>
		</Link>
	);
};

export default RestPlaceListItem;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		padding: 10,
		borderRadius: 20,
		borderWidth: 1,
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
