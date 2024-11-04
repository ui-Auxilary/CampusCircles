import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useLocalSearchParams, router } from 'expo-router';
import Logo from '../assets/logo2.svg';

import S from '../styles/global';
import axios from 'axios';
import { BASE_URL } from '@/constants/api';
import { getUserData } from '@/hooks/userContext';

const CreateProfile = () => {
  const params = useLocalSearchParams();
  const { setUserId } = getUserData();
  const [profileData, setProfileData] = useState({
    name: '',
    age: 0,
    language: '',
    bio: '',
    mbti: '',
    interests: '',
    courses: '',
  });

  useEffect(() => {
    console.log('Params', params);
    if (params.id) {
      // Set context
      setUserId(params.id);
    }
  }, []);

  const handleCreateProfile = () => {
    console.log(profileData);
    let userData = profileData;
    userData.interests = userData.interests.split(',');
    userData.courses = userData.courses.split(',');

    axios
      .put(`${BASE_URL}/users/${params.id}`, userData)
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
      <ScrollView style={styles.createContainer}>
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
        <View style={styles.inputBlock}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              onChangeText={(val) =>
                setProfileData({ ...profileData, name: val })
              }
              value={params.name || profileData.name}
              style={styles.inputField}
              placeholder='Enter name'
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              onChangeText={(val) =>
                setProfileData({ ...profileData, age: parseInt(val) })
              }
              value={profileData.age}
              style={styles.inputField}
              keyboardType='numeric'
              placeholder='Enter age'
            />
          </View>
        </View>
        <View style={styles.inputBlock}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Language</Text>
            <TextInput
              onChangeText={(val) =>
                setProfileData({ ...profileData, language: val })
              }
              value={profileData.language}
              style={styles.inputField}
              placeholder='Language 1, language 2...'
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              onChangeText={(val) =>
                setProfileData({ ...profileData, bio: val })
              }
              value={profileData.bio}
              style={styles.inputField}
              placeholder='Write about yourself!'
            />
          </View>
        </View>
        <View style={styles.inputBlock}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>MBTI</Text>
            <TextInput
              onChangeText={(val) =>
                setProfileData({ ...profileData, mbti: val })
              }
              value={profileData.mbti}
              style={styles.inputField}
              placeholder='Your MBTI'
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Interests</Text>
            <TextInput
              onChangeText={(val) =>
                setProfileData({ ...profileData, interests: val })
              }
              value={profileData.interests}
              style={styles.inputField}
              placeholder='Interest 1, interest 2...'
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Courses</Text>
            <TextInput
              onChangeText={(val) =>
                setProfileData({ ...profileData, courses: val })
              }
              value={profileData.courses}
              style={styles.inputField}
              placeholder='Course 1, course 2...'
            />
          </View>
        </View>
        <View style={styles.loginFooter}></View>
        <TouchableOpacity onPress={handleCreateProfile} style={S.btnMed}>
          <Text style={S.txtLrg}>Create</Text>
        </TouchableOpacity>
      </ScrollView>
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
  inputBlock: {},
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
  },
  inputField: {
    paddingHorizontal: 15,
    width: '70%',
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 2,
    zIndex: 2,
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
    height: 150,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  profileImg: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
});
