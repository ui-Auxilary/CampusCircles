import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Right from "../assets/chev-right.svg";
import Logo from "../assets/logo2.svg";

import * as ImagePicker from "expo-image-picker";

import { BASE_URL } from "@/constants/api";
import { getUserData } from "@/hooks/userContext";
import axios from "axios";
import S from "../styles/global";
import Ionicons from "@expo/vector-icons/Ionicons";

const EditProfile = () => {
  const pickerRef = useRef();

  const params = useLocalSearchParams();
  const { userId, setUserId, editData, setEditData } = getUserData();
  const [age, setAge] = useState(editData.age);
  const [name, setName] = useState(editData.name);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (result) {
      setEditData({
        ...editData,
        photo: result.assets ? result.assets[0].uri : "",
      });
    }
  };

  useEffect(() => {
    console.log("USER", params.data);
    console.log("EDIT", editData);
  }, [params.data]);
  const renderDegree = () => {
    let studyYear = editData.studyYear;
    let degree = editData.degree;

    if (studyYear && degree) {
      return `${studyYear} | ${degree}`;
    } else if (studyYear) {
      return `${studyYear}`;
    } else if (degree) {
      return `${degree}`;
    }

    return "";
  };

  useEffect(() => {
    if (params.data) {
      setEditData(JSON.parse(params.data));
    }
    if (params.id) {
      // Set context
      setUserId(params.id);
    }
  }, []);

  const handleEditProfile = () => {
    let userData = editData;
    userData.interests =
      typeof userData === "string"
        ? userData.interests.split(",")
        : userData.interests;
    userData.courses =
      typeof userData === "string"
        ? userData.courses.split(",")
        : userData.courses;

    console.log("ID", userId, editData);
    axios
      .put(`${BASE_URL}/users/${userId}`, userData)
      .then(() => {
        console.log("Successfully edited user profile");
        // Navigate to wizard or homepage for now
        router.push("/(tabs)/profile");
        // Reset data
        setEditData({
          name: "",
          age: 0,
          languages: [],
          bio: "",
          mbti: "",
          interests: "",
          courses: "",
        });
      })
      .catch((e) => console.log(e));
  };
  return (
    <View style={styles.container}>
      <Logo style={styles.logo} width={50} height={50} />
      <View style={styles.profileHeader}>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>
      <View style={styles.profileImgContainer}>
        {params.picture ? (
          <Image style={styles.profileImg} src={params.picture} />
        ) : (
          <Image
            style={styles.profileImg}
            source={{
              uri:
                editData.photo ||
                "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg",
            }}
          />
        )}
        <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
          <Ionicons name={"camera"} size={30} color={"#FFFFFF"} />
        </TouchableOpacity>
      </View>

      <View style={styles.inputBlock}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>About me</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={() =>
              router.push({
                pathname: "/edit",
                params: { page: "edit", type: "about" },
              })
            }
          >
            <View style={styles.flexRow}>
              <Text
                numberOfLines={1}
                ellipsizeMode='tail'
                style={styles.paramText}
              >
                {editData?.name}
                {editData?.age ? ", " + editData.age : ""}
                {editData?.gender ? ", " + editData.gender : ""}
              </Text>
              <Right width={25} height={25} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputBlock}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Language</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={() =>
              router.push({
                pathname: "/edit",
                params: { page: "edit", type: "language" },
              })
            }
          >
            <View style={styles.flexRow}>
              <Text
                numberOfLines={1}
                ellipsizeMode='tail'
                style={styles.paramText}
              >
                {editData?.languages ? editData.languages.join(", ") : ""}
              </Text>
              <Right width={25} height={25} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <View stlye={styles.flexCol}>
            <Text style={styles.inputLabel}>Self introduction</Text>
            <Text ellipsizeMode='tail' numberOfLines={1} style={styles.bioText}>
              {editData.bio || ""}
            </Text>
          </View>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={() =>
              router.push({
                pathname: "/edit",
                params: { page: "edit", type: "intro" },
              })
            }
          >
            <Right width={25} height={25} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputBlock}>
        <View style={[styles.inputRow, { paddingVertical: 0 }]}>
          <Text style={styles.inputLabel}>MBTI</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={() =>
              router.push({
                pathname: "/edit",
                params: { page: "edit", type: "mbti" },
              })
            }
          >
            <View style={styles.flexRow}>
              <Text style={styles.paramText}>{editData.mbti || ""}</Text>
              <Right width={25} height={25} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputBlock}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Degree</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={() =>
              router.push({
                pathname: "/edit",
                params: { page: "edit", type: "degree" },
              })
            }
          >
            <View style={styles.flexRow}>
              <Text style={styles.paramText}>{renderDegree()}</Text>
              <Right width={25} height={25} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Interests</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={() =>
              router.push({
                pathname: "/edit",
                params: { page: "edit", type: "interests" },
              })
            }
          >
            <View style={styles.flexRow}>
              <Text style={styles.paramText}>{editData.interests || ""}</Text>
              <Right width={25} height={25} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Courses</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "flex-end" }}
            onPress={() =>
              router.push({
                pathname: "/edit",
                params: { page: "edit", type: "courses" },
              })
            }
          >
            <View style={styles.flexRow}>
              <Text style={styles.paramText}>{editData.courses || ""}</Text>
              <Right width={25} height={25} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleEditProfile}
        style={[S.btnMed, { marginTop: 30 }]}
      >
        <Text style={S.txtLrg}>Done</Text>
      </TouchableOpacity>
      <View style={styles.loginFooter}></View>
    </View>
  );
};

export default EditProfile;

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
});
