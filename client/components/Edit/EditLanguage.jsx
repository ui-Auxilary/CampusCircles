import { View, Text, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import { Picker } from '@react-native-picker/picker';

import languages from '../../data/languages.json';
import { getUserData } from '@/hooks/userContext';
export default function EditLanguage({ data, setData }) {
  let pickerRef = useRef();
  const { editData } = getUserData();
  const [selectedLanguage, setSelectedLanguage] = useState(editData.languages);

  const updateLanguage = (language, langIdx, idx) => {
    console.log('Language', language, idx, selectedLanguage);
    let newLanguages = selectedLanguage;
    newLanguages[idx] = languages[langIdx]['label'];
    console.log('New', newLanguages);
    setSelectedLanguage((prev) => [...newLanguages]);
    setData({ ...data, languages: [...newLanguages] });
  };

  return (
    <View style={styles.editContainer}>
      {Array.from(Array(3)).map((language, idx) => (
        <View key={idx} style={styles.editBlock}>
          <Text style={styles.editLabel}>Language #{idx + 1}</Text>
          <Picker
            ref={pickerRef}
            style={styles.selectBtn}
            selectedValue={selectedLanguage[idx]}
            onValueChange={(itemValue, itemIndex) => {
              updateLanguage(itemValue, itemIndex, idx);
            }}
          >
            <Picker.Item
              key=''
              label={
                idx == 0 ? 'Select a language' : 'Select a language (optional)'
              }
              value={null}
              enabled={false}
            />
            {languages.map(({ label, value }, idx) => (
              <Picker.Item key={idx} label={label} value={value} />
            ))}
          </Picker>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  selectBtn: {
    backgroundColor: '#FFFFFF',
  },
  editLabel: {
    fontFamily: 'Lexend_400Regular',
  },
  editBlock: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 10,
  },
  editContainer: {
    padding: 15,
  },
});
