import { useDestinationList } from "@/src/api/destination";
import DestinationListItem from "@/src/components/DestinationListItem";
import { Text, View } from "@/src/components/Themed";
import Colors from "@/src/constants/Colors";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	StyleSheet,
	TextInput,
} from "react-native";

export default function DestinationScreen() {
	const {
		data: destination,
		error,
		isLoading,
	} = useDestinationList();
	const [searchQuery, setSearchQuery] = useState(destination);

	useEffect(() => {
		if (destination) {
			setSearchQuery(destination);
		}
	}, [destination]);

	async function handleFilter(search: string) {
		if (destination) {
			setSearchQuery(
				destination.filter((item) =>
					item.title.toLowerCase().includes(search.toLowerCase()),
				),
			);
		}
	}

	if (isLoading) {
		return <ActivityIndicator />;
	}

	if (error) {
		return <Text> Failed to fetch product </Text>;
	}
	return (
		<View>
			<View style={styles.filterBlock}>
				<TextInput
					placeholder="Search"
					clearButtonMode="always"
					style={styles.searchBox}
					autoCapitalize="none"
					autoCorrect={false}
					onChangeText={handleFilter}
				/>
				<View>
					<Pressable onPress={() => {}}>
						{({ pressed }) => (
							<Feather
								name="sliders"
								size={25}
								color={Colors.light.tint}
								style={{
									opacity: pressed ? 0.5 : 1,
									marginTop: 17,
									marginLeft: 15,
									height: 40,
								}}
							/>
						)}
					</Pressable>
				</View>
			</View>
			<FlatList
				data={searchQuery}
				renderItem={({ item }) => (
					<DestinationListItem destination={item} />
				)}
				numColumns={1}
				style={{ marginTop: 50 }}
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
		marginTop: 10,
		width: "90%",
		height: 40,
	},
	filterBlock: {
		flex: 1,
		marginHorizontal: 20,
		flexDirection: "row",
	},
});
