import { useDestinationList } from "@/src/api/destination";
import {
	useDeleteRestPlace,
	useInsertRestPlace,
	useRestPlace,
	useUpdateRestPlace,
} from "@/src/api/restplace";
import Button from "@/src/components/Button";
import RemoteImage from "@/src/components/RemoteImage";
import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import { Feather } from "@expo/vector-icons";
import { decode } from "base64-arraybuffer";
import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { DefaultImage } from "..";
import { FeaturesByPlacesId, useFeaturesByPlacesId, useFeaturesForPlaces } from "@/src/api/features";

const CreateRestPlaceScreen = () => {
	

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

	const resetFields = () => {
		setTitle("");
		setDestinationId("");
	};

	const validateInput = () => {
		setErrors("");
		if (!title) {
			setErrors("Title is required");
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

	const [itemsDestination, setItemDestinations] = useState(destinations.map((destination) => ({
		label: destination.title,
		value: destination.id.toString(),
	})));

	const itemsFeatures = features.map((feature) => ({
		label: feature.title,
		value: feature.id,
	}));


	const [openDestination, setOpenDestination] = useState(false);
	const [openFeatures, setOpenFeatures] = useState(false);

	const onDestinationOpen = useCallback(() => {
		setOpenFeatures(false);
	}, []);

	const onFeaturesOpen = useCallback(() => {
		setOpenDestination(false);
	}, []);

	console.log(selectedFeatures)
	console.log(featuresByPlaceId)
	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					title: isUpdating ? "Update Rest Place" : "Create Rest Place",
					headerTitleStyle: {
						fontWeight: 'bold',
					},
					headerLeft: () => (
						isUpdating ?
						<Link href= {`/(admin)/restplace/${updatingRestPlace.id}`} asChild>
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
						:
						<Link href= "/(admin)/restplace/" asChild>
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
				<View style={{ flexDirection: 'row', gap: 20 }}>
					<View style={{ flex: 1 }}>
					{isUpdating ? <RemoteImage
							path={updatingRestPlace.image_path}
							fallback={DefaultImage}
							style={styles.image}
						/> : <Image
							source={{ uri: image || DefaultImage }}
							style={styles.image}
						/>}
						<Text style={styles.textButton} onPress={pickImage}>
							Select Image
						</Text>
					</View>
					<View style={{ flex: 1 }}>
						<Text style={styles.title}>Title</Text>
						<TextInput
							placeholder="Destination name"
							style={styles.input}
							value={title}
							onChangeText={setTitle}
						/>
						<Text style={styles.title}>Destination</Text>
						<DropDownPicker
							style={{ zIndex: openFeatures ? 1 : 0 }}
							placeholder={isUpdating ? `${destinations.find(destination => destination.id === destinationId)?.title || 'error'}` : 'Select new item'}
							open={openDestination}
							onOpen={onDestinationOpen}
							value={destinationId}
							items={itemsDestination}
							setOpen={setOpenDestination}
							setValue={setDestinationId}
							setItems={() => { }}
						/>
					</View>
				</View>
				<DropDownPicker
					style={{ zIndex: openDestination ? 1 : 0, }}
					placeholder="Select features"
					placeholderStyle={{ color: 'gray' }}
					open={openFeatures}
					onOpen={onFeaturesOpen}
					value={selectedFeatures}
					items={itemsFeatures}
					setOpen={setOpenFeatures}
					setValue={value => setSelectedFeatures(value)}
					setItems={setItemDestinations}
					multiple={true}
					mode="BADGE"
					extendableBadgeContainer={true}
					dropDownDirection="TOP"
					selectedItemLabelStyle={{
						fontWeight: 'bold',
						opacity: 0.2
					}}
					badgeTextStyle={{
						fontSize: 12
					}}
					badgeDotColors={['#e76f51', '#00b4d8', '#e9c46a', '#8ac926', '#7209b7', '#f4a261', '#9a6324']}
				/>
				<View style={{ paddingHorizontal: 15 }}>
					<Button color={Colors.light.tint} onPress={onSubmit} text={isUpdating ? "Update" : "Create"} />
				</View>
			</View>
			{isLoading && <ActivityIndicator size="large" style={styles.activityIndicatorContainer} />}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		backgroundColor: 'white',
		justifyContent: 'space-between',
	},
	title: {
		color: "gray",
		fontSize: 16,
		marginBottom: 5,
	},
	input: {
		backgroundColor: "white",
		padding: 10,
		borderRadius: 10,
		borderWidth: 1,
		marginBottom: 20,
	},
	image: {
		width: '100%',
		aspectRatio: 1,
		alignSelf: "center",
	},
	textButton: {
		alignSelf: "center",
		fontWeight: "bold",
		color: 'lightblue',
		marginVertical: 10,
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




export default CreateRestPlaceScreen;
