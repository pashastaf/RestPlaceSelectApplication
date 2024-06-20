import {
	useDeleteOrder,
	useDeleteServiceByOrder,
	useInsertOrder,
	useInsertServiceByOrder,
	useOrder,
	useServiceList,
	useServicesByOrder,
	useUpdateOrder,
} from "@/src/api/order";
import { useProfileByGroup } from "@/src/api/profile";
import Button from "@/src/components/Button";
import Colors from "@/src/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, {
	useCallback,
	useEffect,
	useState
} from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const CreateOrderScreen = () => {
	interface ServiceByOrderItem {
		id: number;
		services_id: number;
		order_id: number;
	}

	const [profileId, setProfileId] = useState();
	const [consultantId, setConsultantId] = useState();
	const [selectedServices, setSelectedServices] = useState<number[]>([],);
	const [totalCost, setTotalCost] = useState(0);
	const [selectedStatus, setSelectedStatus] = useState<number>(1);
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
	const { mutate: deleteOrder } = useDeleteOrder();
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
			setProfileId(updatingOrder.profiles_id);
			setConsultantId(updatingOrder.consultants_id);
			initializeSelectedServices(serviceByOrder);
			setSelectedStatus(updatingOrder.status_id)
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
		if (!profileId || !consultantId || !totalCost || !currentDate) {
			console.log(profileId);
			console.log(consultantId);
			console.log(totalCost);
			console.log(currentDate);
			console.error("Some required values are missing.");
			return;
		}
		insertOrder(
			{ profileId, consultantId, currentDate, totalCost },
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

	console.log('Изначально', selectedServices)
	console.log("Заказ", id)

	const onUpdate = async () => {
		deleteServiceByOrder(
			id, 
			{
			onSuccess: async () => {
				updateOrder(
					{ id, profileId, consultantId, totalCost, status_id: selectedStatus },
					{
						onSuccess: async () => {
							const orderId = id;
							selectedServices.forEach((serviceId) => {
								insertServiceByOrder({ orderId, serviceId });
								console.log('Временный', selectedServices);
								console.log("Добавлено ", orderId, serviceId);
							});
							router.back();
						},
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

	const onDelete = () => {
		setIsLoading(true);
		deleteOrder(id, {
			onSuccess: () => {
				setIsLoading(false); // Сбрасываем состояние загрузки
				router.replace("/(admin)/order");
			},
			onError: (error) => {
				setIsLoading(false); // Сбрасываем состояние загрузки
				console.error("Failed to delete order:", error);
			},
		});
	};

	const confirmDelete = () => {
		Alert.alert(
			"Confirm",
			"Are you sure you want to delete this product",
			[
				{
					text: "Cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: onDelete,
				},
			],
		);
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

	const [openConsultants, setOpenConsultants] = useState(false);
	const [openProfiles, setOpenProfiles] = useState(false);

	const onProfilesOpen = useCallback(() => {
		setOpenConsultants(false);
	}, []);

	const onConsultantsOpen = useCallback(() => {
		setOpenProfiles(false);
	}, []);

	if (!consultants) {
		return <ActivityIndicator />;
	}

	if (!profiles) {
		return <ActivityIndicator />;
	}

	const itemsConsultant = consultants.map((consultant) => ({
		label: `${consultant.first_name} ${consultant.second_name}`,
		value: consultant.id.toString(),
	}));

	const itemsProfiles = profiles.map((profile) => ({
		label: `${profile.first_name} ${profile.second_name}`,
		value: profile.id.toString(),
	}));

	const items = [
		{ label: "In process", value: 1, color: 'white' },
		{ label: "Under review", value: 2, color: 'white' },
		{ label: "In the work", value: 3, color: 'white' },
		{ label: "Completed", value: 4, color: 'white' },
	];


	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					title: isUpdating ? `Update Order #${id}` : "Create Order",
					headerLeft: () => (
						<Link href= "/(admin)/order" asChild>
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
					headerRight: () => (
						isUpdating &&
						<Pressable>
							{({ pressed }) => (
								<Feather
									onPress={confirmDelete}
									name="trash-2"
									color='red'
									size={25}
									style={{
										opacity: pressed ? 0.5 : 1,
									}}
								/>
							)}
						</Pressable>
					)
				}}
			/>
			<View style={[styles.container, { opacity: isLoading ? 0.2 : 1, pointerEvents: isLoading ? 'none' : 'auto' }]}>
				<Text style={styles.title}> Consultant </Text>
				<DropDownPicker
					style={{ zIndex: openConsultants ? 1 : 0 }}
					placeholder={
						isUpdating
							? `${consultants.find(
								(consultant) => consultant.id === consultantId,
							)?.first_name || "error"
							} ${consultants.find(
								(consultant) => consultant.id === consultantId,
							)?.second_name || "fetch"
							}`
							: "Select new item"
					}
					open={openConsultants}
					onOpen={onConsultantsOpen}
					value={consultantId}
					items={itemsConsultant}
					setOpen={setOpenConsultants}
					setValue={setConsultantId}
					setItems={() => { }}
				/>
				<Text style={styles.title}> Client </Text>
				<DropDownPicker
					style={{ zIndex: openProfiles ? 1 : 0 }}
					placeholder={
						isUpdating
							? `${profiles.find((profile) => profile.id === profileId)
								?.first_name || "error"
							} ${profiles.find((profile) => profile.id === profileId)
								?.second_name || "fetch"
							}`
							: "Select new item"
					}
					open={openProfiles}
					onOpen={onProfilesOpen}
					value={profileId}
					items={itemsProfiles}
					setOpen={setOpenProfiles}
					setValue={setProfileId}
					setItems={() => { }}
				/>

				<Text style={styles.title}>Services </Text>
				<FlatList
					data={services}
					numColumns={2}
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
				<FlatList
							data={items}
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{ gap: 10, padding: 10 }}
							renderItem={({ item }) => {
								const isSelected = selectedStatus === item.value; // Проверяем, выбран ли данный статус
								return (
									<TouchableOpacity
										style={[
											styles.statusView,
											{ backgroundColor: isSelected ? 'lightblue' : item.color },]}
										onPress={() => { setSelectedStatus(item.value); }}>
										<Text style={styles.flatText}>{item.label}</Text>
									</TouchableOpacity>
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
		backgroundColor: 'white',
	},
	title: {
		color: "gray",
		fontSize: 20,
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
	flatText: {
		alignSelf: "center",
		color: "black",
	},
	statusView: {
		padding: 10,
		height: 40,
		borderRadius: 10,
		width: 100,
		borderWidth: 1,
	},
});

export default CreateOrderScreen;
