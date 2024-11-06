import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { Link, useLocalSearchParams, router } from "expo-router";
import { getUserData } from "@/hooks/userContext";

import tick from "../../assets/images/tick.png";
import cross from "../../assets/images/cross.png";

const HomeTab = () => {
  const { setUserId } = getUserData();
  const { id } = useLocalSearchParams();
  useEffect(() => {
    console.log("params", id);
    if (id) {
      setUserId(id);
    }
  }, [id]);

  return (
    <View style={styles.homepage}>
      <View style={styles.titleContainer}>
        <Text style={[styles.text, styles.titleText]}>Welcome, USER</Text>
      </View>
      <View style={styles.notifications}>
        <Text style={styles.text}>Notifications</Text>
        <ScrollView></ScrollView>
      </View>
      <View style={styles.events}>
        <Text style={styles.text}>Your Events</Text>
        <ScrollView></ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  homepage: {
    flex: 1,
    backgroundColor: "#EEEEEE",
    paddingVertical: 15,
    paddingHorizontal: 30,
    rowGap: 15,
  },
  titleContainer: { flex: 1, justifyContent: "center" },
  notifications: { flex: 5 },
  events: { flex: 5 },
  text: { paddingLeft: 7.5, color: "#454545", fontSize: 25 },
  titleText: { fontWeight: "bold" },
});

export default HomeTab;
