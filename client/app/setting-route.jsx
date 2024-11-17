import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocalSearchParams, router, Link } from "expo-router";
import Logo from "../assets/logo2.svg";

import { Picker } from "@react-native-picker/picker";

import S from "../styles/global";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { getUserData } from "@/hooks/userContext";

import AccountSettings from "@/components/Setting/AccountSettings";
import AccessibilitySettings from "@/components/Setting/AccessibilitySettings";
import NotificationSettings from "@/components/Setting/NotificationSettings";
import PrivacySettings from "@/components/Setting/PrivacySettings";

const SettingRoute = () => {
  const params = useLocalSearchParams();

  const renderEditBlock = useCallback(() => {
    switch (params.page) {
      case "account":
        return <AccountSettings />;
      case "accessibility":
        return <AccessibilitySettings />;
      case "notifications":
        return <NotificationSettings />;
      case "privacy":
        return <PrivacySettings />;
      default:
        return null;
    }
  }, [params.type]);

  const handleBack = () => {
    switch (params.page) {
      case "settings":
        router.back();
        break;
      default:
        router.push("/settings");
        break;
    }
  };
  return (
    <View style={styles.container}>
      <Logo style={styles.logo} width={50} height={50} />
      <View style={styles.profileHeader}>
        <Text style={styles.headerTitle}>
          {params.page.charAt(0).toUpperCase() + params.page.substring(1)}
        </Text>
      </View>
      <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
        <Text style={styles.backTxt}>Back</Text>
      </TouchableOpacity>
      <ScrollView style={styles.createContainer}>
        <View
          style={{
            flex: 1,
            padding: 0,
            margin: 0,
          }}
        >
          {renderEditBlock()}
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingRoute;

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
  createContainer: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
    width: "100%",
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
  selectBtn: {
    backgroundColor: "#FFFFFF",
  },
});
