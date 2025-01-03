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
import * as Haptics from "expo-haptics";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

const UserList = () => {
  const { userId, hasHaptic } = getUserData();
  const [search, setSearch] = useState("");
  const [nonFriends, setNonFriends] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();

  const { selectedYear, selectedLanguage, course, interest } =
    route.params || {};

  const handleNavigateToProfile = (friendId) => {
    navigation.navigate("otherProfile", { userId: friendId, key: friendId });
  };

  useFocusEffect(
    useCallback(() => {
      const fetchNonFriends = async () => {
        try {
          const url = `${BASE_URL}/users/non-friends/${userId}`;
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
      const url = `${BASE_URL}/users/add-friend/${userId}`;
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

  // Filter users
  const filteredUsers = nonFriends.filter((user) => {
    const userMatch = user.name.toLowerCase().includes(search.toLowerCase());
    const courseMatch = course
      ? user.courses?.toLowerCase().includes(course.toLowerCase())
      : true;
    const interestMatch = interest
      ? user.interests?.toLowerCase().includes(interest.toLowerCase())
      : true;

    return (
      userMatch &&
      (!selectedYear || user.studyYear === selectedYear) &&
      (!selectedLanguage || user.languages?.includes(selectedLanguage)) &&
      courseMatch &&
      interestMatch
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("friends")}
          style={styles.backButtonContainer}
        >
          <Ionicons name='arrow-back' size={24} color='black' />
          <Text style={styles.backButton}> Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchBarContainer}>
          <Ionicons
            name='search'
            size={20}
            color='#888'
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchBar}
            placeholder='Search users by name...'
            placeholderTextColor='#888'
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => navigation.navigate("friendFilter")}
        >
          <Ionicons name='funnel-outline' size={20} color='#fff' />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Users Count */}
      <Text style={styles.userCount}>Other Users ({filteredUsers.length})</Text>

      <ScrollView>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={styles.friendCard}
              onPress={() => handleNavigateToProfile(user.id)}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: user.photo
                      ? user.photo
                      : "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg",
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
                onPress={() => handleAddFriend(user.id)}
              >
                <Ionicons name='person-add' size={24} color='#3b82f6' />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              Oh no! There are no results matching your filter :(
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    fontSize: 16,
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchBarContainer: {
    flex: 4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: "#000",
  },
  filterButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  filterText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 2,
  },
  userCount: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    marginLeft: 15,
    color: "#333",
    fontFamily: "Lexend_700Bold",
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
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noResultsText: {
    paddingTop: 50,
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
    color: "#555",
    marginBottom: 15,
  },
  returnButton: {
    marginTop: 20,
    backgroundColor: "#4285F4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});

export default UserList;
