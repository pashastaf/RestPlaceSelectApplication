import { useOrderList } from "@/src/api/order";
import OrderListItem from "@/src/components/OrderListItem";
import Colors from "@/src/constants/Colors";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, StyleSheet } from "react-native";

export default function OrderScreen() {
	const { data: order, error, isLoading } = useOrderList();

	if (isLoading) {
		return <ActivityIndicator />;
	}

	if (error) {
		return <Text> Failed to fetch product </Text>;
	}

	const items = [
		{ label: "In process", value: 1, color: '#8ac926' },
		{ label: "Under review", value: 2, color: '#e76f51' },
		{ label: "In the work", value: 3, color: '#e9c46a' },
		{ label: "Completed", value: 4, color: '#00b4d8' },
	];

	return (
		<View style={{ backgroundColor: 'white', flex: 1}}>
		<FlatList
			data={order}
			numColumns={1}
			contentContainerStyle={{ gap: 10, padding: 10 }}
			renderItem={({ item }) =>
				<View>
					<OrderListItem order={item} />
					<FlatList
						data={items}
						horizontal
			contentContainerStyle={{ gap: 10, padding: 10 }}
			renderItem={({ item }) => {
							return (
								<TouchableOpacity style={[styles.touchView, { backgroundColor: item.color }]}>
									<Text style={styles.flatText}>{item.label}</Text>
								</TouchableOpacity>
							)
						}}
					/>
				</View>

			}
		/>
		</View>
	);
}

const styles = StyleSheet.create({
	flatText: {
		alignSelf: "center",
		color: "black",
	},
	touchView: {
		padding: 10, 
		height: 40,
		borderRadius: 10,
		width: 90,
	},
});
