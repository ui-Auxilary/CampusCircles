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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, router, Link } from 'expo-router';
import Logo from '../assets/logo2.svg';

import { Picker } from '@react-native-picker/picker';

import S from '../styles/global';
import axios from 'axios';
import { BASE_URL } from '@/constants/api';
import { getUserData } from '@/hooks/userContext';

import EditLanguage from '@/components/Edit/EditLanguage';
import EditIntroduction from '@/components/Edit/EditIntroduction';
import EditMbti from '@/components/Edit/EditMbti';
import EditBlock from '@/components/Edit/EditBlock';
import EditDegree from '@/components/Edit/EditDegree';

const Edit = () => {
  const pickerRef = useRef();

  const params = useLocalSearchParams();
  const { editData, setEditData } = getUserData();

  const renderEditBlock = useCallback(() => {
    switch (params.type) {
      case 'language':
        return <EditLanguage data={editData} setData={setEditData} />;
      case 'mbti':
        return <EditMbti data={editData} setData={setEditData} />;
      case 'intro':
        return <EditIntroduction data={editData} setData={setEditData} />;
      case 'degree':
        return <EditDegree data={editData} setData={setEditData} />;
      case 'courses':
        return (
          <EditBlock data={editData} setData={setEditData} type={'courses'} />
        );
      case 'interests':
        return (
          <EditBlock data={editData} setData={setEditData} type={'interests'} />
        );
      default:
        return null;
    }
  }, [params.type]);

  const handleSave = () => {
    console.log(editData);

    // axios
    //   .put(`${BASE_URL}/users/${params.id}`, userData)
    //   .then(() => {
    //     console.log('Successfully created user profile');
    //     // Navigate to wizard or homepage for now
    //     router.push('/(tabs)');
    //   })
    //   .catch((e) => console.log(e));
    router.push({
      pathname: '/create-profile',
      params: { data: JSON.stringify(editData) },
    });
  };

  switch (params.type) {
  }

  return (
    <View style={styles.container}>
      <Logo style={styles.logo} width={50} height={50} />
      <View style={styles.profileHeader}>
        <Text style={styles.headerTitle}>Add {params.type}</Text>
      </View>
      <ScrollView style={styles.createContainer}>
        <View style={styles.backBtn}>
          <Link href='/create-profile'>
            <Text style={styles.backTxt}>Back</Text>
          </Link>
        </View>

        <View
          style={{
            flex: 1,
            padding: 0,
            margin: 0,
          }}
        >
          {renderEditBlock()}
        </View>

        <TouchableOpacity onPress={handleSave} style={S.btnMed}>
          <Text style={S.txtLrg}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Edit;

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
    marginTop: 10,
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
  backBtn: {
    padding: 10,
    backgroundColor: '#3A72FF',
    width: 80,
    margin: 10,
    marginTop: 15,
    borderRadius: 100,
    alignItems: 'center',
  },
  backTxt: {
    color: '#FFFFFF',
    fontFamily: 'Lexend_400Regular',
  },
  selectBtn: {
    backgroundColor: '#FFFFFF',
  },
});
