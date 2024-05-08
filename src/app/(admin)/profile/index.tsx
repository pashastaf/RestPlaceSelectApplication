import { useProfileList } from "@/src/api/profile";
import DestinationListItem from "@/src/components/DestinationListItem";
import ProfileListItem from "@/src/components/ProfileListItem";
import { Text, View } from "@/src/components/Themed";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, TextInput } from "react-native";

export default function ProfileScreen() {
	const { data: profile, error, isLoading } = useProfileList();
	const [searchQuery, setSearchQuery] = useState(profile);
	const [inputValue, setInputValue] = useState('');

	useEffect(() => {
		if (profile) {
			setSearchQuery(profile);
			setInputValue('');
		}
	}, [profile])

	if (isLoading) {
		return <ActivityIndicator />;
	}

	if (error) {
		return <Text> Failed to fetch product </Text>;
	}

	async function handleFilter(search: string) {
		setInputValue(search)
		if (profile) {
			setSearchQuery(
				profile.filter((item) =>
					item.first_name.toLowerCase().includes(search.toLowerCase()) ||
					item.second_name.toLowerCase().includes(search.toLowerCase())
				),
			);
		}
	}

	return (
		<View>
			<TextInput
				placeholder="Search"
				clearButtonMode="always"
				style={styles.searchBox}
				autoCapitalize="none"
				value={inputValue}
				autoCorrect={false}
				onChangeText={handleFilter}
			/>
			<FlatList
				data={searchQuery}
				renderItem={({ item }) => <ProfileListItem profile={item} />}
				numColumns={1}
				contentContainerStyle={{ gap: 10, padding: 10 }}
			//columnWrapperStyle= {{ gap: 10}}
			/>
		</View>
	);
}
const styles = StyleSheet.create({
	searchBox: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 8,
		width: "90%",
	},
})
