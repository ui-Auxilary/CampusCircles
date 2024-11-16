import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const FriendFilter = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("addFriends")} style={styles.backButtonContainer}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.backButton}> Back</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Filter By</Text>
      <Text style={styles.sectionTitle}>Courses</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search courses..."
        placeholderTextColor="#888"
      />
      <Text style={styles.sectionTitle}>Interests</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search interests..."
        placeholderTextColor="#888"
      />
      <Text style={styles.sectionTitle}>Languages</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search languages..."
        placeholderTextColor="#888"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  header: {
    marginBottom: 20,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 16,
    color: '#000'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Lexend_400Bold',
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Lexend_400Regular',
    marginBottom: 10
  },
  searchInput: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16
  }
});

export default FriendFilter;
