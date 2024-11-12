import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import Logo from "../assets/logo2.svg";

const { width } = Dimensions.get("window");

const Header = ({ title }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Logo style={styles.logo} width={50} height={50} />
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    width: width,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    paddingBottom: 10,
    position: "relative",
    top: 0,
    paddingVertical: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  logo: {
    position: "absolute",
    left: 20,
    top: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Lexend_400Regular",
  },
});

export default Header;
