import { Picker } from "@react-native-picker/picker";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import pronouns from "../../data/pronouns.json";

export default function AboutBlock({ data, setData }) {
  const pickerRef = useRef();
  const [name, setName] = useState(data.name || "");
  const [age, setAge] = useState(data.age || 0);
  const [gender, setGender] = useState("");
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
            style={[styles.inputField, { width: 55 }]}
            keyboardType='numeric'
            placeholder='0'
          />
          <Text style={styles.editCount}>
            {data.age.toString().length || 0} / {3}
          </Text>
        </View>
      </View>
      <View style={styles.editContainer}>
        <Text style={styles.inputLabel}>Pronoun</Text>
        <View style={styles.editBlock}>
          <Picker
            ref={pickerRef}
            style={styles.selectBtn}
            selectedValue={gender}
            onValueChange={(itemValue, itemIndex) => {
              setGender(itemValue);
              setData({ ...data, ["gender"]: itemValue });
            }}
          >
            <Picker.Item
              key=''
              label='Select pronoun'
              value={null}
              enabled={false}
            />
            {pronouns.map(({ label, value }, idx) => (
              <Picker.Item key={idx} label={label} value={value} />
            ))}
          </Picker>
        </View>
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
  },
  paramText: {
    color: "#C3B6B6",
    fontFamily: "Lexend_400Regular",
  },
  inputRow: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 2,
    minHeight: 50,
  },
  inputField: {
    color: "#C3B6B6",
    paddingHorizontal: 15,
    width: "70%",
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

  loginButton: {
    paddingHorizontal: 10,
    backgroundColor: "#76DA69",
    height: 55,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Lexend_700Bold",
  },
  loginFooter: {
    alignItems: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#FFFFFF",
    fontSize: 16,
    zIndex: 2,
  },
  logo: {
    position: "absolute",
    top: 35,
    left: 15,
    zIndex: 2,
  },
  createContainer: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  profileImgContainer: {
    height: 140,
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  profileImg: {
    width: 120,
    height: 120,
    borderRadius: 100,
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
  bioText: {
    width: "70%",
    color: "#AEAEB2",
    fontSize: 12,
    fontFamily: "Lexend_400Regular",
  },
  cameraIcon: {
    position: "absolute",
    backgroundColor: "#81626763",
    width: 120,
    height: 120,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  selectBtn: {
    backgroundColor: "#FFFFFF",
    marginTop: 5,
  },
  editBlock: {
    width: 160,
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
});
