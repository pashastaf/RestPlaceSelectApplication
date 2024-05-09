import { useDestinationList } from "@/src/api/destination";
import {
	useDeleteRestPlace,
	useFeaturesByPlacesId,
	useFeaturesForPlaces,
	useInsertRestPlace,
	useRestPlace,
	useUpdateRestPlace,
} from "@/src/api/restplace";
import Button from "@/src/components/Button";
import { DefaultImage } from "@/src/components/DestinationListItem";
import Colors from "@/src/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const CreateRestPlaceScreen = () => {
	interface FeaturesByPlacesId {
		id: number;
		features_id: number;
		rest_places_id: number;
		features: {
			id: number;
			title: number;
		}
	}

	// Определение состояний и хуков маршрутизатора
    const router = useRouter();
    const { id: idString } = useLocalSearchParams();
    const id = Number.parseFloat(
        typeof idString === "string" ? idString : idString?.[0]
    );
    const isUpdating = !!idString;

    // CRUD группа хуков
    const { data: updatingRestPlace } = useRestPlace(id);
    const { mutate: insertRestPlace } = useInsertRestPlace();
    const { mutate: updateRestPlace } = useUpdateRestPlace();
    const { mutate: deleteRestPlace } = useDeleteRestPlace();

    // Группа хуков для работы с данными
    const { data: destinations } = useDestinationList();
    const { data: featuresByPlaceId } = useFeaturesByPlacesId(id);
    const { data: features } = useFeaturesForPlaces();

    // Определение состояний компонента
    const [title, setTitle] = useState("");
    const [destinationId, setDestinationId] = useState("");
    const [errors, setErrors] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);

	// Инициализация выбранных элементов
	const initializeSelectedFeatures = (
		featuresByPlaceId: FeaturesByPlacesId[],
	) => {
		const initialSelectedServices: number[] = [];

		if (featuresByPlaceId) {
			featuresByPlaceId.forEach((features) => {
				initialSelectedServices.push(features.features_id);
			});
		}
		setSelectedFeatures(initialSelectedServices);
	};

	useEffect(() => {
		if (updatingRestPlace && featuresByPlaceId) {
			setTitle(updatingRestPlace.title);
			setDestinationId(updatingRestPlace.destinations_id);
			initializeSelectedFeatures(featuresByPlaceId);
		}
	}, [updatingRestPlace, featuresByPlaceId]);

	const toggleFeaturesSelection = (featuresId: number) => {
		if (featuresByPlaceId) {
			if (selectedFeatures.includes(featuresId)) {
				setSelectedFeatures(
					selectedFeatures.filter((id) => id !== featuresId),
				);
			} else {
				setSelectedFeatures([...selectedFeatures, featuresId]);
			}
		}
	};

	const resetFields = () => {
		setTitle("");
		setDestinationId("");
	};

	const validateInput = () => {
		setErrors("");
		if (!title) {
			setErrors("Name is required");
			return false;
		}
		if (!destinationId) {
			setErrors("Destination ID is required");
			return false;
		}
		return true;
	};

	const onSubmit = () => {
		setIsLoading(true)
		if (isUpdating) {
			onUpdate();
		} else {
			onCreate();
		}
	};

	const onCreate = async () => {
		if (!validateInput()) {
			return;
		}
		insertRestPlace(
			{ title, destinationId },
			{
				onSuccess: () => {
					resetFields();
					router.back();
				},
			},
		);
	};

	const onUpdate = async () => {
		if (!validateInput()) {
			return;
		}
		updateRestPlace(
			{ id, title, destinationId },
			{
				onSuccess: () => {
					resetFields();
					router.back();
				},
			},
		);
	};

	const onDelete = () => {
		setIsLoading(true)
		deleteRestPlace(id, {
			onSuccess: () => {
				resetFields();
				router.replace("/(admin)/restplace/");
			},
		});
	};

	const confirmDelete = () => {
		Alert.alert(
			"Confirm",
			"Are you sure you want to delete this rest place",
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

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	if (!destinations) {
		return <ActivityIndicator />;
	}

	const itemsDestination = destinations.map((destination) => ({
		label: destination.title,
		value: destination.id.toString(),
	}));

	const [openDestination, setOpenDestination] = useState(false);


	console.log(selectedFeatures)
	console.log(featuresByPlaceId)
	return (
		<View style={styles.contrainer}>
			<Stack.Screen
				options={{
					title: isUpdating
						? "Update Rest Place"
						: "Create Rest Place",
				}}
			/>
			<View style={[styles.contrainer, { opacity: isLoading ? 0.2 : 1, pointerEvents: isLoading ? 'none' : 'auto' }]}>
				<Image
					source={{ uri: image || DefaultImage }}
					style={styles.image}
				/>
				<Text style={styles.textButton} onPress={pickImage}>
					Select Image
				</Text>
				<Text style={styles.title}>Title</Text>
				<TextInput
					placeholder="Rest place name"
					style={styles.input}
					value={title}
					onChangeText={setTitle}
				/>
				<Text style={styles.title}>Destination</Text>
				<DropDownPicker
					placeholder={
						isUpdating
							? `${destinations.find(
								(destination) => destination.id === destinationId,
							)?.title || "error"
							}`
							: "Select new item"
					}
					open={openDestination}
					value={destinationId}
					items={itemsDestination}
					setOpen={setOpenDestination}
					setValue={setDestinationId}
					setItems={() => { }}
				/>
				<FlatList 
				data={features}
				numColumns={2}
				renderItem={({ item }) => {
					return (
						<View style={styles.flatView}>
								<TouchableOpacity
									style={[
										styles.touchView,
										selectedFeatures.includes(item.id) && {
											backgroundColor: "lightgray",
										},
									]}
									onPress={() => toggleFeaturesSelection(item.id)}
								>
									<Text>{item.title}</Text>
								</TouchableOpacity>
							</View>
					)
				}}
				/>
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
			{isLoading && (
				<ActivityIndicator size={80} color='gray' style={styles.activityIndicatorContainer} />
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
		fontSize: 16,
	},
	input: {
		backgroundColor: "white",
		padding: 10,
		borderRadius: 5,
		marginTop: 5,
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
	activityIndicatorContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		justifyContent: 'center'
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

export default CreateRestPlaceScreen;
