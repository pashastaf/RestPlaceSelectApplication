import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router";
import type React from "react";

import { useAuth } from "@/src/providers/AuthProvider";
import {
	FontAwesome6
} from "@expo/vector-icons";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return (
		<FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
	);
}

export default function TabLayout() {
	const { session, isAdmin, isConsultant, isManager } = useAuth();
	if (!session) {
		return <Redirect href={"/"} />;
	}
	if (isAdmin || isConsultant || isManager) {
		return <Redirect href={"/"} />;
	}

	return (
		<Tabs
			screenOptions={{
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
				name="select"
				options={{
					title: "Select",
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<FontAwesome6
							name="location-arrow"
							color={color}
							size={24}
							style={{ marginBottom: -3 }}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
