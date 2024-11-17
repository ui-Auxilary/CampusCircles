import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useCallback, useEffect } from "react";

import Right from "../../assets/chev-right.svg";
import { router, useFocusEffect } from "expo-router";
import { getUserData } from "@/hooks/userContext";
import { BASE_URL } from "@/constants/api";
import axios from "axios";

const AccountSettings = () => {
  const { userId, setUserId, editData, setEditData } = getUserData();
  useFocusEffect(
    useCallback(() => {
      axios
        .get(`${BASE_URL}/users/${userId}`)
        .then(({ data }) => setEditData(data.data))
        .catch((e) => console.log(e));
    }, [])
  );

  const handleDelete = () => {
    Alert.alert(
      "Delete account",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Deleting");
            axios
              .delete(`${BASE_URL}/users/${userId}`)
              .then(() => {
                console.log("User deleted");
                router.push("/");
              })
              .catch((e) => console.log(e));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputBlock}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Account ID</Text>

          <View style={styles.flexRow}>
            <Text
              numberOfLines={1}
              ellipsizeMode='tail'
              style={[styles.paramText, { marginRight: 10 }]}
            >
              {editData.id}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.inputBlock}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Username</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={() =>
              router.push({
                pathname: "/edit",
                params: { page: "account", type: "username" },
              })
            }
          >
            <View style={styles.flexRow}>
              <Text
                numberOfLines={1}
                ellipsizeMode='tail'
                style={styles.paramText}
              >
                {editData.username || "Unknown username"}
              </Text>
              <Right width={25} height={25} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Email</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={() =>
              router.push({
                pathname: "/edit",
                params: { page: "account", type: "email" },
              })
            }
          >
            <View style={styles.flexRow}>
              <Text
                numberOfLines={1}
                ellipsizeMode='tail'
                style={styles.paramText}
              >
                {editData.email || "Unknown email"}
              </Text>
              <Right width={25} height={25} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Password</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={() =>
              router.push({
                pathname: "/edit",
                params: { page: "account", type: "password" },
              })
            }
          >
            <View style={styles.flexRow}>
              <Text
                numberOfLines={1}
                ellipsizeMode='tail'
                style={styles.paramText}
                textC
              >
                {editData.password}
              </Text>
              <Right width={25} height={25} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputBlock}>
        <TouchableOpacity
          onPress={() => {
            setEditData({});
            setUserId("");
            router.push("/");
          }}
          style={[styles.inputRow, styles.logoutBtn]}
        >
          <Text style={styles.logoutLabel}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDelete}
          style={[styles.inputRow, styles.logoutBtn]}
        >
          <Text style={styles.deleteLabel}>Delete account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountSettings;

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
  logoutLabel: {
    color: "#3A72FF",
    fontSize: 16,
    fontFamily: "Lexend_500Medium",
  },
  paramText: {
    color: "#C3B6B6",
    fontFamily: "Lexend_400Regular",
  },
  logoutBtn: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    justifyContent: "center",
  },
  deleteLabel: {
    color: "#fa1c2e",
    fontSize: 16,
    fontFamily: "Lexend_500Medium",
  },
});
