import { View, Text, TextInput, StyleSheet } from 'react-native';
import React, { ChangeEvent, useState, useEffect} from 'react';
import Button from '@/src/components/Button';
import Colors from '@/src/constants/Colors';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';


const SignInScreen = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [client, setClient] = useState(false);

  const router = useRouter();
  const EnterAdmin = () => {
    router.replace('/(admin)/destination')
  }


  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Sign in' }} />

      <Text style={styles.label}>Login</Text>
      <TextInput
        value={login}
        onChangeText={setLogin}
        placeholder="pashastaf"
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
      <Button 
        text="Sign in" 
        onPress={EnterAdmin}
        />
      <Link href="/sign-up" style={styles.textButton}>
        Create an account
      </Link>
    </View>
  );
};

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

export default SignInScreen;