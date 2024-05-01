import React from 'react';
import { View, Text , Image, StyleSheet, Pressable, FlatList} from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';
import { useProfile } from '@/src/api/profile';

const ProfileDetailScreen = () => {
  const { id: idSting } = useLocalSearchParams();
  const id = parseFloat(typeof idSting === 'string' ? idSting : idSting[0])

  const {data: profile} = useProfile(id);


  if (!profile) {
    return <Text> profiles not found</Text>
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
            options={{ 
                title: profile.second_name + ' ' + profile.first_name, 
                headerRight: () => (
                    <Link href={`/(admin)/manage/profile/create?id=${id}`} asChild>
                    <Pressable>
                        {({ pressed }) => (
                        <FontAwesome
                            name="pencil"
                            size={25}
                            color={Colors.light.tint}
                            style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                        />
                        )}
                    </Pressable>
                    </Link>
                ),
            }}/>   
            
      <Text style={styles.contry}> {profile.group} </Text>
      <Text style={styles.contry}> {profile.created_at} </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 10
  },
  image: {
    width: '100%',
    aspectRatio: 1
  },
  contry: {
    fontSize: 18,
    fontWeight: "bold"
  }
});


export default ProfileDetailScreen;