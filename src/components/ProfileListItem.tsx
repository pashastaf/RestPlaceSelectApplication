import { Link, useSegments } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Profile } from "../types";
import { format } from "date-fns";
import { DefaultAvatar } from "../app/(admin)";
import RemoteImage from "./RemoteImage";

type ProfileListItemProps = {
	profile: Profile;
};

const ProfileListItem = ({ profile }: ProfileListItemProps) => {
	const segments = useSegments();

	return (
		<Link
			href={`/${segments[0]}/profile/create?id=${profile.id}` as `${string}:${string}`}
			asChild
		>
			<Pressable style={styles.container}>
				<RemoteImage
					path={profile.avatar_url}
					fallback={DefaultAvatar}
					style={styles.image}
				/>
				<View>
					<Text style={styles.title}>{profile.second_name} {profile.first_name}</Text>
					<Text style={styles.infoText}>Email: {profile.email}</Text>
					<Text style={styles.infoText}>Phone: {profile.phone}</Text>
					<Text style={styles.infoText}>Group: {profile.profiles_group.title}</Text>
					<Text style={styles.infoText}>Created: {format(
						new Date(profile.created_at),
						"dd.MM.yyyy HH:mm:ss",
					)}
					</Text>
				</View>
			</Pressable>
		</Link>
	);
};

export default ProfileListItem;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		flexDirection: 'row',
		padding: 5,
		borderRadius: 20,
		borderWidth: 1,
		justifyContent: 'space-around',
		gap: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
	},
	infoText: {
		fontSize: 16,
		fontWeight: "normal",
		flexWrap: 'wrap'

	},
	image: {
		width: 75,
		aspectRatio: 1,
		alignSelf: 'center',
		borderRadius: 40,
	},
});
