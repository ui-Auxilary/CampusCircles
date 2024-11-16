import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import axios from "axios";

import S from "../styles/global";
import { BASE_URL } from "@/constants/api";
import Google from "../assets/google.png";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCallback = (e) => {
    let url = e.url;

    let regex = /[?&]([^=#]+)=([^&#]*)/g,
      params = {},
      match;

    while ((match = regex.exec(url))) {
      params[match[1]] = match[2];
      console.log(match[1], match[2]);
    }

    router.push({ pathname: "/create-profile", params });
  };

  const handleOAuth = async () => {
    const REDIRECT_URI = "https://campus-circles.vercel.app/swg";
    await WebBrowser.openAuthSessionAsync(
      `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&access_type=offline&state=1234_purpleGoogle&prompt=consent`,
      REDIRECT_URI
    );

    let link = Linking.addEventListener("url", (e) => {
      handleCallback(e);
    });
  };

  const handleRegister = () => {
    const userData = {
      ...user,
    };

    const requiredFields = ["username", "email", "password"];
    for (let field of requiredFields) {
      if (!userData[field] || !confirmPassword) {
        Alert.alert(`One of more required fields missing`);
        return;
      }
    }

    let { password, email } = userData;

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) !== true) {
      Alert.alert(`Email is in the incorrect format`);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(`Passwords don't match, please try again`);
      return;
    }

    axios
      .post(`${BASE_URL}/users`, userData)
      .then(({ data }) => {
        console.log("USR DATA", data);
        router.push({
          pathname: "/create-profile",
          params: { id: data.data },
        });
      })
      .catch((e) => {
        console.log(e);
        // Raise error message
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.loginContainer}>
          <View style={styles.loginWrapper}>
            <Text style={styles.registerTitle}>Register</Text>
            <View>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                onChangeText={(val) => {
                  setUser({ ...user, username: val });
                }}
                style={styles.inputField}
                placeholder='Username'
              />
            </View>
            <View>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                onChangeText={(val) => {
                  setUser({ ...user, email: val });
                }}
                style={styles.inputField}
                placeholder='Email'
              />
            </View>
            <View>
              <Text style={styles.inputLabel}>Password</Text>
              <Pressable style={styles.inputBox} onPress={() => setShow(!show)}>
                <TextInput
                  onChangeText={(val) => {
                    setUser({ ...user, password: val });
                  }}
                  secureTextEntry={show ? false : true}
                  style={styles.inputField}
                  placeholder='Password'
                />
                <Ionicons
                  name={show ? "eye-off" : "eye"}
                  size={28}
                  style={styles.eye}
                  color={"#BDBFC3"}
                />
              </Pressable>
            </View>
            <View>
              <Text style={styles.inputLabel}>Confirm password</Text>
              <Pressable
                style={styles.inputBox}
                onPress={() => setShowConfirm(!showConfirm)}
              >
                <TextInput
                  onChangeText={(val) => {
                    setConfirmPassword(val);
                  }}
                  secureTextEntry={showConfirm ? false : true}
                  style={styles.inputField}
                  placeholder='Password'
                />
                <Ionicons
                  name={showConfirm ? "eye-off" : "eye"}
                  size={28}
                  style={styles.eye}
                  color={"#BDBFC3"}
                />
              </Pressable>
            </View>
            <TouchableOpacity onPress={handleRegister} style={S.btnLrg}>
              <Text style={S.txtLrg}>Register</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.lineBreak}>
            <Text style={styles.lineBreakText}>OR</Text>
          </View>

          <TouchableOpacity onPress={handleOAuth} style={styles.swg}>
            <Image
              style={styles.googleLogo}
              source={require("../assets/google.png")}
            />
            <Text style={styles.swgText}>Sign up with google</Text>
            <View />
          </TouchableOpacity>

          <View style={styles.registerFooter}>
            <Link href={{ pathname: "login" }}>
              <Text style={styles.registerText}>
                Already have an account?
                <Text style={styles.bold}> Log in</Text>
              </Text>
            </Link>
          </View>
        </View>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push("/create-profile")}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Skip register
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3A72FF",
    padding: 20,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loginContainer: {
    position: "relative",
    flex: 1,
    width: "100%",
    padding: 20,
  },
  loginWrapper: {
    marginTop: 50,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  registerTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 36,
    color: "#FFFFFF",
  },
  inputField: {
    paddingHorizontal: 15,
    borderRadius: 5,
    height: 45,
    width: "100%",
    backgroundColor: "#FFFFFF",
    zIndex: 2,
    position: "relative",
  },
  inputLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Lexend_400Regular",
  },
  logo: {
    position: "absolute",
    left: 0,
    top: 10,
  },
  registerFooter: {
    alignItems: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "Lexend_400Regular",
    textDecorationLine: "underline",
  },
  bold: {
    fontFamily: "Lexend_700Bold",
    color: "#76DA69",
  },
  skipButton: {
    paddingHorizontal: 10,
    backgroundColor: "#ad24c9",
    height: 50,
    justifyContent: "center",
    borderRadius: 5,
    position: "absolute",
    top: 90,
    right: 40,
  },
  lineBreak: {
    height: 3,
    position: "relative",
    backgroundColor: "#FFFFFF",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  lineBreakText: {
    position: "absolute",
    backgroundColor: "#3A72FF",
    paddingHorizontal: 20,
    color: "#FFFFFF",
    zIndex: 2,
    fontFamily: "Lexend_700Bold",
  },
  swg: {
    marginTop: 20,
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  swgText: {
    alignSelf: "center",
    fontFamily: "Lexend_400Regular",
  },
  googleLogo: {
    width: 29,
    height: 30,
  },
  inputBox: {
    justifyContent: "center",
  },
  eye: {
    alignSelf: "flex-end",
    position: "absolute",
    zIndex: 2,
    right: 10,
  },
  scroll: {
    width: "100%",
  },
});
