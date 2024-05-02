import { View, Text, StyleSheet, TextInput, Image, Alert, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Button from '@/src/components/Button'
import Colors from '@/src/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useDeleteOrder, useOrder, useInsertOrder, useUpdateOrder, useConsultantList, useServiceList, useInsertServiceByOrder } from '@/src/api/order';
import { Picker } from '@react-native-picker/picker';
import { useProfileByGroup } from '@/src/api/profile';

const CreateOrderScreen = () => {

    const [profileId, setProfileId] = useState('1');
    const [consultantId, setCosultantId] = useState('1');
    const [serviceId, setServiceId] = useState('');
    const [errors, setErrors] = useState('');
    const [selectedServices, setSelectedServices] = useState<number[]>([]);
    const [totalCost, setTotalCost] = useState(0);

    const { data: profiles } = useProfileByGroup('user');
    const { data: consultants } = useConsultantList();
    const { data: services } = useServiceList();
    
    const currentDate = new Date(Date.now());
    

    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(
      typeof idString === 'string' ? idString : idString?.[0]
    );
    const isUpdating = !!idString;

    const {mutate: insertOrder} = useInsertOrder();
    const {mutate: updateOrder} = useUpdateOrder();
    const {data: updatingOrder} = useOrder(id);
    const {mutate: deleteOrder} = useDeleteOrder();
    const {mutate: insertServiceByOrder} = useInsertServiceByOrder();

    useEffect(() => {
      if(updatingOrder) {
        
      }
    }, [updatingOrder])

    const router = useRouter();

    const resetFields = () => {
    };


    const onSubmit = () => {
      if (isUpdating) {
        onUpdate();
      } else {
        onCreate();
      }
    };

    const onCreate = async () => {
      if (!profileId || !consultantId || !totalCost || !currentDate) {
        console.log(profileId)
        console.log(consultantId)
        console.log(totalCost)
        console.log(currentDate)
        console.error("Some required values are missing.");
        return;
      }
      insertOrder(
        { profileId, consultantId, currentDate, totalCost },
        {
          onSuccess: (newOrder) => {
            const orderId = newOrder.id
            selectedServices.forEach((serviceId) => {
              insertServiceByOrder({ orderId, serviceId }); 
            });
            resetFields();
            router.back();
          },
        }
      );
    };

    const onUpdate = async () => {
      
      updateOrder(
        { id, profileId, consultantId, totalCost },
        {
          onSuccess: () => {
            resetFields();
            router.back();
          },
        }
      );
    };

    const onDelete = () => {
      deleteOrder(id, {
        onSuccess: () => {
          resetFields();
          router.replace('/(admin)/order');
        },
      });
    };

    const confirmDelete = () => {
      Alert.alert('Confirm', 'Are you sure you want to delete this product', [
        {
          text: 'Cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDelete,
        },
      ]);
    };

    const toggleServiceSelection = (serviceId: number) => {
      if (services) {
        if (selectedServices.includes(serviceId)) {
          const serviceCost = services.find(service => service.id === serviceId)?.cost || 0;
          setTotalCost(prevTotalCost => prevTotalCost - serviceCost);
          setSelectedServices(selectedServices.filter(id => id !== serviceId));
        } else {
          const serviceCost = services.find(service => service.id === serviceId)?.cost || 0;
          setTotalCost(prevTotalCost => prevTotalCost + serviceCost);
          setSelectedServices([...selectedServices, serviceId]);
        }
      }
    };

  return (
    <View style={styles.contrainer}>
      <Stack.Screen options={{ title: isUpdating ? 'Update Order' : 'Create Order' }} />
      <Text style={styles.title}> Client </Text>
      <Picker style={styles.input}
        selectedValue={profileId}
        onValueChange={(itemValue, itemIndex) => setProfileId(itemValue)
        }>{profiles && profiles.map((profile) => (
          <Picker.Item key={profile.id} label= {`${profile.first_name} ${profile.second_name} `} value={profile.id} />
        ))}
      </Picker>
      <Text style={styles.title}> Consultant </Text>
      <Picker style={styles.input}
        selectedValue={consultantId}
        onValueChange={(itemValue, itemIndex) => setCosultantId(itemValue)
        }>{consultants && consultants.map((consultant) => (
          <Picker.Item key={consultant.id} label={`${consultant.first_name} ${consultant.second_name} `} value={consultant.id} />
        ))}
      </Picker>
      
      <Text style={styles.title}>Services </Text>
      <FlatList
      data={services}
      numColumns={2}
      renderItem={({ item }) => {
        return (
          <View style={styles.flatView}>
            <TouchableOpacity 
              style={[styles.touchView, selectedServices.includes(item.id) && { backgroundColor: 'lightgray' }]}
              onPress={() => toggleServiceSelection(item.id)}>
            <Text>{item.title}</Text>
            </TouchableOpacity>
          </View>
        )
      }}>
      </FlatList>
      <Text style={styles.title}>Total Cost is: {totalCost} </Text>
      <Button text={isUpdating ? 'Update' : 'Create'} onPress={(onSubmit)}/>
      { isUpdating && <Text onPress={confirmDelete} style={styles.textButton}> Delete </Text>}
    </View>
  )
}

const styles = StyleSheet.create({
    contrainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    title: {
        color: 'gray',
        fontSize: 16,
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 20,
    },
    image: {
      width: '50%',
      aspectRatio: 1,
      alignSelf: 'center',
    },
    textButton: {
      alignSelf: 'center',
      fontWeight: 'bold',
      color: Colors.light.tint,
      marginVertical: 10,
    },
    flatView: {
      width: '50%',
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    touchView: {
      borderWidth: 1,
      borderRadius: 20,
      width: '90%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      
    },
});

export default CreateOrderScreen;