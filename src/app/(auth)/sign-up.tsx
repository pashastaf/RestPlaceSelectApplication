import Button from "@/src/components/Button";
import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import { decode } from "base64-arraybuffer";
import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from "react-native";
import { DefaultAvatar } from "../(admin)";
import { Stack } from "expo-router";

const SignUpScreen = () => {
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [firstName, setFirstName] = useState("");
	const [secondName, setSecondName] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [image, setImage] = useState<string | null>(null);

	async function signUpWithEmail() {
		const fullName = `${secondName} ${firstName}`;
		const avatarPath = await uploadImage();
		setIsLoading(true);
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					email,
					phone,
					firstName,
					secondName,
					fullName,
					groupId: 1,
				},
			},
		});

		if (error) Alert.alert(error.message);
		setIsLoading(false);
	}

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
		<View style={styles.container}>
			<Stack.Screen options={{ title: "Sign up" }} />
			<View style={[styles.container, { opacity: isLoading ? 0.2 : 1, pointerEvents: isLoading ? 'none' : 'auto' }]}>
				<View>
				<Image
					source={{ uri: image || DefaultAvatar }}
					style={styles.image}
				/>
				<TouchableOpacity onPress={pickImage}>
					<Text style={styles.textButton}>Select Image</Text>
				</TouchableOpacity>
				</View>
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
					</View>
				</View>
				<Button
					text="Create"
					onPress={signUpWithEmail}
					color={Colors.light.tint}
				/>
			</View>
			{isLoading && (
				<ActivityIndicator size={80} color='gray' style={styles.activityIndicatorContainer} />
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 10,
		flex: 1,
		backgroundColor: 'white',
		justifyContent: 'space-around'
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
		padding: 10, height: 40,
		borderRadius: 10,
		width: 70,
	},
});

export default SignUpScreen;
