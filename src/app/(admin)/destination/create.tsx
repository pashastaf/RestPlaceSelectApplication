import {
	useCountryList,
	useDeleteDestination,
	useDestination,
	useInsertDestination,
	useUpdateDestination,
} from "@/src/api/destination";
import Button from "@/src/components/Button";
import Colors from "@/src/constants/Colors";
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
import * as FileSystem from "expo-file-system"
import { randomUUID } from "expo-crypto";
import { supabase } from "@/src/lib/supabase";
import { decode } from "base64-arraybuffer";
import RemoteImage from "@/src/components/RemoteImage";
import { Feather } from "@expo/vector-icons";
import { FeaturesByDestination, useFeaturesByDestinationId, useFeaturesForDestinations } from '@/src/api/features'
import { DefaultImage } from "..";

const CreateDestinationScreen = () => {
	const router = useRouter();
	const { id: idString } = useLocalSearchParams();
	const id = Number.parseFloat(
		typeof idString === "string" ? idString : idString?.[0],
	);

	const { data: countries } = useCountryList();
	const { data: updatingDestination } = useDestination(id);
	const { data: featuresByDestinationId } = useFeaturesByDestinationId(id);
	const { data: features } = useFeaturesForDestinations();

	const { mutate: insertDestination } = useInsertDestination();
	const { mutate: updateDestination } = useUpdateDestination();
	const { mutate: deleteDestination } = useDeleteDestination();

	const [title, setTitle] = useState("");
	const [countryId, setCountryId] = useState("");
	const [errors, setErrors] = useState("");
	const [image, setImage] = useState<string | null>(null);
	const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const initializeSelectedFeatures = (
		featuresByDestinationId: FeaturesByDestination[],
	) => {
		const initialSelectedServices: number[] = [];

		if (featuresByDestinationId) {
			featuresByDestinationId.forEach((features) => {
				initialSelectedServices.push(features.features_id);
			});
		}
		setSelectedFeatures(initialSelectedServices);
	};

	useEffect(() => {
		if (updatingDestination && featuresByDestinationId) {
			setTitle(updatingDestination.title);
			setCountryId(updatingDestination.countries_id);
			setImage(updatingDestination.image_path);
			initializeSelectedFeatures(featuresByDestinationId);
		}
	}, [updatingDestination, featuresByDestinationId]);


	const isUpdating = !!idString;

	const resetFields = () => {
		setTitle("");
		setCountryId("");
	};

	const validateInput = () => {
		setErrors("");
		if (!title) {
			setErrors("Name is required");
			return false;
		}
		if (!countryId) {
			setErrors("Country ID is required");
			return false;
		}
		return true;
	};

	const onSubmit = () => {
		setIsLoading(true);
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
		const imagePath = await uploadImage();
		insertDestination(
			{ title, countryId, imagePath },
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
		const imagePath = await uploadImage();

		updateDestination(
			{ id, title, countryId, imagePath },
			{
				onSuccess: () => {
					resetFields();
					router.back();
				},
			},
		);
	};

	const onDelete = () => {
		setIsLoading(true);
		deleteDestination(id, {
			onSuccess: () => {
				resetFields();
				router.replace("/(admin)/destination");
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

	const [openCountry, setOpenCountry] = useState(false);
	const [openFeatures, setOpenFeatures] = useState(false);

	const onCountryOpen = useCallback(() => {
		setOpenFeatures(false);
	}, []);

	const onFeaturesOpen = useCallback(() => {
		setOpenCountry(false);
	}, []);

	if (!countries || !features) {
		return <ActivityIndicator />;
	}

	const itemsCountry = countries.map((country) => ({
		label: country.title,
		value: country.id.toString(),
	}));

	const itemsFeatures = features.map((feature) => ({
		label: feature.title,
		value: feature.id,
	}));

	console.log(selectedFeatures)

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					title: isUpdating ? "Update Destination" : "Create Destination",
					headerTitleStyle: {
						fontWeight: 'bold',
					},
					headerLeft: () => (
						isUpdating ?
						<Link href= {`/(admin)/destination/${updatingDestination.id}`} asChild>
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
						<Link href= "/(admin)/destination/" asChild>
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
					<View style={styles.viewBlock}>
						{isUpdating ? <RemoteImage
							path={updatingDestination.image_path}
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
					<View style={styles.viewBlock}>
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
							placeholder={isUpdating ? `${countries.find(country => country.id === countryId)?.title || 'error'}` : 'Select new item'}
							open={openCountry}
							onOpen={onCountryOpen}
							value={countryId}
							items={itemsCountry}
							setOpen={setOpenCountry}
							setValue={setCountryId}
							setItems={() => { }}
						/>
					</View>
				</View>
				<DropDownPicker
					style={{ zIndex: openCountry ? 1 : 0, }}
					placeholder="Select features"
					placeholderStyle={{ color: 'gray' }}
					open={openFeatures}
					onOpen={onFeaturesOpen}
					value={selectedFeatures}
					items={itemsFeatures}
					setOpen={setOpenFeatures}
					setValue={value => setSelectedFeatures(value)}
					setItems={() => {}}
					dropDownDirection="TOP"
					multiple={true}
					mode="BADGE"
					selectedItemLabelStyle={{
						fontWeight: 'bold',
						opacity: 0.2
					}}
					badgeTextStyle={{
						fontSize: 12
					}}
					extendableBadgeContainer={true}
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
	viewBlock: {
		flex: 1,
	},
});

export default CreateDestinationScreen;
