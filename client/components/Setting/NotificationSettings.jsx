import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

import Right from "../../assets/chev-right.svg";

const NotificationSettings = () => {
  return (
    <View style={styles.container}>
      <View style={styles.inputBlock}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Notification Settings</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={() =>
              // router.push({
              //   pathname: "/setting-route",
              //   params: { page: "account" },
              // })
              {}
            }
          >
            <View style={styles.flexRow}>
              <Right width={25} height={25} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default NotificationSettings;

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
