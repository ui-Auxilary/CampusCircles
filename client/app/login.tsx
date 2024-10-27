import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Logo from '@/components/Logo';
import { Link } from 'expo-router';

const Login = () => {
  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <View style={styles.loginWrapper}>
          <Text style={styles.loginTitle}>Login</Text>
          <View>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput style={styles.inputField} placeholder='Username' />
          </View>
          <View>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              secureTextEntry={true}
              style={styles.inputField}
              placeholder='Password'
            />
          </View>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
        <Logo style={styles.logo} />
        <View style={styles.loginFooter}>
          <Link href={{ pathname: 'register' }}>
            <Text style={styles.registerText}>
              Don't have an account? Register here
            </Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A72FF',
    padding: 20,
    paddingVertical: 80,
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
    marginTop: 100,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  loginTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 32,
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
  },
});
