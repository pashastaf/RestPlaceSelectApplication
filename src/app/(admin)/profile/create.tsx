import { useProfile, useUpdateProfile } from "@/src/api/profile";
import Button from "@/src/components/Button";
import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const CreateProfileScreen = () => {
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [secondName, setSecondName] = useState("");
	const [password, setPassword] = useState("");
	const [group, setGroup] = useState("");
	const [errors, setErrors] = useState("");

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
			setPassword(updatingProfile.password);
			setGroup(updatingProfile.group);
		}
	}, [updatingProfile]);

	const router = useRouter();

	const resetFields = () => {
		setFirstName("");
		setSecondName("");
		setEmail("");
		setPassword("");
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
		const { error } = await supabase.auth.admin.createUser({
			email,
			password,
			email_confirm: true,
			user_metadata: {
				email,
				password,
				firstName,
				secondName,
				fullName,
				group,
			},
		});
		if (error) Alert.alert(error.message);
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
			{ id, firstName, secondName, email, group, password },
			{
				onSuccess: () => {
					resetFields();
					router.back();
				},
			},
		);
		const fullName = `${secondName} ${firstName}`;
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
					group,
				},
			},
		);
		if (error) Alert.alert(error.message);
	};

	const onDelete = async () => {
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

	const [openGroup, setOpenGroup] = useState(false);
	const [items, setItems] = useState([
		{ label: "user", value: "user" },
		{ label: "consultant", value: "consultant" },
		{ label: "manager", value: "manager" },
		{ label: "admin", value: "admin" },
	]);

	return (
		<ScrollView style={styles.container}>
			<Stack.Screen
				options={{
					title: isUpdating ? "Update Profile" : "Create Profile",
				}}
			/>

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
			<Text style={styles.label}>Group</Text>
			<DropDownPicker
				style={{ zIndex: openGroup ? 1 : 0 }}
				placeholder={
					isUpdating
						? `${
								items.find((item) => item.value === group)?.label ||
								"error"
							}`
						: "Select group"
				}
				open={openGroup}
				value={group}
				items={items}
				setOpen={setOpenGroup}
				setValue={setGroup}
				setItems={setItems}
				listMode="MODAL"
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
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		flex: 1,
	},
	label: {
		color: "gray",
	},
	input: {
		borderWidth: 1,
		borderColor: "gray",
		padding: 10,
		marginTop: 5,
		marginBottom: 20,
		backgroundColor: "white",
		borderRadius: 5,
	},
	textButton: {
		alignSelf: "center",
		fontWeight: "bold",
		color: Colors.light.tint,
		marginVertical: 10,
	},
});

export default CreateProfileScreen;
