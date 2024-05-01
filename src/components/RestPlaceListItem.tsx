import { StyleSheet, Image, Pressable, Text } from 'react-native';
import { RestPlace } from '../types';
import { Link, useSegments } from 'expo-router';

export const DefaultImage = 'https://previews.123rf.com/images/koblizeek/koblizeek2208/koblizeek220800254/190563481-no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment-placeholder.jpg' 

type RestPlaceListItemProps = {
    restPlace: RestPlace;
}

const RestPlaceListItem = ({ restPlace }: RestPlaceListItemProps) => {
  const segments = useSegments();
  console.log(segments);
  
  return (
  <Link href={`/${segments[0]}/restplace/${restPlace.id}`} asChild>
    <Pressable style={styles.container}>
      <Image 
        style={styles.image} 
        source={{ uri: DefaultImage }} 
        resizeMode='contain'
        />

      <Text style={styles.title}> {restPlace.title} </Text>
    </Pressable>
  </Link> 
  );
};

export default RestPlaceListItem

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 20,
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    contry: {
      fontSize: 14,
      fontWeight: 'normal',
      color: 'blue'
    },
    image: {
      width: '100%',
      aspectRatio: 1
    }
  });