import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function Language({ code, language }) {
  return (
    <View>
      <Text style={styles.languageCode}>{code}</Text>

      <Text style={styles.language}>{language}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  languageBar: {
    height: 7,
    width: 35,
    backgroundColor: '#D9D9D9',
    borderRadius: 100,
    position: 'relative',
  },
  languageProgress: {
    height: 7,
    position: 'absolute',
    width: '60%',
    backgroundColor: '#CBD0AB',
    borderRadius: 100,
  },
  languageCode: {
    fontFamily: 'Lexend_700Bold',
    marginBottom: 3,
  },
  language: {
    fontFamily: 'Lexend_400Regular',
    color: '#AEAEB2',
    fontSize: 12,
  },
});
