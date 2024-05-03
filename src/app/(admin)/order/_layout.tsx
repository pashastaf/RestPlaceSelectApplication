import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Colors from '@/src/constants/Colors';
import { ScreenStackHeaderSearchBarView } from "react-native-screens";

export default function ProfileStack() {
    return (
        <Stack > 
        <Stack.Screen 
            name="index" 
            options={{ 
                title: "Orders", 
                headerRight: () => (
                    <Link href="/(admin)/order/create" asChild>
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