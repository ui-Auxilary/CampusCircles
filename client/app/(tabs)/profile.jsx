import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { getUserData } from "@/hooks/userContext";
import { BASE_URL } from "@/constants/api";
import axios from "axios";
import TagRow from "@/components/TagRow/TagRow";
import LanguageRow from "@/components/LanguageRow/LanguageRow";
import Ionicons from "@expo/vector-icons/Ionicons";

import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
const ProfileTab = () => {
  const { userId, editData, setEditData } = getUserData();

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        // Fetch request
        axios
          .get(`${BASE_URL}/users/${userId}`)
          .then(({ data }) => {
            console.log("EDIT DATA", data);
            setEditData(data.data);
          })
          .catch((e) => console.log(e));
      }
    }, [])
  );

  useEffect(() => {
    console.log("editData", editData);
  }, [editData]);

  return (
    <ScrollView style={styles.profileContainer}>
      <View style={styles.editProfile}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "edit-profile",
              params: { data: JSON.stringify(editData) },
            })
          }
          style={styles.editWrapper}
        >
          <Text style={styles.editText}>Edit profile</Text>
          <Ionicons name={"pencil"} size={20} color={"#3A72FF"} />
        </TouchableOpacity>
      </View>
      <View style={styles.userContainer}>
        <View style={styles.userDetailsWrapper}>
          <Image
            style={styles.profileImg}
            source={{
              uri: editData.photo
                ? editData.photo
                : "https://www.gravatar.com/avatar/?d=identicon",
            }}
          />
          <View style={styles.userDetails}>
            <View style={styles.userNameWrapper}>
              <Text style={styles.userNameTitle}>{editData.name}</Text>
              <Text style={styles.age}>
                {editData.age} • {editData.gender}
              </Text>
            </View>
            <Text style={styles.yearOfStudy}>3rd year | Computer science</Text>
            <LanguageRow languages={editData.languages} />
          </View>
        </View>
        <View style={styles.metricsContainer}>
          <View>
            <Text style={styles.metricText}>11</Text>
            <Text style={styles.metricSpan}>Friends</Text>
          </View>
          <View>
            <Text style={styles.metricText}>3</Text>
            <Text style={styles.metricSpan}>Events</Text>
          </View>
        </View>
      </View>
      <View style={styles.profileSection}>
        <Text style={styles.profileTitle}>Self introduction</Text>
        <View style={styles.introBlock}>
          <Text style={styles.introText}>{editData.bio}</Text>
        </View>
      </View>
      <View style={styles.profileSection}>
        <LinearGradient
          colors={["#FFFFFF", "#D5A6FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.mbtiBlock}
        >
          <Text style={styles.mbtiText}>{editData.mbti}</Text>
        </LinearGradient>
      </View>
      <View style={styles.profileSection}>
        <Text style={styles.profileTitle}>Interests</Text>
        <TagRow tags={editData.interests} />
      </View>
      <View style={styles.profileSection}>
        <Text style={styles.profileTitle}>Courses I'm doing</Text>
        <TagRow tags={editData.courses} />
      </View>
      <View style={styles.overscroll} />
    </ScrollView>
  );
};

export default ProfileTab;

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    backgroundColor: "#EEEEEE",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
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
  inputBlock: {},
  inputRow: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 2,
  },
  inputField: {
    paddingHorizontal: 15,
    width: "70%",
    borderBottomColor: "#D9D9D9",
    borderBottomWidth: 2,
    zIndex: 2,
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
  profileImgContainer: {
    height: 150,
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  userDetailsWrapper: {
    flexDirection: "row",
    gap: 10,
  },
  userNameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userNameTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 18,
  },
  userContainer: {
    flexDirection: "column",
    gap: 25,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    elevation: 4,
  },
  age: {
    backgroundColor: "#3A72FF",
    paddingHorizontal: 10,
    paddingVertical: 2,
    color: "#FFFFFF",
    letterSpacing: -0.5,
    borderRadius: 20,
    alignItems: "center",
    fontFamily: "Lexend_600SemiBold",
  },
  yearOfStudy: {
    fontFamily: "Lexend_400Regular",
    color: "#8E8E93",
  },

  metricsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  metricText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 20,
    textAlign: "center",
  },
  metricSpan: {
    fontFamily: "Lexend_400Regular",
    color: "#AEAEB2",
    fontSize: 12,
  },
  profileSection: {
    paddingHorizontal: 10,
  },
  profileTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 18,
    marginTop: 10,
    color: "#20303C",
  },
  mbtiBlock: {
    borderRadius: 10,
    width: "100%",
    height: 55,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffsetWidth: 10,
    shadowOffsetHeight: 20,
    elevation: 4,
    marginTop: 15,
  },
  mbtiText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 20,
    color: "#AE79F9",
  },
  introBlock: {
    padding: 5,
    backgroundColor: "#FFFFFF",
    height: 120,
    width: "100%",
    marginTop: 10,
    borderRadius: 10,
    elevation: 4,
    padding: 10,
  },
  introText: {
    fontFamily: "Lexend_500Medium",
    fontSize: 12,
    color: "#20303C",
  },
  overscroll: {
    height: 50,
  },
  editText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#3A72FF",
  },
  editProfile: {
    alignSelf: "flex-end",
  },
  editWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
