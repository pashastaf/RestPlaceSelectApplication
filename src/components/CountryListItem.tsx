import { StyleSheet, Image, Pressable, Text, View } from 'react-native';
import { Country, Destination } from '../types';
import { Link, useSegments } from 'expo-router';

type CountryListItemProps = {
    country: Country;
}

const CountryListItem = ({ country }: CountryListItemProps) => {
  const segments = useSegments();

    return (
      <View style={styles.container}>
        <Text style={styles.title}> {country.title} </Text>
      </View>
    );
  };

  export default CountryListItem

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
