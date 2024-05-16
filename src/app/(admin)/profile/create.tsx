import { useProfile, useUpdateProfile } from "@/src/api/profile";
import Button from "@/src/components/Button";
import RemoteImage from "@/src/components/RemoteImage";
import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { decode } from "base64-arraybuffer";
import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	StyleSheet,
	Text,
	Image,
	TextInput,
	View,
	Pressable,
	TouchableOpacity,
	FlatList,
	ScrollView
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { DefaultAvatar } from "..";
import { Feather } from "@expo/vector-icons";


const CreateProfileScreen = () => {
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [secondName, setSecondName] = useState("");
	const [password, setPassword] = useState("");
	const [phone, setPhone] = useState("");
	const [groupId, setGroupId] = useState<number>(1);
	const [errors, setErrors] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [image, setImage] = useState<string | null>(null);

	const queryClient = useQueryClient();

	const { id: idString } = useLocalSearchParams();
	const id = Number.parseFloat(
		typeof idString === "string" ? idString : idString?.[0],
	);
	const isUpdating = !!idString;

	const { mutate: updateProfile } = useUpdateProfile();
	const { data: updatingProfile } = useProfile(id);

	useEffect(() => {
		if (updatingProfile) {
			setFirstName(updatingProfile.first_name);
			setSecondName(updatingProfile.second_name);
			setEmail(updatingProfile.email);
			setPhone(updatingProfile.phone);
			setPassword(updatingProfile.password);
			setGroupId(updatingProfile.group_id);
		}
	}, [updatingProfile]);

	const router = useRouter();

	const resetFields = () => {
		setFirstName("");
		setSecondName("");
		setEmail("");
		setPassword("");
		setPhone("");
	};



	const validateInput = () => {
		setErrors("");
		if (!firstName) {
			setErrors("First name is required");
			return false;
		}
		if (!secondName) {
			setErrors("Second name is required");
			return false;
		}
		if (!email) {
			setErrors("Email is required");
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
			console.log(errors);
			return;
		}
		const fullName = `${secondName} ${firstName}`;
		const avatarPath = await uploadImage();
		const { error } = await supabase.auth.admin.createUser({
			email,
			password,
			email_confirm: true,
			user_metadata: {
				email,
				phone,
				firstName,
				secondName,
				fullName,
				groupId,
				avatarPath
			},
		});
		console.log(email, password, firstName, secondName, phone, groupId, avatarPath)
		if (error) {
			console.log(error)
			Alert.alert(error.message);
		}
		else {
			queryClient.invalidateQueries({ queryKey: ["profiles"] });
			resetFields();
			router.back();
		}
	};

	const onUpdate = async () => {
		if (!validateInput()) {
			console.log(errors);
			console.log(firstName, secondName);
			return;
		}
		updateProfile(
			{ id, firstName, secondName, email, groupId, password },
			{
				onSuccess: () => {
					resetFields();
					router.back();
				},
			},
		);
		const fullName = `${secondName} ${firstName}`;
		const avatarPath = await uploadImage();
		const { error } = await supabase.auth.admin.updateUserById(
			updatingProfile.auth_id,
			{
				email: email,
				password: password,
				user_metadata: {
					email,
					password,
					firstName,
					secondName,
					fullName,
					groupId,
					avatarPath,
				},
			},
		);
		if (error) {
			Alert.alert(error.message);
		}
		else {
			queryClient.invalidateQueries({ queryKey: ["profiles"] });
			resetFields();
			router.back();
		}
	};

	const onDelete = async () => {
		setIsLoading(true)
		const { error } = await supabase.auth.admin.deleteUser(
			updatingProfile.auth_id,
		);
		if (error) Alert.alert(error.message, updatingProfile.auth_id);
		else {
			await queryClient.invalidateQueries({ queryKey: ["profiles"] });
			router.replace("/(admin)/profile/");
		}
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
			return null;
		}

		if (data) {
			return data.path;
		}
	};

	const [openGroupId, setOpenGroupId] = useState(false);
	const [items, setItems] = useState([
		{ label: "user", value: 1, color: '#8ac926' },
		{ label: "consult", value: 2, color: '#e76f51' },
		{ label: "manager", value: 3, color: '#e9c46a' },
		{ label: "admin", value: 4, color: '#00b4d8' },
	]);

	return (
		<ScrollView style={styles.container}>
			<Stack.Screen
				options={{
					title: isUpdating ? "Update Profile" : "Create Profile",
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
				{isUpdating ? <RemoteImage
					path={updatingProfile?.avatar_url}
					fallback={DefaultAvatar}
					style={styles.image}
				/> : <Image
					source={{ uri: image || DefaultAvatar }}
					style={styles.image}
				/>}
				<TouchableOpacity onPress={pickImage}>
					<Text style={styles.textButton}>Select Image</Text>
				</TouchableOpacity>
				<View style={{ flexDirection: 'row', gap: 20 }}>
					<View style={{ flex: 1 }}>
						<Text style={styles.label}>Name</Text>
						<TextInput
							value={firstName}
							onChangeText={setFirstName}
							placeholder="Jhon"
							style={styles.input}
						/>
						<Text style={styles.label}>Second Name</Text>
						<TextInput
							value={secondName}
							onChangeText={setSecondName}
							placeholder="Dou"
							style={styles.input}
						/>
						<Text style={styles.label}>Phone</Text>
						<TextInput
							value={phone}
							onChangeText={setPhone}
							placeholder="+79771267179"
							style={styles.input}
						/>
					</View>
					<View style={{ flex: 1 }}>
						<Text style={styles.label}>Email</Text>
						<TextInput
							value={email}
							onChangeText={setEmail}
							placeholder="pashastaf@gmail.com"
							style={styles.input}
						/>
						<Text style={styles.label}>Password</Text>
						<TextInput
							value={password}
							onChangeText={setPassword}
							placeholder=""
							style={styles.input}
							secureTextEntry
						/>
						{/* <DropDownPicker
							style={[styles.input , { zIndex: openGroupId ? 1 : 0 }]}
							placeholder={
								isUpdating
									? `${items.find((item) => item.value === groupId)?.label || "error"
									}`
									: "Select groupId"
							}
							dropDownContainerStyle={{ marginBottom: 20}}
							open={openGroupId}
							value={groupId}
							items={items}
							setOpen={setOpenGroupId}
							setValue={(setGroupId)}
							setItems={setItems}
						/> */}
					</View>
				</View>
				<Text style={styles.label}>Groups: </Text>
				<FlatList
					data={items}
					horizontal
					style={{ marginBottom: 30 }}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ gap: 10, padding: 5 }}
					renderItem={({ item }) => {
						return (
							<TouchableOpacity style={[styles.touchView, {backgroundColor: item.color}]}>
								<Text style={styles.flatText}>{item.label}</Text>
							</TouchableOpacity>
						)
					}}
				/>
				<Button
					text={isUpdating ? "Update" : "Create"}
					onPress={onSubmit}
					color={Colors.light.tint}
				/>
			</View>
			{isLoading && (
				<ActivityIndicator size={80} color='gray' style={styles.activityIndicatorContainer} />
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 10,
		flex: 1,
		backgroundColor: 'white',
	},
	label: {
		fontWeight: 'bold',
		fontSize: 18
	},
	input: {
		borderWidth: 1,
		padding: 10,
		marginTop: 5,
		marginBottom: 10,
		backgroundColor: "white",
		borderRadius: 8,
	},
	image: {
		width: '25%',
		aspectRatio: 1,
		alignSelf: "center",
		borderRadius: 100,
	},
	textButton: {
		alignSelf: "center",
		fontWeight: "bold",
		color: Colors.light.tint,
		marginVertical: 5,
	},
	activityIndicatorContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		justifyContent: 'center'
	},
	flatText: {
		alignSelf: "center",
		color: "black",
	},
	touchView: {
		padding: 10,height: 40,
		borderRadius: 10,
		width: 70,
	},
});

export default CreateProfileScreen;
