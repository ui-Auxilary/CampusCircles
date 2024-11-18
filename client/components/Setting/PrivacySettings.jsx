import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import React, { useState } from "react";

import Right from "../../assets/chev-right.svg";
import { getUserData } from "@/hooks/userContext";

const PrivacySettings = () => {
  const { showAge, showPronoun, setShowAge, setShowPronoun } = getUserData();

  const toggleAge = () => {
    setShowAge(!showAge);
  };

  const togglePronoun = () => {
    setShowPronoun(!showPronoun);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputBlock}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Show age</Text>
          <TouchableOpacity style={{ flex: 1, alignItems: "flex-end" }}>
            <View style={styles.flexRow}>
              <Switch
                trackColor={{ false: "#767577", true: "#76DA69" }}
                thumbColor={"#f4f3f4"}
                ios_backgroundColor='#3e3e3e'
                onValueChange={toggleAge}
                value={showAge}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Show pronoun</Text>
          <TouchableOpacity style={{ flex: 1, alignItems: "flex-end" }}>
            <View style={styles.flexRow}>
              <Switch
                trackColor={{ false: "#767577", true: "#76DA69" }}
                thumbColor={"#f4f3f4"}
                ios_backgroundColor='#3e3e3e'
                onValueChange={togglePronoun}
                value={showPronoun}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PrivacySettings;

const styles = StyleSheet.create({
  inputBlock: {
    marginTop: 10,
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
    height: 60,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
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
});
