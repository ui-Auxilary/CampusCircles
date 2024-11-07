import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Language from './Language';

export default function LanguageRow({ languages }) {
  useEffect(() => {
    console.log('Languages', languages);
  }, []);
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
