import { View, Text, StyleSheet, TextInput, Image, Alert, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from '@/src/components/Button'
import { DefaultImage } from '@/src/components/DestinationListItem';
import Colors from '@/src/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useDeleteDestination, useDestination, useInsertDestination, useUpdateDestination, useCountryList } from '@/src/api/destination';
import DropDownPicker from 'react-native-dropdown-picker';

const CreateDestinationScreen = () => {

    const router = useRouter();
    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(
      typeof idString === 'string' ? idString : idString?.[0]
  );

    const { data: countries } = useCountryList();
    const {mutate: insertDestination} = useInsertDestination();
    const {mutate: updateDestination} = useUpdateDestination();
    const {data: updatingDestination} = useDestination(id);
    const {mutate: deleteDestination} = useDeleteDestination();

    const [title, setTitle] = useState('');
    const [countryId, setCountryId] = useState('');
    const [errors, setErrors] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [openCountry, setOpenCountry] = useState(false);

    useEffect(() => {
        if (updatingDestination) {
            setTitle(updatingDestination.title);
            setCountryId(updatingDestination.countries_id);
        }
    }, [updatingDestination]);

    if (!countries) {
        return <ActivityIndicator />;
    }

    
    const isUpdating = !!idString;

    const resetFields = () => {
        setTitle('');
        setCountryId('');
    };

    const validateInput = () => {
        setErrors('');
        if (!title) {
            setErrors('Name is required');
            return false;
        }
        if (!countryId) {
            setErrors('Country ID is required');
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

        insertDestination(
            { title, countryId },
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
        updateDestination(
            { id, title, countryId },
            {
                onSuccess: () => {
                    resetFields();
                    router.back();
                },
            }
        );
    };

    const onDelete = () => {
        deleteDestination(id, {
            onSuccess: () => {
                resetFields();
                router.replace('/(admin)/destination');
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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const itemsCountry = countries.map((country) => ({
        label: country.title,
        value: country.id.toString(),
    }));

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: isUpdating ? 'Update Destination' : 'Create Destination' }} />
            <Image source={{ uri: image || DefaultImage }} style={styles.image} />
            <Text style={styles.textButton} onPress={pickImage}>
                Select Image
            </Text>
            <Text style={styles.title}>Title</Text>
            <TextInput
                placeholder='Destination name'
                style={styles.input}
                value={title}
                onChangeText={setTitle}
            />
            <Text style={styles.title}>Country</Text>
            <DropDownPicker
                placeholder={isUpdating ?
                    `${countries.find(country => country.id === countryId)?.title || 'error'}`
                    : 'Select new item'
                }
                open={openCountry}
                value={countryId}
                items={itemsCountry}
                setOpen={setOpenCountry}
                setValue={setCountryId}
                setItems={() => {}}
                listMode='MODAL'
                searchable={true}
                searchPlaceholder="Search..."
            />
            <Button text={isUpdating ? 'Update' : 'Create'} onPress={(onSubmit)} />
            {isUpdating && <Text onPress={confirmDelete} style={styles.textButton}> Delete </Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

export default CreateDestinationScreen;