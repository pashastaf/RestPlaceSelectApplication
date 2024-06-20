import { format } from "date-fns";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { useProfileList, useProfileByGroup } from "../api/profile";
import type { Order } from "../types";

type orderListItemProps = {
	order: Order;
};

const orderListItem = ({ order }: orderListItemProps) => {
	const { data: profiles } = useProfileList();
	const { data: consultants } = useProfileByGroup(2);

	return (
		<Link href={`/(admin)/order/create?id=${order.id}` as `${string}:${string}`} asChild>
			<Pressable style={styles.container}>
			<Text style={styles.text}>
					<Text style={{ fontWeight: 'bold' }}>Order #</Text>{" "}
					{
						order?.id
					}
				</Text>
				<Text style={styles.text}>
					<Text style={{ fontWeight: 'bold' }}>Client:</Text>{" "}
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
				<Text style={styles.text}>
					<Text style={{ fontWeight: 'bold' }}>Consultant:</Text>{" "}
					{
						consultants?.find(
							(consultant) => consultant.id === order.consultants_id,
						).first_name
					}{" "}
					{
						consultants?.find(
							(consultant) => consultant.id === order.consultants_id,
						).second_name
					}
				</Text>
				<Text style={styles.text}>
					<Text style={{ fontWeight: 'bold' }}>Sale date:</Text>{" "}
					{format(
						new Date(order.sale_date),
						"dd.MM.yyyy HH:mm:ss",
					)}
				</Text>
				<Text style={styles.text}>
					<Text style={{ fontWeight: 'bold' }}>Total const:</Text> {order.total_cost}
				</Text>
				<Text style={styles.text}>
					<Text style={{ fontWeight: 'bold' }}>Status:</Text> {order.orders_status?.title}
				</Text>
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
		borderWidth: 1,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	text: {
		fontSize: 16,
	},
	image: {
		width: "100%",
		aspectRatio: 1,
	},
});
