import { useProfile } from "@/src/api/profile";
import Button from "@/src/components/Button";
import RemoteImage from "@/src/components/RemoteImage";
import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { decode } from "base64-arraybuffer";
import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
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
import { DefaultAvatar } from ".";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/providers/AuthProvider";


const SettingsScreen = () => {
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


	const { profile } = useAuth();
	const { data: updatingProfile } = useProfile(profile.id);


	useEffect(() => {
		const fetchData = async () => {
      if (updatingProfile) {
        setFirstName(updatingProfile.first_name);
        setSecondName(updatingProfile.second_name);
        setEmail(updatingProfile.email);
        setPhone(updatingProfile.phone);
        setGroupId(updatingProfile.group_id);
      }
    };
    fetchData();
  }, [updatingProfile]);

	const router = useRouter();


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
		if (!password) {
			setErrors("Password is required");
			return false;
		}
		return true;
	};

	const onSubmit = () => {
		setIsLoading(true)
		onUpdate();
	};

	const onUpdate = async () => {
		if (!validateInput()) {
			console.log(errors);
			setIsLoading(false)
			Alert.alert('Validate error', errors, [
				{text: 'OK'},
			]);
			return;
		}
		const fullName = `${secondName} ${firstName}`;
		const avatarPath = await uploadImage();
		console.log(email, password, firstName, secondName, phone, groupId, avatarPath)
		const { error } = await supabase.auth.admin.updateUserById(
			updatingProfile.auth_id,
			{
				email: email,
				password: password,
				user_metadata: {
					password,
					email,
					phone,
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
			setIsLoading(false);
			router.back();
		}
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

	return (
		<ScrollView style={styles.container}>
			<Stack.Screen
				options={{
					title: 'Settings',
					headerLeft: () => (
						<Link href= "/(admin)/profile" asChild>
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
				<RemoteImage
					path={updatingProfile?.avatar_url}
					fallback={DefaultAvatar}
					style={styles.image}
				/>
				<TouchableOpacity onPress={pickImage}>
					<Text style={styles.textButton}>Select Image</Text>
				</TouchableOpacity>
				<View style={{ gap: 20 }}>
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
					</View>
				</View>
				<Button
					text='Change'
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
		borderWidth: 1.3,
	},
});

export default SettingsScreen;
