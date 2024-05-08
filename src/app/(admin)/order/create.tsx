import {
	useConsultantList,
	useDeleteOrder,
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
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, {
	useCallback,
	useEffect,
	useState
} from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
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
	const [selectedServices, setSelectedServices] = useState<number[]>(
		[],
	);
	const [totalCost, setTotalCost] = useState(0);

	const { data: profiles } = useProfileByGroup("user");
	const { data: consultants } = useConsultantList();
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

	if (updatingOrder) {
		console.log(
			updatingOrder.id,
			updatingOrder.profiles_id,
			updatingOrder.consultants_id,
		);
		console.log(serviceByOrder);
	}

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
		}
	}, [updatingOrder, serviceByOrder]);

	const router = useRouter();

	const resetFields = () => {};

	const onSubmit = () => {
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
					resetFields();
					router.back();
				},
			},
		);
	};

	const onUpdate = async () => {
		updateOrder(
			{ id, profileId, consultantId, totalCost },
			{
				onSuccess: () => {
					resetFields();
					router.back();
				},
			},
		);
	};

	const onDelete = () => {
		deleteOrder(id, {
			onSuccess: () => {
				resetFields();
				router.replace("/(admin)/order");
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

	return (
		<View style={styles.contrainer}>
			<Stack.Screen
				options={{
					title: isUpdating ? `Update Order #${id}` : "Create Order",
				}}
			/>
			<Text style={styles.title}> Consultant </Text>
			<DropDownPicker
				style={{ zIndex: openConsultants ? 1 : 0 }}
				placeholder={
					isUpdating
						? `${
								consultants.find(
									(consultant) => consultant.id === consultantId,
								)?.first_name || "error"
							} ${
								consultants.find(
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
				setItems={() => {}}
			/>
			<Text style={styles.title}> Client </Text>
			<DropDownPicker
				style={{ zIndex: openProfiles ? 1 : 0 }}
				placeholder={
					isUpdating
						? `${
								profiles.find((profile) => profile.id === profileId)
									?.first_name || "error"
							} ${
								profiles.find((profile) => profile.id === profileId)
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
				setItems={() => {}}
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
										backgroundColor: "lightgray",
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
				text={isUpdating ? "Update" : "Create"}
				onPress={onSubmit}
			/>
			{isUpdating && (
				<Text onPress={confirmDelete} style={styles.textButton}>
					{" "}
					Delete{" "}
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	contrainer: {
		flex: 1,
		padding: 10,
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
	textButton: {
		alignSelf: "center",
		fontWeight: "bold",
		color: Colors.light.tint,
		marginVertical: 10,
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
});

export default CreateOrderScreen;
