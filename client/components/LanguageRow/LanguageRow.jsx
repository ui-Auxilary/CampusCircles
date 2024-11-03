import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Language from './Language';

export default function LanguageRow({ languages }) {
  return (
    <View style={styles.languageWrapper}>
      {languages
        ? languages.map((language) => {
            <Language code={'EN'} language={language} />;
          })
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  languageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
});
