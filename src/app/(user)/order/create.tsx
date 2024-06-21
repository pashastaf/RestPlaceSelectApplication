import {
	useDeleteServiceByOrder,
	useInsertOrder,
	useInsertServiceByOrder,
	useOrder,
	useServiceList,
	useServicesByOrder,
	useUpdateOrder
} from "@/src/api/order";
import { useProfileByGroup } from "@/src/api/profile";
import Button from "@/src/components/Button";
import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/providers/AuthProvider";
import { Feather } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, {
	useEffect,
	useState
} from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from "react-native";

const CreateOrderScreen = () => {
	interface ServiceByOrderItem {
		id: number;
		services_id: number;
		order_id: number;
	}
	const {profile} = useAuth();
	const [selectedServices, setSelectedServices] = useState<number[]>([],);
	const [totalCost, setTotalCost] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const { data: profiles } = useProfileByGroup(1);
	const { data: consultants } = useProfileByGroup(2);
	const { data: services } = useServiceList();
	
	
	const currentDate = new Date(Date.now());
	
	const { id: idString } = useLocalSearchParams();
	const id = Number.parseFloat(
		typeof idString === "string" ? idString : idString?.[0],
		);
		const isUpdating = !!idString;
		
	const { mutate: insertOrder } = useInsertOrder();
	const { mutate: updateOrder } = useUpdateOrder();
	const { data: updatingOrder } = useOrder(id);
	const { data: serviceByOrder } = useServicesByOrder(id) as {
		data: ServiceByOrderItem[];
	};
	const { mutate: insertServiceByOrder } = useInsertServiceByOrder();
	const { mutate: deleteServiceByOrder } = useDeleteServiceByOrder();

	const initializeSelectedServices = (
		serviceByOrder: ServiceByOrderItem[],
	) => {
		const initialSelectedServices: number[] = [];
		let initialTotalCost = 0;

		if (serviceByOrder) {
			serviceByOrder.forEach((service) => {
				initialSelectedServices.push(service.services_id);
				if (services) {
					const serviceCost =
						services.find((s) => s.id === service.services_id)
							?.cost || 0;
					initialTotalCost += serviceCost;
				}
			});
		}

		setSelectedServices(initialSelectedServices);
		setTotalCost(initialTotalCost);
	};

	useEffect(() => {
		if (updatingOrder && serviceByOrder) {
			initializeSelectedServices(serviceByOrder);
		}
	}, [updatingOrder, serviceByOrder]);

	const router = useRouter();

	const onSubmit = () => {
		setIsLoading(true);
		if (isUpdating) {
			onUpdate();
		} else {
			onCreate();
		}
	};

	const onCreate = async () => {
		if (!totalCost || !currentDate) {
			console.error("Some required values are missing.");
			return;
		}
		insertOrder(
			{ profileId: profile.id, currentDate, totalCost },
			{
				onSuccess: (newOrder) => {
					const orderId = newOrder.id;
					selectedServices.forEach((serviceId) => {
						insertServiceByOrder({ orderId, serviceId });
					});
					router.back();
				},
			},
		);
	};

	const onUpdate = async () => {
		deleteServiceByOrder(
			id, 
			{
			onSuccess: async () => {
				updateOrder(
					{ id, totalCost },
					{
						onSuccess: async () => {
							const orderId = id;
							selectedServices.forEach((serviceId) => {
								insertServiceByOrder({ orderId, serviceId });
							});
							router.back();
						}
					},
				);
			},
			onError: (error) => {
				setIsLoading(false);
				console.error("Failed to delete order:", error);
			},
			}
		)
		
	};

	const toggleServiceSelection = (serviceId: number) => {
		if (services) {
			if (selectedServices.includes(serviceId)) {
				const serviceCost =
					services.find((service) => service.id === serviceId)
						?.cost || 0;
				setTotalCost((prevTotalCost) => prevTotalCost - serviceCost);
				setSelectedServices(
					selectedServices.filter((id) => id !== serviceId),
				);
			} else {
				const serviceCost =
					services.find((service) => service.id === serviceId)
						?.cost || 0;
				setTotalCost((prevTotalCost) => prevTotalCost + serviceCost);
				setSelectedServices([...selectedServices, serviceId]);
			}
		}
	};

	if (!consultants) {
		return <ActivityIndicator />;
	}

	if (!profiles) {
		return <ActivityIndicator />;
	}


	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					title: isUpdating ? `Update Order #${id}` : "Create Order",
					headerLeft: () => (
						<Link href="/(user)/order/" asChild>
								<Pressable>
									{({ pressed }) => (
										<Feather
											name="chevron-left"
											size={25}
											color={Colors.light.tint}
											style={{
												opacity: pressed ? 0.5 : 1,
												marginRight: 15,
											}}
										/>
									)}
								</Pressable>
							</Link>
					),
				}}
			/>
			<View style={[styles.container, { opacity: isLoading ? 0.2 : 1, pointerEvents: isLoading ? 'none' : 'auto' }]}>
				<Text style={styles.title}>Services </Text>
				<FlatList
					data={services}
					numColumns={2}
					columnWrapperStyle = {{ padding: 5}}
					renderItem={({ item }) => {
						return (
							<View style={styles.flatView}>
								<TouchableOpacity
									style={[
										styles.touchView,
										selectedServices.includes(item.id) && {
											backgroundColor: "lightblue",
										},
									]}
									onPress={() => toggleServiceSelection(item.id)}
								>
									<Text>{item.title}</Text>
								</TouchableOpacity>
							</View>
						);
					}}
				/>
				<Text style={styles.title}>Total Cost is: {totalCost} </Text>
				<Button
				color={Colors.light.tint}
					text={isUpdating ? "Update" : "Create"}
					onPress={onSubmit}
				/>
			</View>
			{isLoading && (
				<ActivityIndicator size={80} color='gray' style={styles.activityIndicatorContainer} />)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		backgroundColor: 'white'
	},
	title: {
		color: "gray",
		fontSize: 24,
		marginBottom:30,
		alignSelf: 'center'
	},
	input: {
		backgroundColor: "white",
		padding: 10,
		borderRadius: 20,
		marginTop: 10,
		marginBottom: 20,
	},
	image: {
		width: "50%",
		aspectRatio: 1,
		alignSelf: "center",
	},
	flatView: {
		width: "50%",
		height: 60,
		justifyContent: "center",
		alignItems: "center",
	},
	touchView: {
		borderWidth: 1,
		borderRadius: 20,
		width: "90%",
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	activityIndicatorContainer: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: 'center',
	},
});

export default CreateOrderScreen;
