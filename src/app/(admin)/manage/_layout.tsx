import Colors from "@/src/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";


export default function DestinationStack() {
    return (
        <Stack>
        <Stack.Screen 
        name="index" 
        options={{ 
            title: "Manage", 
            headerRight: () => (
                <Link href="/(admin)/manage" asChild>
                <Pressable>
                    {({ pressed }) => (
                    <FontAwesome
                        name="cog"
                        size={25}
                        color={Colors.light.tint}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                    )}
                </Pressable>
                </Link>
            ),
        }}/>  
        </Stack>
    )
}