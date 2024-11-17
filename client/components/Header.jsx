import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Logo from "../assets/logo2.svg";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import HeaderAction from "./HeaderAction/HeaderAction";

const Header = ({ title, showAddFriendButton, showSettings }) => {
  const [action, setAction] = useState("");

  useFocusEffect(
    useCallback(() => {
      const getAction = () => {
        if (showAddFriendButton) {
          setAction("addFriends");
        } else if (showSettings) {
          setAction("settings");
        }
      };

      if (showSettings || showAddFriendButton) {
        console.log("GET ACTION", showAddFriendButton);
        console.log("SETTINGS", showSettings);
        getAction();
      }
    }, [showAddFriendButton, showSettings])
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <Logo style={styles.logo} width={50} height={50} />
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{title}</Text>
        {action ? <HeaderAction action={action} /> : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
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
    top: "50%",
  },
  headerText: {
    top: -5,
    fontSize: 24,
    color: "#333",
    fontFamily: "Lexend_500Medium",
  },
});

export default Header;
