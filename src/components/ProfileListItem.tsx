import { Link, useSegments } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import type { Profile } from "../types";

type ProfileListItemProps = {
	profile: Profile;
};

const ProfileListItem = ({ profile }: ProfileListItemProps) => {
	const segments = useSegments();

	return (
		<Link
			href={`/${segments[0]}/profile/create?id=${profile.id}`}
			asChild
		>
			<Pressable style={styles.container}>
				<Text style={styles.title}>
					{" "}
					{profile.second_name} {profile.first_name}{" "}
				</Text>
				<Text style={styles.contry}> {profile.email} </Text>
				<Text style={styles.contry}> {profile.group} </Text>
				<Text style={styles.contry}> {profile.created_at} </Text>
			</Pressable>
		</Link>
	);
};

export default ProfileListItem;

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
