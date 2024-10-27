import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Logo from '@/components/LogoVariation';
import { Link } from 'expo-router';

const CreateProfile = () => {
  return (
    <View style={styles.container}>
      <Logo style={styles.logo} />
      <View style={styles.profileHeader}>
        <Text style={styles.headerTitle}>Create Profile</Text>
      </View>
      <View style={styles.createContainer}>
        <View style={styles.profileImgContainer}>{/* Image stuff*/}</View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput style={styles.inputField} placeholder='Enter name...' />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Age</Text>
          <TextInput style={styles.inputField} placeholder='Enter age...' />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Language</Text>
          <TextInput
            style={styles.inputField}
            placeholder='Enter language...'
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Age</Text>
          <TextInput style={styles.inputField} placeholder='Enter age...' />
        </View>

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
  inputRow: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  inputField: {
    paddingHorizontal: 15,
    width: '70%',
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 2,
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
    backgroundColor: '#EEEEEE',
  },
  profileImgContainer: {
    height: 150,
    backgroundColor: 'aqua',
  },
});
