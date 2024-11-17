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

import EditLanguage from "@/components/Edit/EditLanguage";
import EditIntroduction from "@/components/Edit/EditIntroduction";
import EditMbti from "@/components/Edit/EditMbti";
import EditBlock from "@/components/Edit/EditBlock";
import EditDegree from "@/components/Edit/EditDegree";
import AboutBlock from "@/components/Edit/AboutBlock";

const Edit = () => {
  const params = useLocalSearchParams();
  const { editData, userId } = getUserData();

  const renderEditBlock = useCallback(() => {
    switch (params.type) {
      case "language":
        return <EditLanguage />;
      case "mbti":
        return <EditMbti />;
      case "intro":
        return <EditIntroduction />;
      case "degree":
        return <EditDegree />;
      case "courses":
        return <EditBlock type={"courses"} />;
      case "username":
        return <EditBlock type={"username"} />;
      case "email":
        return <EditBlock type={"email"} />;
      case "password":
        return <EditBlock type={"password"} />;
      case "about":
        return <AboutBlock />;
      case "interests":
        return <EditBlock type={"interests"} />;
      default:
        return null;
    }
  }, [params.type]);

  const navigate = () => {
    switch (params.page) {
      case "edit":
        router.push({
          pathname: "/edit-profile",
        });
        break;
      case "create":
        router.push({
          pathname: "/create-profile",
        });
        break;
      default:
        router.push({
          pathname: "/setting-route",
          params: { page: params.page },
        });
    }
  };
  const handleSave = () => {
    console.log("Updated", editData);
    axios
      .put(`${BASE_URL}/users/${userId}`, editData)
      .then(() => {
        console.log("Successfully edited field");
        navigate();
      })
      .catch((e) => console.log(e));
    1;
  };

  useEffect(() => {
    console.log("PAGE", params.page);
  }, [params.page]);

  return (
    <View style={styles.container}>
      <Logo style={styles.logo} width={50} height={50} />
      <View style={styles.profileHeader}>
        <Text style={styles.headerTitle}>
          {params.page === "create" ? "Add" : "Edit"} {params.type}
        </Text>
      </View>
      <ScrollView style={styles.createContainer}>
        <TouchableOpacity onPress={handleSave} style={styles.backBtn}>
          <Text style={styles.backTxt}>Back</Text>
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            padding: 0,
            margin: 0,
          }}
        >
          {renderEditBlock()}
        </View>

        <TouchableOpacity onPress={handleSave} style={S.btnMed}>
          <Text style={S.txtLrg}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Edit;

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
