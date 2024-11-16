import React from "react";
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
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const Header = ({ title, showAddFriendButton }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Logo style={styles.logo} width={50} height={50} />
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{title}</Text>
        {showAddFriendButton && (
          <TouchableOpacity
            style={styles.addFriendButton}
            onPress={() => navigation.navigate("addFriends")}
          >
            <Ionicons name='person-add-outline' size={28} color='#3A72FF' />
          </TouchableOpacity>
        )}
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
    top: 60,
  },
  headerText: {
    top: -5,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Lexend_400Regular",
  },
  addFriendButton: {
    position: "absolute",
    right: 20,
    top: 10,
    borderRadius: 20,
    padding: 5,
  },
});

export default Header;
