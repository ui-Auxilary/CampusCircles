import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useRef, useState } from "react";
import { getUserData } from "@/hooks/userContext";

export default function EditIntroduction() {
  const { editData, setEditData } = getUserData();
  const [bio, setBio] = useState(editData.bio);

  const onHandleChange = (val) => {
    let text = val.substring(0, 250);
    setBio(text), setEditData({ ...editData, bio: text });
  };

  return (
    <View style={styles.editContainer}>
      <TextInput
        textAlignVertical='top'
        value={bio}
        onChangeText={(val) => {
          onHandleChange(val);
        }}
        multiline={true}
        style={styles.editBlock}
      />

      <Text style={styles.editCount}>
        {bio.length} / {250}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEEEEE",
  },
  selectBtn: {
    backgroundColor: "#FFFFFF",
  },
  editLabel: {
    fontFamily: "Lexend_400Regular",
  },
  editBlock: {
    flexDirection: "column",
    gap: 8,
    backgroundColor: "#FFFFFF",
    minHeight: 180,
    maxHeight: 300,
    borderRadius: 20,
    padding: 15,
    fontFamily: "Lexend_400Regular",
    marginBottom: 10,
  },
  editContainer: {
    padding: 15,
  },
  editCount: {
    fontFamily: "Lexend_400Regular",
    color: "#AEAEB2",
    alignSelf: "flex-end",
  },
});
