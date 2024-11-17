import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useRef, useState } from "react";
import { Picker } from "@react-native-picker/picker";

import languages from "../../data/languages.json";
import { getUserData } from "@/hooks/userContext";
import ActionSheet from "react-native-actions-sheet";
import { Ionicons } from "@expo/vector-icons";
export default function EditLanguage() {
  const actionSheetRef = useRef([]);
  let pickerRef = useRef();
  const { editData, setEditData } = getUserData();
  const [selectedLanguage, setSelectedLanguage] = useState(editData.languages);

  const updateLanguage = (language, langIdx, idx) => {
    console.log("Language", language, idx, selectedLanguage);

    let newLanguages = selectedLanguage;
    newLanguages[idx] =
      language === "null" ? "" : languages[langIdx - 1]["label"];
    console.log("New", newLanguages);
    setSelectedLanguage((prev) => [...newLanguages]);
    setEditData({ ...editData, languages: [...newLanguages] });
  };

  return (
    <View style={styles.editContainer}>
      {Array.from(Array(3)).map((language, idx) => (
        <View key={idx} style={styles.editBlock}>
          <Text style={styles.editLabel}>Language #{idx + 1}</Text>
          <TouchableOpacity
            onPress={() =>
              actionSheetRef.current[idx]?.show({ payload: { idx } })
            }
            style={styles.editRow}
          >
            {Platform.OS === "android" ? (
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
                  label={"Select Language"}
                  value={null}
                  enabled={false}
                />
                {languages.map(({ label, value }, idx) => (
                  <Picker.Item key={idx} label={label} value={value} />
                ))}
              </Picker>
            ) : (
              <View>
                <ActionSheet ref={(el) => (actionSheetRef.current[idx] = el)}>
                  <TouchableOpacity style={styles.OkWrapper}>
                    <Text
                      onPress={() => actionSheetRef.current[idx]?.hide()}
                      style={styles.OkText}
                    >
                      Done
                    </Text>
                  </TouchableOpacity>
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
                      label={"Select language"}
                      value={null}
                      enabled={false}
                    />
                    {languages.map(({ label, value }, idx) => (
                      <Picker.Item key={idx} label={label} value={value} />
                    ))}
                  </Picker>
                </ActionSheet>
                <View style={styles.editContainer}>
                  <View style={[styles.flexRow, { height: "100%" }]}>
                    <TextInput
                      style={[styles.selectBtn]}
                      editable={false}
                      placeholder='Select language'
                      textAlign='right'
                      value={
                        selectedLanguage[idx] ? selectedLanguage[idx] : null
                      }
                    />
                    <Ionicons
                      name='chevron-down-outline'
                      size={24}
                      color={"#C3B6B6"}
                    />
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
      ))}
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
  editContainer: {
    padding: 15,
  },
  editRow: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "flex-end",
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 2,
    gap: 20,
    height: 60,
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
    gap: 5,
  },
});
