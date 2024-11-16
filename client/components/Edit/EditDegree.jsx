import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import { Picker } from "@react-native-picker/picker";

import studyYear from "../../data/year.json";
import { getUserData } from "@/hooks/userContext";
import ActionSheet from "react-native-actions-sheet";
import { Ionicons } from "@expo/vector-icons";
export default function EditDegree() {
  const { editData, setEditData } = getUserData();
  const [degree, setDegree] = useState(editData.degree || "");
  const [year, setYear] = useState(editData.studyYear || "");

  let pickerRef = useRef();
  let actionSheetRef = useRef();

  const handleTextChange = (val, type) => {
    let text = val.substring(0, 25);
    setDegree(text);
    setEditData({ ...editData, ["degree"]: text });
  };

  return (
    <View>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Degree</Text>
        <TextInput
          onChangeText={(val) => {
            setDegree(val);
            setEditData({ ...editData, degree: val });
          }}
          textAlign='right'
          value={degree}
          style={[styles.inputField, { minWidth: 200 }]}
          placeholder='Enter degree'
        />
      </View>
      <View style={styles.editContainer}>
        {Platform.OS === "android" ? (
          <Picker
            ref={pickerRef}
            style={styles.selectBtn}
            selectedValue={gender}
            onValueChange={(itemValue, itemIndex) => {
              if (itemValue !== "null") {
                setYear(itemValue);
                setEditData({ ...editData, studyYear: itemValue });
              }
            }}
          >
            <Picker.Item
              key=''
              label={"Select study year"}
              value={null}
              enabled={false}
            />
            {studyYear.map(({ label, value }, idx) => (
              <Picker.Item key={idx} label={label} value={value} />
            ))}
          </Picker>
        ) : (
          <View>
            <ActionSheet ref={actionSheetRef}>
              <TouchableOpacity style={styles.OkWrapper}>
                <Text
                  onPress={() => actionSheetRef.current?.hide()}
                  style={styles.OkText}
                >
                  Done
                </Text>
              </TouchableOpacity>
              <Picker
                ref={pickerRef}
                style={styles.selectBtn}
                selectedValue={year}
                onValueChange={(itemValue, itemIndex) => {
                  if (itemValue !== "null") {
                    setYear(itemValue);
                    setEditData({ ...editData, studyYear: itemValue });
                  } else {
                    setYear("");
                    setEditData({ ...editData, studyYear: "" });
                  }
                }}
              >
                <Picker.Item
                  key=''
                  label={"Select study year"}
                  value={null}
                  enabled={false}
                />
                {studyYear.map(({ label, value }, idx) => (
                  <Picker.Item key={idx} label={label} value={value} />
                ))}
              </Picker>
            </ActionSheet>
            <View style={styles.editContainer}>
              <Text style={styles.inputLabel}>Study year</Text>
              <TouchableOpacity
                onPress={() => actionSheetRef.current?.show()}
                style={[styles.flexRow, { height: "100%" }]}
              >
                <TextInput
                  style={[styles.selectBtn]}
                  editable={false}
                  placeholder='Select study year'
                  textAlign='right'
                  value={year}
                />
                <Ionicons
                  name='chevron-down-outline'
                  size={24}
                  color={"#C3B6B6"}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
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
    marginBottom: 10,
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
    height: 60,
    borderRadius: 5,
    marginBottom: 10,
  },
  inputField: {
    paddingHorizontal: 10,
    width: "85%",
    maxWidth: 300,
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
  selectBtn: {
    backgroundColor: "#FFFFFF",
  },
  editContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 2,
    gap: 20,
    height: 60,
  },
  editBlock: {
    width: "100%",
    height: "100%",
    paddingRight: 30,
    backgroundColor: "#000",
  },
  selectInput: {
    backgroundColor: "#000",
  },
  OkText: {
    color: "#3A72FF",
    fontFamily: "Lexend_500Medium",
    fontSize: 20,
  },
  OkWrapper: {
    padding: 20,
    alignSelf: "flex-end",
    marginRight: 20,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
