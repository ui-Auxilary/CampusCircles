import { View, Text, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';

export default function EditBlock({ data, setData, type }) {
  const [typeData, setTypeData] = useState('');

  const handleTextChange = (val) => {
    let text = val.substring(0, 25);
    setTypeData(text);
    setData({ ...data, [type]: text });
  };

  return (
    <View style={styles.editContainer}>
      <View style={styles.inputRow}>
        <TextInput
          onChangeText={(val) => {
            handleTextChange(val);
          }}
          value={typeData}
          style={[styles.inputField, { minWidth: 200 }]}
          placeholder='Enter name'
        />
        <Text style={styles.editCount}>
          {typeData.length} / {25}
        </Text>
      </View>
      <Text style={styles.editHint}>Comma separated, up to 3</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  editContainer: {
    paddingHorizontal: 15,
  },
  inputBlock: {
    marginTop: 10,
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
