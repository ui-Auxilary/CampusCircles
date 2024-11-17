import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { getUserData } from "@/hooks/userContext";

export default function EditBlock({ type }) {
  const { editData, setEditData } = getUserData();
  const [typeData, setTypeData] = useState(editData[type] || "");

  const handleTextChange = (val) => {
    let interests = val.split(", ");
    if (interests.length > 3) {
      Alert.alert(`You can only specify up to 3 ${type}!`);
      return;
    }

    val = type === "courses" ? val.toUpperCase() : val;
    setTypeData(val);
    setEditData({ ...editData, [type]: val });
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
          placeholder={`Enter ${type}`}
        />
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
    width: "100%",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 2,
    borderRadius: 5,
    marginBottom: 10,
    height: 60,
  },
  inputField: {
    paddingHorizontal: 10,
    width: "100%",
    borderBottomColor: "#D9D9D9",
    borderBottomWidth: 2,
    fontFamily: "Lexend_400Regular",
    zIndex: 2,
  },
  inputLabel: {
    color: "#000000",
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
  },
  editHint: {
    color: "#AEAEB2",
    fontSize: 12,
    fontFamily: "Lexend_400Regular",
    marginBottom: 10,
  },
  editCount: {
    color: "#AEAEB2",
    fontSize: 12,
    alignSelf: "flex-end",
    fontFamily: "Lexend_400Regular",
  },
});
