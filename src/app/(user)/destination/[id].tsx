import React from 'react';
import { View, Text , Image, StyleSheet, Pressable, FlatList} from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { DefaultImage } from '@/src/components/DestinationListItem';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';
import { useDestination } from '@/src/api/destination';
import { useRestPlacesByDestinationId } from '@/src/api/restplace';
import RestPlaceListItem from '@/src/components/RestPlaceListItem';
import { supabase } from '@/src/lib/supabase';

const DestinationDetailScreen = () => {
  const { id: idSting } = useLocalSearchParams();
  const id = parseFloat(typeof idSting === 'string' ? idSting : idSting[0])

  const {data: destination} = useDestination(id);
  const {data: restPlaces} = useRestPlacesByDestinationId(id);


  if (!destination) {
    return <Text> destination not found</Text>
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
            options={{ 
                title: destination.title, 
                headerRight: () => (
                  <View style={{ flexDirection: 'row' }}>
                  <Pressable>
                    {({ pressed }) => (
                      <MaterialCommunityIcons
                        name="logout"
                        size={25}
                        color={Colors.light.tint}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                        onPress={() => supabase.auth.signOut()}
                      />
                    )}
                  </Pressable>
                  <Link href="/sign-up" asChild>
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
                </View>
                ),
            }}/>   
            
      <Image 
        style={styles.image} 
        source={{ uri:DefaultImage }} 
        resizeMode='contain'
        />
      <Text style={styles.contry}> {destination.country_id} </Text>
      <FlatList
        data={restPlaces}
        renderItem={({ item }) => <RestPlaceListItem restPlace={item} />}
        contentContainerStyle={{ gap: 10, padding: 10 }}
      />

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


export default DestinationDetailScreen;
