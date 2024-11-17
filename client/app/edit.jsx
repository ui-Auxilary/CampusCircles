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
  const { editData } = getUserData();

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
      case "about":
        return <AboutBlock />;
      case "interests":
        return <EditBlock type={"interests"} />;
      default:
        return null;
    }
  }, [params.type]);

  const handleSave = () => {
    router.push({
      pathname: params.page === "edit" ? "/edit-profile" : "/create-profile",
      params: { data: JSON.stringify(editData) },
    });
  };

  useEffect(() => {
    console.log("PAGE", params.page);
  }, [params.page]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.createContainer}>
        <View style={styles.backBtn}>
          <Link
            href={params.page === "edit" ? "/edit-profile" : "/create-profile"}
          >
            <Text style={styles.backTxt}>Back</Text>
          </Link>
        </View>

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
