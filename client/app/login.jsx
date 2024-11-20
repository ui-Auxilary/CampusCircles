import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  Image,
} from "react-native";
import React, { useState } from "react";
import Logo from "../assets/campuslogo.svg";
import { Link, router } from "expo-router";

import * as WebBrowser from "expo-web-browser";

import S from "../styles/global";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { Ionicons } from "@expo/vector-icons";
import { getUserData } from "@/hooks/userContext";

import * as Haptics from "expo-haptics";

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [show, setShow] = useState(false);
  const { setShowAge, setShowPronoun, setHasHaptic, setAllowNotif, setUserId } =
    getUserData();

  const handleCallback = (e) => {
    let url = e.url;

    let regex = /[?&]([^=#]+)=([^&#]*)/g,
      params = {},
      match;

    while ((match = regex.exec(url))) {
      params[match[1]] = match[2];
      console.log(match[1], match[2]);
    }

    let submitData = {};
    submitData["username"] = params.name;
    submitData["password"] = "";

    axios
      .post(`${BASE_URL}/users/login`, submitData)
      .then(({ data }) => {
        let { showAge, showPronoun, allowNotif, hasHaptic, id } = data.data;
        setShowAge(showAge);
        setShowPronoun(showPronoun);
        setAllowNotif(allowNotif);
        setHasHaptic(hasHaptic);
        setUserId(id);
        router.push({ pathname: "/(tabs)" });
      })
      .catch((e) => {
        if (e.response && e.response.status === 400) {
          Alert.alert(e.response?.data?.message);
        } else {
          console.log(e);
        }
      });
  };

  const handleOAuth = async () => {
    console.log("Here", process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID);
    const REDIRECT_URI = "https://campus-circles.vercel.app/swg";
    let res = await WebBrowser.openAuthSessionAsync(
      `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&access_type=offline&state=1234_purpleGoogle&prompt=consent`,
      REDIRECT_URI
    );

    handleCallback(res);
  };

  const handleLogin = async () => {
    let requiredFields = ["username", "password"];

    for (let field of requiredFields) {
      if (!loginData[field]) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert("Form Incomplete", `Please fill out the ${field} field.`);
        return;
      }
    }

    await axios
      .post(`${BASE_URL}/users/login`, loginData)
      .then(({ data }) => {
        let { showAge, showPronoun, allowNotif, hasHaptic, id } = data.data;
        setShowAge(showAge);
        setShowPronoun(showPronoun);
        setAllowNotif(allowNotif);
        setHasHaptic(hasHaptic);
        setUserId(id);
        router.push({ pathname: "/(tabs)" });
      })
      .catch((e) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Incorrect username or password");
        return;
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <View style={styles.loginWrapper}>
          <Text style={styles.loginTitle}>Login</Text>
          <View>
            <Text style={styles.inputLabel}>Email/Username</Text>
            <TextInput
              onChangeText={(val) =>
                setLoginData({ ...loginData, username: val })
              }
              style={styles.inputField}
              placeholder='Email/Username'
              placeholderTextColor='#D3D3D3'
            />
          </View>
          <View>
            <Text style={styles.inputLabel}>Password</Text>
            <Pressable style={styles.inputBox} onPress={() => setShow(!show)}>
              <TextInput
                onChangeText={(val) =>
                  setLoginData({ ...loginData, password: val })
                }
                secureTextEntry={show ? false : true}
                style={styles.inputField}
                placeholder='Password'
                placeholderTextColor='#D3D3D3'
              />
              <Ionicons
                name={show ? "eye-off" : "eye"}
                size={28}
                style={styles.eye}
                color={"#BDBFC3"}
              />
            </Pressable>
          </View>
          <TouchableOpacity style={S.btnLrg} onPress={handleLogin}>
            <Text style={S.txtLrg}>Login</Text>
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
          <Text style={styles.swgText}>Sign in with google</Text>
          <View />
        </TouchableOpacity>
        <Logo style={styles.logo} />
        <View style={styles.loginFooter}>
          <Link href={{ pathname: "register" }}>
            <Text style={styles.loginText}>
              Don't have an account?
              <Text style={styles.bold}> Register here</Text>
            </Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3A72FF",
    padding: 20,
    paddingVertical: 80,
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
    marginTop: 100,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  loginTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 32,
    color: "#FFFFFF",
  },
  inputField: {
    paddingHorizontal: 15,
    borderRadius: 5,
    height: 50,
    width: "100%",
    backgroundColor: "#FFFFFF",
    zIndex: 2,
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
    top: 0,
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
  loginText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "Lexend_400Regular",
    textDecorationLine: "underline",
  },
  bold: {
    fontFamily: "Lexend_700Bold",
    color: "#76DA69",
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
});
