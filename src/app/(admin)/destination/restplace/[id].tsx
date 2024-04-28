import React from 'react';
import { View, Text , Image, StyleSheet, Pressable} from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { DefaultImage } from '@/src/components/DestinationListItem';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';
import { useRestPlace } from '@/src/api/restplace';
const RestPlaceDetailScreen = () => {
  
  const { id: idSting } = useLocalSearchParams();
  const id = parseFloat(typeof idSting === 'string' ? idSting : idSting[0])

  const {data: restPlace, error, isLoading} = useRestPlace(id);


  if (!restPlace) {
    return <Text> destination not found</Text>
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
            options={{ 
                title: "Rest Place", 
                headerRight: () => (
                    <Link href={`/(admin)/destination/restplace/create?id=${id}`} asChild>
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
            
      <Stack.Screen options={{ title: restPlace.title }} />
      <Image 
        style={styles.image} 
        source={{ uri:DefaultImage }} 
        resizeMode='contain'
        />
      <Text style={styles.destinationId}> {restPlace.destination_id} </Text>
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
  destinationId: {
    fontSize: 18,
    fontWeight: "bold"
  }
});


export default RestPlaceDetailScreen;
