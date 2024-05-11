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
import * as FileSystem from "expo-file-system"
import { randomUUID } from "expo-crypto";
import { supabase } from "@/src/lib/supabase";
import { decode } from "base64-arraybuffer";
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

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	const uploadImage = async () => {
		if (!image?.startsWith('file://')) {
			return console.log('1IF', image)
		}

		const base64 = await FileSystem.readAsStringAsync(image, {
			encoding: 'base64',
		});
		const filePath = `${randomUUID()}.png`;
		const contentType = 'image/png';
		const { data, error } = await supabase.storage
			.from('images')
			.upload(filePath, decode(base64), { contentType });

		if (error) {
			console.error('Error uploading image:', error);
			return null; // Возвращаем null в случае ошибки
		}

		if (data) {
			console.log('2IF', image)
			console.log('2IF', data.path)

			return data.path;
		}
	};

	if (!destinations || !features) {
		return <ActivityIndicator />;
	}

	const itemsDestination = destinations.map((destination) => ({
		label: destination.title,
		value: destination.id.toString(),
	}));

	const itemsFeatures = features.map((feature) => ({
		label: feature.title,
		value: feature.id,
	}));


	const [openDestination, setOpenDestination] = useState(false);
	const [openFeatures, setOpenFeatures] = useState(false);

	console.log(selectedFeatures)
	console.log(featuresByPlaceId)
	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					title: isUpdating ? "Update Rest Place" : "Create Rest Place",
					headerStyle: {
						backgroundColor: Colors.primary,
					},
					headerTintColor: Colors.textPrimary,
					headerTitleStyle: {
						fontWeight: 'bold',
					},
				}}
			/>
			<View style={styles.content}>
				<View style={{ opacity: isLoading ? 0.2 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}>
					<Image source={{ uri: image || DefaultImage }} style={styles.image} />
					<TouchableOpacity style={styles.selectImageButton} onPress={pickImage}>
						<Text style={styles.selectImageText}>Select Image</Text>
					</TouchableOpacity>
					<Text style={styles.label}>Title</Text>
					<TextInput placeholder="Rest place name" style={styles.input} value={title} onChangeText={setTitle} />
					<Text style={styles.label}>Destination</Text>
					<DropDownPicker
						style={styles.dropdown}
						placeholder={isUpdating ? `${destinations.find(destination => destination.id === destinationId)?.title || 'error'}` : 'Select new item'}
						open={openDestination}
						value={destinationId}
						items={itemsDestination}
						setOpen={setOpenDestination}
						setValue={setDestinationId}
						setItems={() => { }}
					/>
					<DropDownPicker
						style={styles.dropdown}
						dropDownContainerStyle={styles.dropdown}
						placeholder="Select features"
						placeholderStyle={{ color: 'gray' }}
						open={openFeatures}
						value={selectedFeatures}
						items={itemsFeatures}
						setOpen={setOpenFeatures}
						setValue={value => setSelectedFeatures(value)}
						setItems={() => { }}
						multiple={true}
						mode="BADGE"
						extendableBadgeContainer={true}
						badgeDotColors={['#e76f51', '#00b4d8', '#e9c46a', '#e76f51', '#8ac926', '#00b4d8', '#e9c46a']}
					/>
					<TouchableOpacity style={styles.button} onPress={onSubmit}>
						<Text style={styles.buttonText}>{isUpdating ? "Update" : "Create"}</Text>
					</TouchableOpacity>
					{isUpdating && (
						<TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
							<Text style={styles.deleteButtonText}>Delete</Text>
						</TouchableOpacity>
					)}
				</View>
				{isLoading && <ActivityIndicator size="large" color={Colors.primary} style={styles.activityIndicator} />}
			</View>
		</View>
	);
	};
	
	const Colors = {
		primary: '#DB4437', // Красный
		secondary: '#4285F4', // Синий
		background: '#F5F5F5', // Светло-серый
		textPrimary: '#333333', // Темно-серый
		textSecondary: '#757575', // Серый
		inputBackground: '#FFFFFF', // Белый
		buttonBackground: '#4CAF50', // Зеленый
		buttonTextColor: '#FFFFFF', // Белый
		deleteButtonBackground: '#FF5733', // Оранжевый (такой же, как и основной)
	};
	
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: Colors.background,
		},
		content: {
			flex: 1,
			paddingHorizontal: 20,
			paddingTop: 20,
		},
		image: {
			width: '100%',
			aspectRatio: 16 / 9,
			marginBottom: 20,
			borderRadius: 15,
		},
		selectImageButton: {
			alignSelf: 'flex-start',
			marginBottom: 10,
		},
		selectImageText: {
			color: Colors.primary,
			fontWeight: 'bold',
		},
		label: {
			fontSize: 16,
			color: Colors.textSecondary,
			marginBottom: 5,
		},
		input: {
			backgroundColor: Colors.inputBackground,
			paddingVertical: 15,
			paddingHorizontal: 20,
			borderRadius: 25,
			marginBottom: 20,
			color: Colors.textPrimary,
			fontSize: 16,
		},
		dropdown: {
			marginTop: 5,
			marginBottom: 20,
		},
		button: {
			backgroundColor: Colors.buttonBackground,
			paddingVertical: 15,
			borderRadius: 25,
			marginBottom: 10,
		},
		buttonText: {
			color: Colors.buttonTextColor,
			textAlign: 'center',
			fontWeight: 'bold',
		},
		deleteButton: {
			backgroundColor: Colors.deleteButtonBackground,
			paddingVertical: 15,
			borderRadius: 25,
			marginBottom: 10,
		},
		deleteButtonText: {
			color: Colors.buttonTextColor,
			textAlign: 'center',
			fontWeight: 'bold',
		},
		activityIndicator: {
			marginTop: 20,
		},
	});
	
	


export default CreateRestPlaceScreen;
