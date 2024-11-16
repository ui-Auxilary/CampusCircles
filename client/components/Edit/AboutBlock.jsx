import { Picker } from "@react-native-picker/picker";
import React, { useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import pronouns from "../../data/pronouns.json";
import ActionSheet from "react-native-actions-sheet";
import { Ionicons } from "@expo/vector-icons";

export default function AboutBlock({ data, setData }) {
  const pickerRef = useRef();
  const actionSheetRef = useRef(null);

  const [name, setName] = useState(data.name || "");
  const [age, setAge] = useState(data.age || 0);
  const [gender, setGender] = useState(data.gender || "");
  return (
    <View style={styles.inputBlock}>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Name</Text>
        <View style={[styles.flexRow, styles.underline, { gap: 0 }]}>
          <TextInput
            onChangeText={(val) => {
              let text = val.substring(0, 25);
              setName(text);
              setData({ ...data, name: text });
            }}
            value={name}
            style={[styles.inputField, { width: 195 }]}
            placeholder='Enter name'
          />
          <Text style={styles.editCount}>
            {data.name.length || 0} / {25}
          </Text>
        </View>
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Age</Text>
        <View style={[styles.flexRow, styles.underline, { gap: 0 }]}>
          <TextInput
            onChangeText={(val) => {
              let text = val.substring(0, 3);
              setAge(text);
              setData({
                ...data,
                ["age"]: parseInt(text),
              });
            }}
            value={age}
            style={[styles.inputField, { width: "55" }]}
            keyboardType='numeric'
            placeholder='0'
          />
          <Text style={styles.editCount}>
            {data.age.toString().length || 0} / {3}
          </Text>
        </View>
      </View>
      <View style={styles.editContainer}>
        {Platform.OS === "android" ? (
          <Picker
            ref={pickerRef}
            style={styles.selectBtn}
            selectedValue={gender}
            onValueChange={(itemValue, itemIndex) => {
              if (itemValue !== "null") {
                setGender(itemValue);
                setData({ ...data, gender: itemValue });
              }
            }}
          >
            <Picker.Item
              key=''
              label={"Select pronoun"}
              value={null}
              enabled={false}
            />
            {pronouns.map(({ label, value }, idx) => (
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
                selectedValue={data.gender || gender}
                onValueChange={(itemValue, itemIndex) => {
                  if (itemValue !== "null") {
                    setGender(itemValue);
                    setData({ ...data, gender: itemValue });
                  } else {
                    setGender("");
                    setData({ ...data, gender: "" });
                  }
                }}
              >
                <Picker.Item
                  key=''
                  label={"Select pronoun"}
                  value={null}
                  enabled={false}
                />
                {pronouns.map(({ label, value }, idx) => (
                  <Picker.Item key={idx} label={label} value={value} />
                ))}
              </Picker>
            </ActionSheet>
            <View style={styles.editContainer}>
              <Text style={styles.inputLabel}>Pronoun</Text>
              <TouchableOpacity
                onPress={() => actionSheetRef.current?.show()}
                style={[styles.flexRow, { height: "100%" }]}
              >
                <TextInput
                  style={[styles.selectBtn]}
                  editable={false}
                  placeholder='Select pronoun'
                  textAlign='right'
                  value={gender === "" ? "Select pronoun" : gender}
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
  profileHeader: {
    height: 100,
    backgroundColor: "#FFFFFF",
    width: "100%",
    padding: 20,
    top: 0,
    alignItems: "center",
    paddingTop: 40,
  },
  headerTitle: {
    color: "#454545",
    fontSize: 28,
    fontFamily: "Lexend_700Bold",
  },
  inputBlock: {
    marginTop: 5,
    marginVertical: 20,
  },
  paramText: {
    color: "#C3B6B6",
    fontFamily: "Lexend_400Regular",
  },
  inputRow: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 2,
    minHeight: 50,
    flex: 1,
  },
  inputField: {
    color: "#C3B6B6",
    paddingHorizontal: 15,
    width: "100%",
    zIndex: 2,
    textAlign: "right",
    width: "auto",
    fontFamily: "Lexend_400Regular",
  },
  inputLabel: {
    color: "#000000",
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputCount: {
    position: "absolute",
    right: 10,
  },
  editCount: {
    color: "#AEAEB2",
    fontSize: 12,
    alignSelf: "center",
    fontFamily: "Lexend_400Regular",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  flexCol: {
    flexDirection: "column",
  },
  underline: {
    borderBottomColor: "#D9D9D9",
    borderBottomWidth: 2,
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
});
