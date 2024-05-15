import { format } from "date-fns";
import { Link } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useProfileList, useConsultantList } from "../api/profile";
import type { Order } from "../types";
import { useOrderStatusList } from "../api/order";

type orderListItemProps = {
	order: Order;
};

const orderListItem = ({ order }: orderListItemProps) => {
	const { data: profiles } = useProfileList();
	const { data: consultants } = useConsultantList();
	const { data: ordersStatus } = useOrderStatusList();

	return (
		<Link href={`/(admin)/order/create?id=${order.id}` as `${string}:${string}`} asChild>
			<Pressable style={styles.container}>
				<Text style={styles.contry}>
					Consultant:{" "}
					{
						consultants?.find(
							(consultant) => consultant.id === order.consultants_id,
						).profiles.first_name
					}{" "}
					{
						consultants?.find(
							(consultant) => consultant.id === order.consultants_id,
						).profiles.second_name
					}
				</Text>
				<Text style={styles.contry}>
					Client:{" "}
					{
						profiles?.find(
							(profile) => profile.id === order.profiles_id,
						).first_name
					}{" "}
					{
						profiles?.find(
							(profile) => profile.id === order.profiles_id,
						).second_name
					}
				</Text>
				<Text style={styles.contry}>
					Sale date:{" "}
					{format(
						new Date(order.sale_date),
						"dd.MM.yyyy HH:mm:ss",
					)}{" "}
				</Text>
				<Text style={styles.contry}>
					Order cost: {order.total_cost}{" "}
				</Text>
				<Text style={styles.contry}>
					Status: {order.orders_status?.title}{" "}
				</Text>

				<FlatList
					data={ordersStatus}
					horizontal
					style={{ marginBottom: 30 }}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ gap: 10, padding: 5 }}
					renderItem={({ item }) => {
						return (
							<TouchableOpacity style={styles.touchView}>
								<Text style={styles.flatText}>{item.title}</Text>
							</TouchableOpacity>
						)
					}}
				/>
			</Pressable>
		</Link>
	);
};

export default orderListItem;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		padding: 10,
		borderRadius: 20,
		flex: 1,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	contry: {
		fontSize: 14,
		fontWeight: "normal",
		color: "blue",
	},
	flatText: {
		alignSelf: "center",
		color: "black",
		fontSize: 10
	},
	touchView: {
		padding: 10,height: 40,
		borderRadius: 10,
		width: 70,
	},
});
