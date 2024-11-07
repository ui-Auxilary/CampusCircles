import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocalSearchParams, router } from 'expo-router';
import Logo from '../assets/logo2.svg';
import Right from '../assets/chev-right.svg';

import { Picker } from '@react-native-picker/picker';

import S from '../styles/global';
import axios from 'axios';
import { BASE_URL } from '@/constants/api';
import { getUserData } from '@/hooks/userContext';
import Ionicons from '@expo/vector-icons/Ionicons';

const CreateProfile = () => {
  const pickerRef = useRef();

  const params = useLocalSearchParams();
  const { userId, setUserId, editData, setEditData } = getUserData();
  const [selectedLanguage, setSelectedLanguage] = useState();

  // const [editData, setEditData] = useState({
  //   name: '',
  //   age: 0,
  //   languages: [],
  //   bio: '',
  //   mbti: '',
  //   interests: '',
  //   courses: '',
  // });

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  useEffect(() => {
    if (params.data) {
      setEditData(JSON.parse(params.data));
    }
    if (params.id) {
      // Set context
      setUserId(params.id);
    }
  }, []);

  useEffect(() => {
    console.log('New data', editData);
    console.log(editData?.languages ? editData.languages.join(', ') : '');
  }, [editData]);

  const handleCreateProfile = () => {
    let userData = editData;
    // userData.interests = userData.interests.split(',');
    // userData.courses = userData.courses.split(',');

    console.log('ID', userId, editData);
    axios
      .put(`${BASE_URL}/users/${userId}`, userData)
      .then(() => {
        console.log('Successfully created user profile');
        // Navigate to wizard or homepage for now
        router.push('/(tabs)');
      })
      .catch((e) => console.log(e));
    router.push('/(tabs)');
  };
  return (
    <View style={styles.container}>
      <Logo style={styles.logo} width={50} height={50} />
      <View style={styles.profileHeader}>
        <Text style={styles.headerTitle}>Create Profile</Text>
      </View>
      <View style={styles.profileImgContainer}>
        {params.picture ? (
          <Image style={styles.profileImg} src={params.picture} />
        ) : (
          <Image
            style={styles.profileImg}
            source={{
              uri: 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg',
            }}
          />
        )}
      </View>

      <View style={[styles.inputBlock, { marginTop: 0 }]}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            onChangeText={(val) => setEditData({ ...editData, name: val })}
            value={params.name || editData.name}
            style={[styles.inputField, { minWidth: 200, maxWidth: 200 }]}
            placeholder='Enter name'
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Age</Text>
          <TextInput
            onChangeText={(val) =>
              setEditData({ ...editData, age: parseInt(val) })
            }
            value={editData.age}
            style={[styles.inputField, { maxWidth: 55 }]}
            keyboardType='numeric'
            placeholder='0'
          />
        </View>
      </View>
      <View style={styles.inputBlock}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Language</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'flex-end' }}
            onPress={() =>
              router.push({ pathname: '/edit', params: { type: 'language' } })
            }
          >
            <View style={styles.flexRow}>
              <Text style={styles.paramText}>
                {editData?.languages ? editData.languages.join(', ') : ''}
              </Text>
              <Right width={25} height={25} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Self introduction</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'flex-end' }}
            onPress={() =>
              router.push({
                pathname: '/edit',
                params: { type: 'intro' },
              })
            }
          >
            <Right width={25} height={25} />
          </TouchableOpacity>
          {/* <TextInput
              onChangeText={(val) =>
                setEditData({ ...editData, bio: val })
              }
              value={editData.bio}
              style={styles.inputField}
              placeholder='Write about yourself!'
            /> */}
        </View>
      </View>
      <View style={styles.inputBlock}>
        <View style={[styles.inputRow, { paddingVertical: 0 }]}>
          <Text style={styles.inputLabel}>MBTI</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'flex-end' }}
            onPress={() =>
              router.push({
                pathname: '/edit',
                params: { type: 'mbti' },
              })
            }
          >
            <Right width={25} height={25} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputBlock}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Degree</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'flex-end' }}
            onPress={() =>
              router.push({ pathname: '/edit', params: { type: 'degree' } })
            }
          >
            <View style={styles.flexRow}>
              <Text style={styles.paramText}>{editData.language}</Text>
              <Right width={25} height={25} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Interests</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'flex-end' }}
            onPress={() =>
              router.push({
                pathname: '/edit',
                params: { type: 'interests' },
              })
            }
          >
            <Right width={25} height={25} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Courses</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'flex-end' }}
            onPress={() =>
              router.push({ pathname: '/edit', params: { type: 'courses' } })
            }
          >
            <Right width={25} height={25} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={handleCreateProfile} style={S.btnMed}>
        <Text style={S.txtLrg}>Create</Text>
      </TouchableOpacity>
      <View style={styles.loginFooter}></View>
    </View>
  );
};

export default CreateProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  profileHeader: {
    height: 100,
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 20,
    top: 0,
    alignItems: 'center',
    paddingTop: 40,
  },
  headerTitle: {
    color: '#454545',
    fontSize: 28,
    fontFamily: 'Lexend_700Bold',
  },
  inputBlock: {
    marginTop: 5,
  },
  paramText: {
    color: '#C3B6B6',
    fontFamily: 'Lexend_400Regular',
  },
  inputRow: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 2,
    minHeight: 50,
  },
  inputField: {
    paddingHorizontal: 15,
    width: '70%',
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 2,
    zIndex: 2,
    textAlign: 'right',
    width: 'auto',
    fontFamily: 'Lexend_400Regular',
  },
  inputLabel: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Lexend_400Regular',
  },

  loginButton: {
    paddingHorizontal: 10,
    backgroundColor: '#76DA69',
    height: 55,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Lexend_700Bold',
  },
  loginFooter: {
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 16,
    zIndex: 2,
  },
  logo: {
    position: 'absolute',
    top: 35,
    left: 15,
    zIndex: 2,
  },
  createContainer: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  profileImgContainer: {
    height: 140,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  profileImg: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputCount: {
    position: 'absolute',
    right: 10,
  },
});
