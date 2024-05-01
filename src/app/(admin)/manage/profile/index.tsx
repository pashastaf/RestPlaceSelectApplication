import { ActivityIndicator, FlatList } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import DestinationListItem from '@/src/components/DestinationListItem';
import { useProfileList } from '@/src/api/profile';
import ProfileListItem from '@/src/components/ProfileListItem';


export default function ProfileScreen() {

  const {data: profile, error, isLoading  } = useProfileList();

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error) {
    return <Text> Failed to fetch product </Text>
  }
  return (
      <FlatList
        data={profile}
        renderItem={({ item }) => <ProfileListItem profile={item} />}
        numColumns={1}
        contentContainerStyle={{ gap: 10, padding: 10}}
        //columnWrapperStyle= {{ gap: 10}}
      />
  );
}