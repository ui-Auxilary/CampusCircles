import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Logo from '../assets/campuslogo.svg';
import { Link, router } from 'expo-router';
import axios from 'axios';

import S from '../styles/global';
import { BASE_URL } from '@/constants/api';

const Register = () => {
  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const handleRegister = () => {
    const userData = {
      profile: {},
      events: {},
      eventsCreated: {},
      friendIds: [],
      invitations: {},
      ...user,
    };

    axios
      .post(`${BASE_URL}/users`, userData)
      .then(() => {
        router.push('/create-profile');
      })
      .catch((e) => {
        console.log(e);
        // Raise error message
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <View style={styles.loginWrapper}>
          <Text style={styles.registerTitle}>Register</Text>
          <View>
            <Text style={styles.inputLabel}>Full name</Text>
            <TextInput
              onChangeText={(val) => {
                setUser({ ...user, name: val });
              }}
              style={styles.inputField}
              placeholder='Full name'
            />
          </View>
          <View>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              onChangeText={(val) => {
                setUser({ ...user, username: val });
              }}
              style={styles.inputField}
              placeholder='Username'
            />
          </View>
          <View>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              onChangeText={(val) => {
                setUser({ ...user, email: val });
              }}
              style={styles.inputField}
              placeholder='Email'
            />
          </View>
          <View>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              onChangeText={(val) => {
                setUser({ ...user, password: val });
              }}
              secureTextEntry={true}
              style={styles.inputField}
              placeholder='Password'
            />
          </View>
          <TouchableOpacity onPress={handleRegister} style={S.btnLrg}>
            <Text style={S.txtLrg}>Register</Text>
          </TouchableOpacity>
        </View>

        <Logo width={'20%'} style={styles.logo} />

        <View style={styles.loginFooter}>
          <Link href={{ pathname: 'login' }}>
            <Text style={styles.registerText}>
              Already have an account? Log in
            </Text>
          </Link>
        </View>
      </View>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.push('/create-profile')}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Skip register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A72FF',
    padding: 20,
    paddingVertical: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    position: 'relative',
    flex: 1,
    width: '100%',
    padding: 20,
  },
  loginWrapper: {
    marginTop: 50,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  registerTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 36,
    color: '#FFFFFF',
  },
  inputField: {
    paddingHorizontal: 15,
    borderRadius: 5,
    height: 50,
    width: '100%',
    backgroundColor: '#FFFFFF',
    zIndex: 2,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'Lexend_400Regular',
  },
  logo: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  loginFooter: {
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  skipButton: {
    paddingHorizontal: 10,
    backgroundColor: '#ad24c9',
    height: 50,
    justifyContent: 'center',
    borderRadius: 5,
    position: 'absolute',
    top: 100,
  },
});
