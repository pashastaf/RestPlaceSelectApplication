import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React from "react";

import { useColorScheme } from "@/src/components/useColorScheme";
import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/providers/AuthProvider";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const { isAdmin } = useAuth();
	if (!isAdmin) {
		return <Redirect href={"/"} />;
	}

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "gray",
				tabBarInactiveTintColor: "lightgray",
				tabBarStyle: {
					backgroundColor: Colors.dark.tint,
					height: 60,
				},
			}}
		>
			<Tabs.Screen name="index" options={{ href: null }} />

			<Tabs.Screen
				name="destination"
				options={{
					title: "Destination",
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<FontAwesome6
							name="mountain-sun"
							color={color}
							size={24}
							style={{ marginBottom: -3 }}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="restplace"
				options={{
					title: "Rest Place",
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<FontAwesome6
							name="umbrella-beach"
							color={color}
							size={24}
							style={{ marginBottom: -3 }}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<MaterialIcons
							name="supervisor-account"
							color={color}
							size={30}
							style={{ marginBottom: -3 }}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="order"
				options={{
					title: "Order",
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<MaterialIcons
							name="list"
							color={color}
							size={30}
							style={{ marginBottom: -3 }}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
