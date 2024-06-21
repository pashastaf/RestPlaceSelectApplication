import { useOrderListById } from "@/src/api/order";
import Button from "@/src/components/Button";
import OrderListItem from "@/src/components/OrderListItem";
import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/providers/AuthProvider";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function OrderScreen() {
	const router = useRouter();
	const {profile} = useAuth();
	const { data: order, error, isLoading } = useOrderListById(profile.id);

	if (isLoading) {
		return <ActivityIndicator />;
	}

	if (error) {
		return <Text> Failed to fetch product </Text>;
	}

	return (
		<View style={{ flex: 1, backgroundColor:'white' }}>
		<View style={{paddingHorizontal: 20, marginVertical: 10}}>
			<Button color={Colors.light.tint} text="Add new order" onPress={() => router.replace('/(user)/order/create')} />
		</View>
		<FlatList
			data={order}
			numColumns={1}
			contentContainerStyle={{ gap: 10, padding: 10 }}
			renderItem={({ item }) =>				
					<OrderListItem order={item} />
			}
		/>
		</View>
	);
}
