import { Stack, Link } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useEffect } from "react";

import Logo from "../assets/campuslogo.svg";
import CampSplash from "@/assets/campsplash.png";
import SplashBG from "@/assets/splashbg.png";

import {
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  useFonts,
} from "@expo-google-fonts/lexend";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function Home() {
  const [loaded, error] = useFonts({
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_700Bold,
    Lexend_600SemiBold,
  });
  const navigation = useNavigation();

  // Loading font from the docs
  useEffect(() => {
    if (loaded || error) {
      navigation.setOptions({ headerShown: false });
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.homeContainer}>
      <View style={styles.homeCircle} />
      <View style={styles.heroContainer}>
        <Text style={styles.heroTitle}>Campus Circles</Text>
        <Text style={styles.heroSubtitle}>Discover new mates on Campus</Text>
        <TouchableOpacity style={styles.startButton}>
          <Link style={{ textAlign: "center" }} href={{ pathname: "login" }}>
            <Text style={styles.startText}>Get started</Text>
          </Link>
        </TouchableOpacity>
      </View>
      <View style={styles.splashContainer}>
        <Image style={styles.splashImg} source={CampSplash} />
        <Image style={styles.splashBG} source={SplashBG} />
      </View>
      <Logo style={styles.campusLogo} width={"20%"} height={"10%"} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#3B63FF",
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 30,
  },
  homeCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#76DA69",
    position: "absolute",
    top: -50,
    left: -60,
  },
  homeContainer: {
    position: "relative",
    flex: 1,
    backgroundColor: "#3A72FF",

    justifyContent: "center",
    alignItems: "center",
  },
  splashContainer: {
    display: "flex",
    position: "absolute",
    flex: 1,
    height: "50%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    bottom: -60,
  },
  splashImg: {
    objectFit: "contain",
    height: "100%",
  },
  splashImg: {
    objectFit: "contain",
    height: "100%",
    zIndex: 1,
  },
  splashBG: {
    objectFit: "contain",
    height: "100%",
    position: "absolute",
  },
  campusLogo: {
    position: "absolute",
    top: 50,
    left: 30,
  },
  startButton: {
    marginTop: 10,
    backgroundColor: "#76DA69",
    borderRadius: 5,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    height: 55,
    width: 180,
    justifyContent: "center",
    alignSelf: "center",
    zIndex: 2,
  },
  startText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: "Lexend_600SemiBold",
  },
  heroContainer: {
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 40,
    gap: 10,
    top: -80,
  },
  heroTitle: {
    fontSize: 50,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "Lexend_700Bold",
  },
  logo: {
    transform: [{ scale: 1 }],
  },
  heroSubtitle: {
    fontSize: 22,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "Lexend_400Regular",
  },
});
