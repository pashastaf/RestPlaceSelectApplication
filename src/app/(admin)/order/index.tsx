import { ActivityIndicator, FlatList } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import ProfileListItem from '@/src/components/ProfileListItem';
import { useOrderList } from '@/src/api/order';
import OrderListItem from '@/src/components/OrderListItem';


export default function OrderScreen() {

  const {data: profile, error, isLoading  } = useOrderList();

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error) {
    return <Text> Failed to fetch product </Text>
  }
  return (
      <FlatList
        data={profile}
        renderItem={({ item }) => <OrderListItem order={item} />}
        numColumns={1}
        contentContainerStyle={{ gap: 10, padding: 10}}
        //columnWrapperStyle= {{ gap: 10}}
      />
  );
}