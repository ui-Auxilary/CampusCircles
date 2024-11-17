import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, router } from "expo-router";

export default function HeaderAction({ action }) {
  const [icon, setIcon] = useState("");
  useFocusEffect(
    useCallback(() => {
      const getIcon = () => {
        switch (action) {
          case "addFriends":
            setIcon("person-add-outline");
            break;
          case "settings":
            setIcon("settings-outline");
            break;
          default:
            break;
        }
      };

      if (action) {
        getIcon();
      }
    }, [action])
  );

  return (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={() => router.push(`${action}`)}
    >
      <Ionicons name={icon} size={28} color='#3A72FF' />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    position: "absolute",
    right: 20,
    top: 10,
    borderRadius: 20,
    padding: 5,
  },
});
