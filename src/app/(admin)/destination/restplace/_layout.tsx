import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Colors from '@/src/constants/Colors';

export default function RestPlaceStack() {
    return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
    )
}