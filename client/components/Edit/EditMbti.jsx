import { View, Text, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import { Picker } from '@react-native-picker/picker';

import mbti from '../../data/mbti.json';

export default function EditMbti({ data, setData }) {
  const [chooseMbti, setMbti] = useState();

  let pickerRef = useRef();

  return (
    <View style={styles.editContainer}>
      <Picker
        ref={pickerRef}
        style={styles.selectBtn}
        selectedValue={chooseMbti}
        onValueChange={(itemValue, itemIndex) => {
          setMbti(itemValue);
          setData({ ...data, mbti: itemValue });
        }}
      >
        <Picker.Item
          key=''
          label={'Select MBTI (personality type)'}
          value={null}
          enabled={false}
        />
        {mbti.map(({ label, value }, idx) => (
          <Picker.Item key={idx} label={label} value={value} />
        ))}
      </Picker>
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
