import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';

const HomeTab = () => {
  return (
    <View style={styles.homepage}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}></Text>
      </View>
      <View style={styles.notifications}>
        <Text style={styles.subtitleText}></Text>
        <ScrollView></ScrollView>
      </View>
      <View style={styles.events}>
        <Text style={styles.subtitleText}></Text>
        <ScrollView></ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  homepage: { backgroundColor: '#EEEEEE' },
  titleContainer: { flex: 1 },
  notifications: { flex: 5 },
  events: { flex: 5 },
  titleText: {},
  subtitleText: {},
});

export default HomeTab;
