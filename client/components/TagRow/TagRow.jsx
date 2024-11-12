import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Tag from './Tag';

export default function TagRow({ tags }) {
  return (
    <View style={styles.flexRow}>
      {tags
        ? tags.map((tag, idx) => <Tag key={`${tag}-${idx}`} title={tag} />)
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
});
