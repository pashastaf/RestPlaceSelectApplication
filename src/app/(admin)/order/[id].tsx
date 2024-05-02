import React from 'react';
import { View, Text , Image, StyleSheet, Pressable, FlatList} from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';
import { useOrder } from '@/src/api/order';

const orderDetailScreen = () => {
  const { id: idSting } = useLocalSearchParams();
  const id = parseFloat(typeof idSting === 'string' ? idSting : idSting[0])

  const {data: order} = useOrder(id);


  if (!order) {
    return <Text> orders not found</Text>
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
            options={{ 
                title: order.sale_date, 
                headerRight: () => (
                    <Link href={`/(admin)/order/create?id=${id}`} asChild>
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
            
      <Text style={styles.contry}> {order.group} </Text>
      <Text style={styles.contry}> {order.created_at} </Text>

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


export default orderDetailScreen;