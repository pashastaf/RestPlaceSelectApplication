import React from 'react';
import { View, Text , Image, StyleSheet, Pressable} from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { DefaultImage } from '@/src/components/DestinationListItem';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';
import { useDestination } from '@/src/api/destination';

const DestinationDetailScreen = () => {
  const { id: idSting } = useLocalSearchParams();
  const id = parseFloat(typeof idSting === 'string' ? idSting : idSting[0])

  const {data: destination, error, isLoading} = useDestination(id);


  if (!destination) {
    return <Text> destination not found</Text>
  }

  return (
    <View style={styles.container}>


      <Stack.Screen 
            options={{ 
                title: "Destination", 
                headerRight: () => (
                    <Link href={`/(admin)/destination/create?id=${id}`} asChild>
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
            
      <Stack.Screen options={{ title: destination.title }} />
      <Image 
        style={styles.image} 
        source={{ uri:DefaultImage }} 
        resizeMode='contain'
        />
      <Text style={styles.contry}> {destination.country} </Text>
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
