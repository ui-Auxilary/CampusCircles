import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import Logo from "../assets/campuslogo.svg";
import { Link, router } from "expo-router";

import S from "../styles/global";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { Ionicons } from "@expo/vector-icons";

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [show, setShow] = useState(false);

  const handleLogin = async () => {
    console.log("posting");
    await axios
      .post(`${BASE_URL}/users/login`, loginData)
      .then(({ data }) => {
        console.log("DATA", data);
        router.push({ pathname: "/(tabs)", params: { id: data.data } });
      })
      .catch((e) => console.log(e));
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
});
