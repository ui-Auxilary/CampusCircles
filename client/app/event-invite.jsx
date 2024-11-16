import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { BASE_URL } from "@/constants/api";
import axios from "axios";
import { Link } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { getUserData } from "@/hooks/userContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const placeholder = [
  {
    id: "1",
    name: "Ian Jacobs",
    year: "5th year",
    field: "Business",
    photo: "https://www.openday.unsw.edu.au/share.jpg",
    attending: true,
  },
  {
    id: "2",
    name: "Richard Buckland",
    year: "4th year",
    field: "Computer Science",
    photo: "https://www.openday.unsw.edu.au/share.jpg",
    attending: true,
  },
  {
    id: "3",
    name: "Nadine Marcus",
    year: "3rd year",
    field: "Computer Science",
    photo: "https://www.openday.unsw.edu.au/share.jpg",
    attending: false,
  },
  {
    id: "4",
    name: "Nadine Marcus",
    year: "3rd year",
    field: "Computer Science",
    photo: "https://www.openday.unsw.edu.au/share.jpg",
    attending: false,
  },
  {
    id: "5",
    name: "Nadine Marcus",
    year: "3rd year",
    field: "Computer Science",
    photo: "https://www.openday.unsw.edu.au/share.jpg",
  },
  {
    id: "6",
    name: "Nadine Marcus",
    year: "3rd year",
    field: "Computer Science",
    photo: "https://www.openday.unsw.edu.au/share.jpg",
    attending: false,
  },
];

const EventInvite = () => {
  const navigation = useNavigation();
  const {
    // title,
    date,
    name,
    time,
    location,
    description,
    lat,
    long,
    photo,
    attendees,
    creatorId,
    id,
  } = useLocalSearchParams();

  const [eventData, setEventData] = useState({
    // title,
    date,
    name,
    time,
    location,
    description,
    lat,
    long,
    photo,
    attendees,
    creatorId,
  });

  useEffect(() => {
    console.log("Got id fetching event", id);

    if (id) {
      axios
        .get(`${BASE_URL}/events/get/${id}`)
        .then(({ data }) => {
          console.log("EVENT DATA", data);
          setEventData(data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [id]);

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

  // check if a user has been invited
  const [invitedFriends, setInvitedFriends] = useState({});

  const toggleInvite = (id) => {
    setInvitedFriends((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.linkContainer} onPress={() => router.back()}>
        <Ionicons name={"arrow-back"} color={"#FFFFFF"} size={24} />
        <Text style={styles.backLink}>Go Back</Text>
      </TouchableOpacity>
      <Image
        source={{
          uri: eventData.photo ? eventData.photo : "https://www.openday.unsw.edu.au/share.jpg",
        }}
        style={styles.eventImage}
      />
      <Text style={styles.inviteTitle}>Invite your friends:</Text>

      {/* search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchText}
          value={search}
          placeholder="Search for friends"
          onChangeText={setSearch}
        />
      </View>
      <ScrollView>
        {filteredFriends.map((friend) => (
          <TouchableOpacity key={friend.id} style={styles.friendCard}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: friend.photo || "https://www.gravatar.com/avatar/?d=identicon",
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{friend.name}</Text>
              <View style={styles.separator} />
              <Text style={styles.info}>{`${friend.studyYear || "Unknown Year"} | ${
                friend.degree || "Unknown Degree"
              }`}</Text>
            </View>
            {/* show icon depending on if a user is attending and if has been invited */}
            {friend.attending ? (
              // if already attending
              <Image
                source={require("../assets/images/attending.png")}
                style={styles.attendingIcon}
              />
            ) : invitedFriends[friend.id] ? (
              // if invited by user
              <TouchableOpacity onPress={() => toggleInvite(friend.id)} style={styles.addButton}>
                <Ionicons name="remove-circle-outline" size={30} color="#FF3B30" />
              </TouchableOpacity>
            ) : (
              // if neither
              <TouchableOpacity onPress={() => toggleInvite(friend.id)} style={styles.addButton}>
                <Ionicons name="add-circle-outline" size={30} color="#116DFF" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default EventInvite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    paddingBottom: 37,
  },
  eventImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  linkContainer: {
    position: "absolute",
    top: 50,
    left: 15,
    zIndex: 2,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    backgroundColor: "#33151571",
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  backLink: {
    color: "#FFFFFF",
    fontFamily: "Lexend_500Medium",
  },
  inviteTitle: {
    fontSize: 20,
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 15,
    fontFamily: "Lexend_700Bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9e9e9",
    borderRadius: 15,
    marginBottom: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: {
    marginRight: 10,
  },
  searchText: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
  },
  friendList: {
    paddingHorizontal: 20,
  },
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    justifyContent: "space-between",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    fontFamily: "Lexend_700Bold",
    marginBottom: 4,
  },
  separator: {
    backgroundColor: "#d3d3d3",
    height: 1,
    width: "90%",
    marginBottom: 4,
  },
  info: {
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
    color: "#666",
  },
  details: {
    flex: 1,
  },
  addButton: {
    padding: 10,
  },
  attendingIcon: {
    width: 27,
    height: 27,
    marginRight: 12,
  },
  noFriends: {
    textAlign: "center",
    fontSize: 15,
    marginTop: 18,
    fontFamily: "Lexend_400Regular",
  },
});
