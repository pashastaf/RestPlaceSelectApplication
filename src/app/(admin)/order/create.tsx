import { View, Text, StyleSheet, TextInput, Image, Alert, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Button from '@/src/components/Button'
import Colors from '@/src/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useDeleteOrder, useOrder, useInsertOrder, useUpdateOrder, useConsultantList, useServiceList } from '@/src/api/order';
import { Picker } from '@react-native-picker/picker';
import { useProfileByGroup } from '@/src/api/profile';

const CreateOrderScreen = () => {

    const [profileId, setProfileId] = useState('');
    const [consultantId, setCosultantId] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [errors, setErrors] = useState('');

    const { data: profiles } = useProfileByGroup('user');
    const { data: consultants } = useConsultantList();
    const { data: services } = useServiceList();
    
    const currentDate = Date.now();


    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(
      typeof idString === 'string' ? idString : idString?.[0]
    );
    const isUpdating = !!idString;

    const {mutate: insertOrder} = useInsertOrder();
    const {mutate: updateOrder} = useUpdateOrder();
    const {data: updatingOrder} = useOrder(id);
    const {mutate: deleteOrder} = useDeleteOrder();

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
      

      insertOrder(
        { profileId,consultantId, serviceId, currentDate },
        {
          onSuccess: () => {
            resetFields();
            router.back();
          },
        }
      );
    };

    const onUpdate = async () => {
      
      updateOrder(
        { id, profileId, consultantId, serviceId },
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

  return (
    <View style={styles.contrainer}>
      <Stack.Screen options={{ title: isUpdating ? 'Update Order' : 'Create Order' }} />
      <Picker style={styles.input}
        selectedValue={consultantId}
        onValueChange={(itemValue, itemIndex) => setCosultantId(itemValue)
        }>{profiles && profiles.map((profile) => (
          <Picker.Item key={profile.id} label= {`${profile.first_name} ${profile.second_name} `} value={profile.id} />
        ))}
      </Picker>
      <Picker style={styles.input}
        selectedValue={consultantId}
        onValueChange={(itemValue, itemIndex) => setCosultantId(itemValue)
        }>{consultants && consultants.map((consultant) => (
          <Picker.Item key={consultant.id} label={`${consultant.first_name} ${consultant.second_name} `} value={consultant.id} />
        ))}
      </Picker>
      <Picker style={styles.input}
        selectedValue={serviceId}
        onValueChange={(itemValue, itemIndex) => setServiceId(itemValue)
        }>{services && services.map((service) => (
          <Picker.Item key={service.id} label={service.title} value={service.id} />
        ))}
      </Picker>
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
});

export default CreateOrderScreen;