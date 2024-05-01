import React, { Component } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Link } from '@react-navigation/native';
import { router, useRouter } from 'expo-router';
import { FontAwesome, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function EditScreen() {

  const router = useRouter();
    return (
      <View style={styles.screens}>
          <Pressable
            style={styles.container}
            onPress={() => {
              router.replace('/(admin)/manage/');
            }}>
          {({pressed}) => (
            <View style={{ flexDirection: 'row'}}>
          <FontAwesome6 name='list' size={45} style={{ opacity: pressed ? 0.5 : 1 }}/>
          <Text style={ pressed ? styles.titlePress : styles.title }>Orders</Text>
            </View>
          )}
          </Pressable>
          <Pressable
            style={styles.container}
            onPress={() => {
              router.replace('/(admin)/manage/profile/');
            }}>
          {({pressed}) => (
            <View style={{ flexDirection: 'row'}}>
          <MaterialCommunityIcons name='account' size={45} style={{ opacity: pressed ? 0.5 : 1 }}/>
          <Text style={ pressed ? styles.titlePress : styles.title }>Profiles</Text>
            </View>
          )}
          </Pressable>
      </View>
    );
  }

const styles = StyleSheet.create({
  screens: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
    height:80,
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    borderColor: 'gray',
    borderWidth: 2
  },
  title: {
    fontSize: 32,
    marginLeft: 40,
  },
  titlePress: {
    fontSize: 32,
    marginLeft: 40,
    opacity: 0.5,
  },
});
