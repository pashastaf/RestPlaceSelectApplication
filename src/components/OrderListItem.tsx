import { format } from "date-fns";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { useConsultantList } from "../api/order";
import { useProfileList } from "../api/profile";
import type { Order } from "../types";

type orderListItemProps = {
	order: Order;
};

const orderListItem = ({ order }: orderListItemProps) => {
	const { data: profiles } = useProfileList();
	const { data: consultants } = useConsultantList();

	return (
		<Link href={`/(admin)/order/create?id=${order.id}`} asChild>
			<Pressable style={styles.container}>
				<Text style={styles.contry}>
					Consultant:{" "}
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
					Status: {order.status}{" "}
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
	image: {
		width: "100%",
		aspectRatio: 1,
	},
});
