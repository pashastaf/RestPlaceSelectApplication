import { StyleSheet, Image, Pressable, Text } from 'react-native';
import { Profile } from '../types';
import { Link, useSegments } from 'expo-router';


type ProfileListItemProps = {
    profile: Profile;
}

const ProfileListItem = ({ profile }: ProfileListItemProps) => {
  const segments = useSegments();
  console.log(segments);
  
  return (
  <Link href={`/${segments[0]}/manage/profile/${profile.id}`} asChild>
    <Pressable style={styles.container}>
      <Text style={styles.title}> {profile.second_name} {profile.first_name} </Text>
      <Text style={styles.contry}> {profile.email} </Text>
      <Text style={styles.contry}> {profile.group} </Text>
      <Text style={styles.contry}> {profile.created_at} </Text>
    </Pressable>
  </Link> 
  );
};

export default ProfileListItem

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