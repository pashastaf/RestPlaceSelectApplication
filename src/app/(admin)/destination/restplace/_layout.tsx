import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Colors from '@/src/constants/Colors';

export default function DestinationStack() {
    return (
    <Stack > 
        <Stack.Screen 
            name="index" 
            options={{ 
                title: "Destination", 
                headerRight: () => (
                    <Link href="/(admin)/destination/create" asChild>
                    <Pressable>
                        {({ pressed }) => (
                        <FontAwesome
                            name="plus"
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