import { View, Text, StyleSheet, TextInput } from 'react-native';
import React, { useRef, useState } from 'react';
import { Picker } from '@react-native-picker/picker';

import studyYear from '../../data/year.json';
import { getUserData } from '@/hooks/userContext';
export default function EditDegree({ data, setData }) {
  const { editData } = getUserData();
  const [degree, setDegree] = useState(editData.degree || '');
  const [year, setYear] = useState(editData.studyYear || '');

  let pickerRef = useRef();

  const handleTextChange = (val, type) => {
    let text = val.substring(0, 25);
    setDegree(text);
    setData({ ...editData, ['degree']: text });
  };

  return (
    <View style={styles.editContainer}>
      <View style={styles.editBlock}>
        <Text style={styles.editLabel}>Degree</Text>
        <View style={styles.inputRow}>
          <TextInput
            onChangeText={(val) => {
              handleTextChange(val);
            }}
            value={degree}
            style={[styles.inputField, { minWidth: 200 }]}
            placeholder='Enter name'
          />
          <Text style={styles.editCount}>
            {degree.length} / {25}
          </Text>
        </View>
        <Text style={styles.editLabel}>Study year</Text>
        <Picker
          ref={pickerRef}
          style={styles.selectBtn}
          selectedValue={year}
          onValueChange={(itemValue, itemIndex) => {
            setYear(itemValue);
            setData({ ...editData, ['studyYear']: itemValue });
          }}
        >
          <Picker.Item
            key=''
            label='Select year of study'
            value={null}
            enabled={false}
          />
          {studyYear.map(({ label, value }, idx) => (
            <Picker.Item key={idx} label={label} value={value} />
          ))}
        </Picker>
      </View>
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
  inputRow: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 2,
    borderRadius: 5,
    marginBottom: 10,
  },
  inputField: {
    paddingHorizontal: 10,
    width: '85%',
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 2,
    fontFamily: 'Lexend_400Regular',
    zIndex: 2,
  },
  inputLabel: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Lexend_400Regular',
  },
  editHint: {
    color: '#AEAEB2',
    fontSize: 12,
    fontFamily: 'Lexend_400Regular',
    marginBottom: 10,
  },
  editCount: {
    color: '#AEAEB2',
    fontSize: 12,
    alignSelf: 'flex-end',
    fontFamily: 'Lexend_400Regular',
  },
});
