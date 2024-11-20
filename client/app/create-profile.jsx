import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Right from "../assets/chev-right.svg";

import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";

import { BASE_URL } from "@/constants/api";
import { getUserData } from "@/hooks/userContext";
import axios from "axios";
import S from "../styles/global";
import Ionicons from "@expo/vector-icons/Ionicons";
import { uploadImage } from "@/helper/uploadImage";

const CreateProfile = () => {
  const [mediaLibraryPermissions, requestMediaLibraryPermissions] =
    ImagePicker.useMediaLibraryPermissions();

  const params = useLocalSearchParams();
  const { userId, setUserId, editData, setEditData, hasHaptic } = getUserData();
  const [photo, setPhoto] = useState("");

  const pickImage = async () => {
    if (!mediaLibraryPermissions?.granted) {
      const hasPermissions = await checkPermissions();
      if (!hasPermissions) return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: 1,
      base64: true,
    });

    if (result && !result.canceled) {
      const base64Image = result.assets ? result.assets[0].base64 : "";

      try {
        const response = await uploadImage(userId, {
          photo: base64Image,
        });
        setEditData({ ...editData, photo: response.data.data });
        setPhoto(result.assets[0].uri);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const checkPermissions = async () => {
    if (!mediaLibraryPermissions?.granted) {
      const libraryStatus = await requestMediaLibraryPermissions();

      if (!libraryStatus.granted) {
        {
          hasHaptic &&
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        Alert.alert(
          "Permissions Required",
          "Please grant camera and media library permissions in settings to use this feature."
        );
      }
    }
  };

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
    if (params.profile) {
      setEditData(JSON.parse(params.profile));
    }

    if (params.id) {
      // Set context
      if (params.photo !== "") {
        console.log("PARAMS", params.photo);
        setPhoto(params.photo);
        setEditData({ ...editData, [photo]: params.photo });
      }
      setUserId(params.id);
    }
  }, []);

  const handleCreateProfile = () => {
    let userData = editData;
    axios
      .put(`${BASE_URL}/users/${userId}`, userData)
      .then(() => {
        console.log("Successfully created user profile");

        // Reset data
        setEditData({
          name: "",
          age: "",
          languages: [],
          bio: "",
          mbti: "",
          interests: "",
          courses: "",
        });
        // Navigate to wizard or homepage for now
        router.push("/wizard");
      })
      .catch((e) => console.log(e));

    router.push("/wizard");
  };
  return (
    <View style={styles.container}>
      <View style={styles.profileImgContainer}>
        {params.picture ? (
          <Image style={styles.profileImg} src={params.picture} />
        ) : (
          <Image
            style={styles.profileImg}
            source={{
              uri:
                photo ||
                editData?.photo ||
                params?.photo ||
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
                params: { page: "create", type: "about" },
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
                params: { page: "create", type: "language" },
              })
            }
          >
            <View style={styles.flexRow}>
              <Text
                numberOfLines={1}
                ellipsizeMode='tail'
                style={styles.paramText}
              >
                {editData?.languages
                  ? editData.languages.filter((lang) => lang).join(", ")
                  : ""}
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
                params: { page: "create", type: "intro" },
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
                params: { page: "create", type: "mbti" },
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
                params: { page: "create", type: "degree" },
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
                params: { page: "create", type: "interests" },
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
                params: { page: "create", type: "courses" },
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
        onPress={handleCreateProfile}
        style={[S.btnMed, { marginTop: 30 }]}
      >
        <Text style={S.txtLrg}>Create</Text>
      </TouchableOpacity>
      <View style={styles.loginFooter}></View>
    </View>
  );
};

export default CreateProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEEEEE",
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
