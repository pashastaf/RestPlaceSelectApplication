import { StyleSheet, Image, Pressable, Text } from 'react-native';
import { Order } from '../types';
import { Link, useSegments } from 'expo-router';
import { format } from 'date-fns';


type orderListItemProps = {
    order: Order;
}

const orderListItem = ({ order }: orderListItemProps) => {
  
  return (
  <Link href={`/(admin)/order/create?id=${order.id}`} asChild>
    <Pressable style={styles.container}>
      <Text style={styles.contry}> Consultant: {order.consultants_id} </Text>
      <Text style={styles.contry}> Client: {order.profiles_id} </Text>
      <Text style={styles.contry}> Sale date: {format(new Date(order.sale_date), 'dd.MM.yyyy HH:mm:ss')} </Text>
      <Text style={styles.contry}> Order cost: {order.total_cost} </Text>
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