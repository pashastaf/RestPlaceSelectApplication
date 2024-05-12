import {
	useCountryList,
	useDeleteDestination,
	useDestination,
	useInsertDestination,
	useUpdateDestination,
} from "@/src/api/destination";
import Button from "@/src/components/Button";
import { DefaultImage } from "@/src/components/DestinationListItem";
import Colors from "@/src/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
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

const CreateDestinationScreen = () => {
	const router = useRouter();
	const { id: idString } = useLocalSearchParams();
	const id = Number.parseFloat(
		typeof idString === "string" ? idString : idString?.[0],
	);

	const { data: countries } = useCountryList();
	const { mutate: insertDestination } = useInsertDestination();
	const { mutate: updateDestination } = useUpdateDestination();
	const { data: updatingDestination } = useDestination(id);
	const { mutate: deleteDestination } = useDeleteDestination();

	const [title, setTitle] = useState("");
	const [countryId, setCountryId] = useState("");
	const [errors, setErrors] = useState("");
	const [image, setImage] = useState<string | null>(null);
	const [openCountry, setOpenCountry] = useState(false);
	const [isLoading, setIsLoading] = useState(false);


	useEffect(() => {
		if (updatingDestination) {
			setTitle(updatingDestination.title);
			setCountryId(updatingDestination.countries_id);
			setImage(updatingDestination.image_path);
		}
	}, [updatingDestination]);

	if (!countries) {
		return <ActivityIndicator />;
	}

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

	const itemsCountry = countries.map((country) => ({
		label: country.title,
		value: country.id.toString(),
	}));

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					title: isUpdating
						? "Update Destination"
						: "Create Destination",
				}}
			/>
			<View style={[styles.container, { opacity: isLoading ? 0.2 : 1, pointerEvents: isLoading ? 'none' : 'auto' }]}>
			<RemoteImage
				path={updatingDestination?.image_path}
				fallback={DefaultImage}
				style={styles.image}
			/>
				<Text style={styles.textButton} onPress={pickImage}>
					Select Image
				</Text>
				<Text style={styles.title}>Title</Text>
				<TextInput
					placeholder="Destination name"
					style={styles.input}
					value={title}
					onChangeText={setTitle}
				/>
				<Text style={styles.title}>Country</Text>
				<DropDownPicker
					placeholder={
						isUpdating
							? `${countries.find((country) => country.id === countryId)
								?.title || "error"
							}`
							: "Select new item"
					}
					open={openCountry}
					value={countryId}
					items={itemsCountry}
					setOpen={setOpenCountry}
					setValue={setCountryId}
					setItems={() => { }}
					listMode="MODAL"
					searchable={true}
					searchPlaceholder="Search..."
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
				<ActivityIndicator size={80} color='gray' style={styles.activityIndicatorContainer} />)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
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
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: 'center',
	},
});

export default CreateDestinationScreen;
