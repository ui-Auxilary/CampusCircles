import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { getUserData } from "@/hooks/userContext";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";

import * as Haptics from "expo-haptics";

const UserList = () => {
  const { userId, hasHaptic } = getUserData();
  const [search, setSearch] = useState("");
  const [nonFriends, setNonFriends] = useState([]);
  const navigation = useNavigation();

  const handleNavigateToProfile = (friendId) => {
    navigation.navigate("otherProfile", { userId: friendId, key: friendId });
  };

  useFocusEffect(
    useCallback(() => {
      const fetchNonFriends = async () => {
        try {
          const url = `${BASE_URL}/users/${userId}/non-friends`;
          console.log("Fetching non-friends from:", url);
          const response = await axios.get(url);
          setNonFriends(response.data.data);
        } catch (error) {
          {
            hasHaptic &&
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
          console.error("Error fetching non-friend users:", error);
        }
      };

      if (userId) {
        fetchNonFriends();
      }
    }, [userId])
  );

  const handleAddFriend = async (friendId) => {
    try {
      const url = `${BASE_URL}/users/${userId}/add-friend`;
      const response = await axios.post(url, { friendId });

      if (response.data.status) {
        // Remove the added friend from the nonFriends list
        setNonFriends((prevNonFriends) =>
          prevNonFriends.filter((user) => user.id !== friendId)
        );
      } else {
        {
          hasHaptic &&
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Failed to add friend:", error);
      {
        hasHaptic &&
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      alert("An error occurred. Please try again later.");
    }
  };

  const filteredUsers = nonFriends.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name='search'
          size={20}
          color='#888'
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchBar}
          placeholder='Search by name...'
          placeholderTextColor='#888'
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>
      <ScrollView>
        {filteredUsers.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.friendCard}
            onPress={() => handleNavigateToProfile(user.id)}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: "https://www.gravatar.com/avatar/?d=identicon",
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{user.name}</Text>
              <View style={styles.separator} />
              <Text style={styles.info}>
                {user.studyYear || "Unknown Year"} |{" "}
                {user.degree || "Unknown Degree"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={(e) => handleAddFriend(user.id, e)}
            >
              <Ionicons name='person-add' size={24} color='#3b82f6' />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 20,
    fontSize: 16,
    color: "#000",
  },
  friendCard: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    marginVertical: 5,
    borderRadius: 10,
  },
  imageContainer: {
    paddingLeft: 20,
    marginRight: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  separator: {
    backgroundColor: "#d3d3d3",
    height: 1,
    width: "90%",
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    paddingLeft: 5,
  },
});

export default UserList;
