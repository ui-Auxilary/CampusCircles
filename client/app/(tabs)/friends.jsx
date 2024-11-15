import React, { useState, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";

const FriendsList = () => {
  const { userId } = getUserData();
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchFriends = async () => {
        try {
          const url = `${BASE_URL}/users/${userId}/friends`;
          console.log("Fetching friends from:", url);
          const response = await axios.get(url);
          setFriends(response.data.data);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      };

      if (userId) {
        fetchFriends();
      }
    }, [userId])
  );

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(search.toLowerCase())
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
        {filteredFriends.map((friend) => (
          <TouchableOpacity key={friend.id} style={styles.friendCard}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  // uri: friend.photo
                  //     ? friend.photo
                  //     : 'https://www.gravatar.com/avatar/?d=identicon',
                  uri: "https://www.gravatar.com/avatar/?d=identicon",
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{friend.name}</Text>
              <View style={styles.separator} />
              <Text style={styles.info}>{`${
                friend.studyYear || "Unknown Year"
              } | ${friend.degree || "Unknown Degree"}`}</Text>
            </View>
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
});

export default FriendsList;
