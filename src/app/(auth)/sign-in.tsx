import Button from "@/src/components/Button";
import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import {
	Link,
	Stack
} from "expo-router";
import React, { useState } from "react";
import {
	Alert,
	StyleSheet,
	Text,
	TextInput,
	View,
	Image,
} from "react-native";


const SignInScreen = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	async function signInWithEmail() {
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) Alert.alert(error.message);
		setLoading(false);
	}

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ title: "Sign in" }} />
			<Image
				source={{
          uri: 'https://raw.githubusercontent.com/pashastaf/RestPlaceSelectApplication/main/assets/images/Designer.jpeg',
        }}
				style={styles.image}
			/>
			<Text style={styles.label}>Login</Text>
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
				placeholder="Enter..."
				style={styles.input}
				secureTextEntry
			/>
			<Button
				onPress={signInWithEmail}
				disabled={loading}
				color={Colors.light.tint}
				text={loading ? "Signing in..." : "Sign in"}
			/>
			<Link href="/sign-up" style={styles.textButton}>
				Create an account
			</Link>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		justifyContent: "center",
		flex: 1,
		backgroundColor: 'white'
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
	image: {
		width: '100%',
		aspectRatio: 1,
		alignSelf: "center",
		borderRadius: 200,
	},
});

export default SignInScreen;
