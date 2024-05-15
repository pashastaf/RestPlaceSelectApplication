import { useProfileList } from "@/src/api/profile";
import ProfileListItem from "@/src/components/ProfileListItem";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, TextInput, Text, View } from "react-native";

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
		return <ActivityIndicator style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center'}} />;
	}

	if (error) {
		return <Text style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center'}}> Failed to fetch profiles </Text>;
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
		<View style={{ flex: 1, backgroundColor:'white' }}>
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
				contentContainerStyle={{ gap: 20, padding: 15 }}
			/>
		</View>
	);
}
const styles = StyleSheet.create({
	searchBox: {
		marginVertical: 15,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 8,
		width: "90%",
		alignSelf: 'center'
	},
})
