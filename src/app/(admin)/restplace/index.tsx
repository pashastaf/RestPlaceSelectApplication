import { useRestPlaceList } from "@/src/api/restplace";
import RestPlaceListItem from "@/src/components/RestPlaceListItem";
import { ActivityIndicator, FlatList, Text } from "react-native";

export default function RestPlaceScreen() {
	const { data: restPlaces, isLoading, error } = useRestPlaceList();

	if (isLoading) {
		return <ActivityIndicator />;
	}
	if (error) {
		return <Text>Failed to fetch</Text>;
	}

	return (
		<FlatList
			data={restPlaces}
			renderItem={({ item }) => (
				<RestPlaceListItem restPlace={item} />
			)}
			contentContainerStyle={{ gap: 10, padding: 10 }}
		/>
	);
}
