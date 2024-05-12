import { useDestinationList } from "@/src/api/destination";
import DestinationListItem from "@/src/components/DestinationListItem";
import { ActivityIndicator, FlatList, Text } from "react-native";

export default function DestinationScreen() {
	const {
		data: destination,
		error,
		isLoading,
	} = useDestinationList();

	if (isLoading) {
		return <ActivityIndicator />;
	}

	if (error) {
		return <Text> Failed to fetch product </Text>;
	}
	return (
		<FlatList
			data={destination}
			renderItem={({ item }) => (
				<DestinationListItem destination={item} />
			)}
			numColumns={1}
			contentContainerStyle={{ gap: 10, padding: 10 }}
			//columnWrapperStyle= {{ gap: 10}}
		/>
	);
}
