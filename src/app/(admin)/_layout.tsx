import { Feather } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React from "react";

import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/providers/AuthProvider";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {
	const { isAdmin } = useAuth();
	if (!isAdmin) {
		return <Redirect href={"/"} />;
	}

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#2f95dc",
				tabBarInactiveTintColor: "lightblue",
				tabBarLabelStyle: { fontSize: 13 },
				tabBarStyle: {
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
						<Feather
							name="home"
							color={color}
							size={28}
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
						<Feather
							name="umbrella"
							color={color}
							size={28}
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
						<Feather
							name="users"
							color={color}
							size={28}
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
						<Feather
							name="list"
							color={color}
							size={28}
							style={{ marginBottom: -3 }}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
