import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Tag from "./Tag";

export default function TagRow({ tags }) {
  const [tagArr, setTagArr] = useState([]);

  useEffect(() => {
    if (tags) {
      let tagFormat = tags.split(",").map((tag) => {
        tag = tag.trim();
        return tag[0].toUpperCase() + tag.slice(1);
      });
      setTagArr(tagFormat);
    }
  }, [tags]);

  return (
    <View style={styles.flexRow}>
      {tagArr
        ? tagArr.map((tag, idx) => <Tag key={`${tag}-${idx}`} title={tag} />)
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
});
