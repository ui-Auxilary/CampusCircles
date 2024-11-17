import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

import Right from "../assets/chev-right.svg";
import Logo from "../assets/logo2.svg";
import { Link, router } from "expo-router";

const Settings = () => {
  return (
    <View style={styles.container}>
      <Logo style={styles.logo} width={50} height={50} />
      <View style={styles.profileHeader}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backTxt}>Back</Text>
      </TouchableOpacity>
      <View style={styles.inputBlock}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Account</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={() =>
              router.push({
                pathname: "/setting-route",
                params: { page: "account" },
              })
            }
          >
            <View style={styles.flexRow}>
              <Right width={25} height={25} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputBlock}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Accessibility</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={() =>
              router.push({
                pathname: "/setting-route",
                params: { page: "accessibility" },
              })
            }
          >
            <View style={styles.flexRow}>
              <Right width={25} height={25} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputBlock}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Notifications</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={() =>
              router.push({
                pathname: "/setting-route",
                params: { page: "notifications" },
              })
            }
          >
            <View style={styles.flexRow}>
              <Right width={25} height={25} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Privacy</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={() =>
              router.push({
                pathname: "/setting-route",
                params: { page: "privacy" },
              })
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

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  profileHeader: {
    height: 100,
    backgroundColor: "#FFFFFF",
    width: "100%",
    padding: 20,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  logo: {
    position: "absolute",
    top: 35,
    left: 15,
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 24,
    color: "#333",
    fontFamily: "Lexend_500Medium",
  },
  backBtn: {
    padding: 10,
    backgroundColor: "#3A72FF",
    width: 80,
    margin: 10,
    marginTop: 15,
    borderRadius: 100,
    alignItems: "center",
  },
  backTxt: {
    color: "#FFFFFF",
    fontFamily: "Lexend_400Regular",
  },
});
