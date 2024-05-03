import { View, Text, StyleSheet, TextInput, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Button from '@/src/components/Button'
import { DefaultImage } from '@/src/components/DestinationListItem';
import Colors from '@/src/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useRestPlace, useInsertRestPlace, useUpdateRestPlace, useDeleteRestPlace } from '@/src/api/restplace';
import { useDestinationList } from '@/src/api/destination';
import DropDownPicker from 'react-native-dropdown-picker';

const CreateRestPlaceScreen = () => {

    const [title, setTitle] = useState('');
    const [destinationId, setDestinationId] = useState('');
    const [errors, setErrors] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const { data: destinations } = useDestinationList();


    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(
      typeof idString === 'string' ? idString : idString?.[0]
    );
    const isUpdating = !!idString;

    const {mutate: insertRestPlace} = useInsertRestPlace();
    const {mutate: updateRestPlace} = useUpdateRestPlace();
    const {data: updatingRestPlace} = useRestPlace(id);
    const {mutate: deleteRestPlace} = useDeleteRestPlace();

    useEffect(() => {
      if(updatingRestPlace) {
        setTitle(updatingRestPlace.title);
        setDestinationId(updatingRestPlace.destinations_id);
      }
    }, [updatingRestPlace])

    const router = useRouter();

    const resetFields = () => {
      setTitle('');
      setDestinationId('');
    };

    const validateInput = () => {
      setErrors('');
      if (!title) {
        setErrors('Name is required');
        return false;
      }
      if (!destinationId) {
        setErrors('Destination ID is required');
        return false;
      }
      return true;
    };

    const onSubmit = () => {
      if (isUpdating) {
        onUpdate();
      } else {
        onCreate();
      }
    };

    const onCreate = async () => {
      if (!validateInput()) {
        return;
      }

      insertRestPlace(
        { title, destinationId },
        {
          onSuccess: () => {
            resetFields();
            router.back();
          },
        }
      );
    };

    const onUpdate = async () => {
      if (!validateInput()) {
        return;
      }
      updateRestPlace(
        { id, title, destinationId },
        {
          onSuccess: () => {
            resetFields();
            router.back();
          },
        }
      );
    };

    const onDelete = () => {
      deleteRestPlace(id, {
        onSuccess: () => {
          resetFields();
          router.replace('/(admin)/restplace/');
        },
      });
    };

    const confirmDelete = () => {
      Alert.alert('Confirm', 'Are you sure you want to delete this rest place', [
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

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  if (!destinations) {
    return <ActivityIndicator />;
  }

  const itemsDestination = destinations.map((destination) => ({
    label: destination.title,
    value: destination.id.toString(), 
  }));

  const [openDestination, setOpenDestination] = useState(false);

  return (
    <View style={styles.contrainer}>
      <Stack.Screen options={{ title: isUpdating ? 'Update Rest Place' : 'Create Rest Place' }} />
      <Image source={{ uri: image || DefaultImage }} style={styles.image} />
      <Text style={styles.textButton} onPress={pickImage}>
        Select Image
      </Text>
      <Text style={styles.title}>Title</Text>
      <TextInput 
        placeholder='Rest place name' 
        style={styles.input} 
        value={title}
        onChangeText={setTitle}
        />
      <Text style={styles.title}>Destination</Text>
      <DropDownPicker
        placeholder={isUpdating ?
          `${destinations.find(destination => destination.id === destinationId)?.title || 'error'}`
          : 'Select new item'
        }
        open={openDestination}
        value={destinationId}
        items={itemsDestination}
        setOpen={setOpenDestination}
        setValue={setDestinationId}
        setItems={() => {}} 
      />
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

export default CreateRestPlaceScreen;