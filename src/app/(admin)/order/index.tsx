import { useOrderList } from "@/src/api/order";
import OrderListItem from "@/src/components/OrderListItem";
import Colors from "@/src/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, StyleSheet, TextInput, Pressable } from "react-native";

export default function OrderScreen() {
	const { data: order, error, isLoading } = useOrderList();

	const [inputValue, setInputValue] = useState('');


	if (isLoading) {
		return <ActivityIndicator />;
	}

	if (error) {
		return <Text> Failed to fetch product </Text>;
	}

	const items = [
		{ label: "In process", value: 1, color: Colors.light.tint },
		{ label: "Under review", value: 2, color: 'white' },
		{ label: "In the work", value: 3, color: 'white' },
		{ label: "Completed", value: 4, color: 'white' },
	];

	return (
		<View style={{ backgroundColor: 'white', flex: 1 }}>
			<View style={styles.seacrhButton}>
				<TextInput
					placeholder="Search"
					clearButtonMode="always"
					style={styles.searchBox}
					autoCapitalize="none"
					value={inputValue}
					autoCorrect={false}
					onChangeText={() => { }}
				/>
				<View>
					<Pressable
						onPress={() => {
						}}
					>
						{({ pressed }) => (
							<Feather
								name="sliders"
								size={25}
								color={Colors.light.tint}
								style={{
									opacity: pressed ? 0.5 : 1,
								}}
							/>
						)}
					</Pressable>
				</View>
			</View>
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
							showsHorizontalScrollIndicator={false}
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
		width: 100,
		borderWidth: 1,
	},
	searchBox: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 8,
		width: "90%",
	},
	seacrhButton: {
		marginHorizontal: 15,
		marginVertical: 15,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: 'center'
	},
});
