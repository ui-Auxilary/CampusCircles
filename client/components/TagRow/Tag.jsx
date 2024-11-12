import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function Tag({ title }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: '#3A72FF',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 100,
  },
  tagText: {
    color: '#FFFFFF',
    fontFamily: 'Lexend_500Medium',
    fontSize: 16,
    letterSpacing: -1,
  },
});
