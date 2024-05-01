import { View, Text, StyleSheet, TextInput, Image, Alert, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Button from '@/src/components/Button'
import { DefaultImage } from '@/src/components/DestinationListItem';
import Colors from '@/src/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useDeleteProfile, useInsertProfile, useProfile, useUpdateProfile } from '@/src/api/profile';
import { supabase } from '@/src/lib/supabase';

const CreateProfileScreen = () => {

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [password, setPassword] = useState('');
    const [group, setGroup] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState('');



    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(
      typeof idString === 'string' ? idString : idString?.[0]
    );
    const isUpdating = !!idString;

    const {mutate: insertProfile} = useInsertProfile();
    const {mutate: updateProfile} = useUpdateProfile();
    const {data: updatingProfile} = useProfile(id);
    const {mutate: deleteProfile} = useDeleteProfile();

    useEffect(() => {
      if(updatingProfile) {
        setFirstName(updatingProfile.first_name);
        setSecondName(updatingProfile.second_name);
        setEmail(updatingProfile.email);
        setGroup(updatingProfile.group);
        setPassword(updatingProfile.password);
      }
    }, [updatingProfile])

    const router = useRouter();

    const resetFields = () => {
      setFirstName('');
        setSecondName('');
        setEmail('');
        setGroup('');
    };

    const validateInput = () => {
      setErrors('');
      if (!firstName) {
        setErrors('First name is required');
        return false;
      }
      if (!secondName) {
        setErrors('Second name is required');
        return false;
      }
      if (!email) {
        setErrors('Email is required');
        return false;
      }
      if (!group) {
        setErrors('Group is required');
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
      const fullName = `${secondName} ${firstName}`
      const { error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: {
          data: {
            email,
            password,
            firstName,
            secondName,
            fullName,
            group,
          } 
        }});
        resetFields();
        router.back();
    };

    const onUpdate = async () => {
      if (!validateInput()) {
        return;
      }
      updateProfile(
        {id, firstName, secondName, email, group, password },
        {
          onSuccess: () => {
            resetFields();
            router.back();
          },
        }
      );
    };

    const onDelete = () => {
      deleteProfile(id, {
        onSuccess: () => {
          resetFields();
          router.replace('/(admin)/manage/profile/');
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
      <View style={styles.container}>
      <Stack.Screen options={{ title: isUpdating ? 'Update Profile' : 'Create Profile' }} />

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Jhon"
        style={styles.input}
      />

      <Text style={styles.label}>Second Name</Text>
      <TextInput
        value={secondName}
        onChangeText={setSecondName}
        placeholder="Dou"
        style={styles.input}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="pashastaf@gmail.com"
        style={styles.input}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder=""
        style={styles.input}
        secureTextEntry
      />

        <Picker style={styles.input}
        selectedValue={group}
        onValueChange={(itemValue, itemIndex) => setGroup(itemValue)
        }>
        <Picker.Item label='admin' value='admin' />
        <Picker.Item label='user' value='user' />
        
      </Picker>
      
      <Button text={isUpdating ? 'Update' : 'Create'} onPress={(onSubmit)}/>
      { isUpdating && <Text onPress={confirmDelete} style={styles.textButton}> Delete </Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },
});

export default CreateProfileScreen;