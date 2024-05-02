import { StyleSheet, Image, Pressable, Text } from 'react-native';
import { Order } from '../types';
import { Link, useSegments } from 'expo-router';


type orderListItemProps = {
    order: Order;
}

const orderListItem = ({ order }: orderListItemProps) => {
  const segments = useSegments();
  console.log(segments);
  
  return (
  <Link href={`/${segments[0]}/order/${order.id}`} asChild>
    <Pressable style={styles.container}>
      <Text style={styles.contry}> {order.service_id} </Text>
      <Text style={styles.contry}> {order.profiles_id} </Text>
      <Text style={styles.contry}> {order.sale_date} </Text>
    </Pressable>
  </Link> 
  );
};

export default orderListItem

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