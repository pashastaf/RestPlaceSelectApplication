import { useOrderList, useOrderListById } from "@/src/api/order";
import Button from "@/src/components/Button";
import OrderListItem from "@/src/components/OrderListItem";
import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/providers/AuthProvider";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, StyleSheet, TextInput, Pressable } from "react-native";

export default function OrderScreen() {
	const router = useRouter();
	const {profile} = useAuth();
	const { data: order, error, isLoading } = useOrderListById(profile.id);

	const [inputValue, setInputValue] = useState('');



	if (isLoading) {
		return <ActivityIndicator />;
	}

	if (error) {
		return <Text> Failed to fetch product </Text>;
	}


	return (
		<View style={styles.seacrhButton}>
				<TextInput
					placeholder="Search"
					clearButtonMode="always"
					style={styles.searchBox}
					autoCapitalize="none"
					value={inputValue}
					autoCorrect={false}
					onChangeText={() => {}}
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
		<View style={{padding: 10}}>
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

const styles = StyleSheet.create({
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
