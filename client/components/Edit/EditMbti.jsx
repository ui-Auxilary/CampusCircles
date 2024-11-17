import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Picker, PickerIOS } from "@react-native-picker/picker";

import mbti from "../../data/mbti.json";
import ActionSheet from "react-native-actions-sheet";
import { getUserData } from "@/hooks/userContext";

export default function EditMbti() {
  const { editData, setEditData } = getUserData();
  const [chooseMbti, setMbti] = useState(editData.mbti || "");

  let pickerRef = useRef();
  const actionSheetRef = useRef(null);

  return (
    <>
      {Platform.OS === "android" ? (
        <Picker
          ref={pickerRef}
          style={styles.selectBtn}
          selectedValue={chooseMbti}
          onValueChange={(itemValue, itemIndex) => {
            setMbti(itemValue);
            setEditData({ ...editData, mbti: itemValue });
          }}
        >
          <Picker.Item
            key=''
            label={"Select MBTI (personality type)"}
            value={null}
            enabled={false}
          />
          {mbti.map(({ label, value }, idx) => (
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
              selectedValue={chooseMbti}
              onValueChange={(itemValue, itemIndex) => {
                setMbti(itemValue);
                setEditData({ ...editData, mbti: itemValue });
              }}
            >
              <Picker.Item
                key=''
                label={"Select MBTI (personality type)"}
                value={null}
                enabled={false}
              />
              {mbti.map(({ label, value }, idx) => (
                <Picker.Item key={idx} label={label} value={value} />
              ))}
            </Picker>
          </ActionSheet>
          <View style={styles.editContainer}>
            <TextInput
              style={{ flex: 1, height: "100%" }}
              editable={false}
              onPress={() => actionSheetRef.current?.show()}
              placeholder='Select MBTI (personality type)'
              value={chooseMbti}
            />
            <View style={styles.editBlock}></View>
          </View>
        </View>
      )}
    </>
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
  },
  inputField: {
    paddingHorizontal: 10,
    width: "85%",
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
  editContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingLeft: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 2,
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
});
