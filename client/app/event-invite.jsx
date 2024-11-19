import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { BASE_URL } from "@/constants/api";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { getUserData } from "@/hooks/userContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const EventInvite = () => {
  const navigation = useNavigation();
  const { userId } = getUserData();
  const { id } = useLocalSearchParams();

  const [eventData, setEventData] = useState({});
  const [friends, setFriends] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (id) {
      axios
        .get(`${BASE_URL}/events/event/${id}`)
        .then(({ data }) => setEventData(data.data))
        .catch((error) => console.error("Error fetching event data:", error));
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      const fetchFriends = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/users/friends/${userId}`
          );
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

  useFocusEffect(
    useCallback(() => {
      const fetchInvitations = async () => {
        try {
          console.log(
            "Fetching invitations from URL:",
            `${BASE_URL}/invitations/event/${id}`
          );
          const response = await axios.get(
            `${BASE_URL}/invitations/event/${id}`
          );
          console.log("Fetched Invitations:", response.data);
          setInvitations(response.data.data);
        } catch (error) {
          console.error("Error fetching invitations:", error);
        }
      };

      if (id) {
        fetchInvitations();
      }
    }, [id])
  );

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleInvite = async (friendId) => {
    try {
      const invitation = invitations.find((inv) => inv.inviteeId === friendId);

      if (!invitation) {
        // Send invitation
        const response = await axios.post(`${BASE_URL}/invitations/send`, {
          eventId: id,
          inviteeId: friendId,
          inviterId: userId,
        });
        if (response.data.status) {
          setInvitations((prev) => [...prev, response.data.data]);
        }
      } else {
        // Unsend invitation
        await axios.post(`${BASE_URL}/invitations/unsend`, {
          invitationId: invitation.id,
        });
        setInvitations((prev) =>
          prev.filter((inv) => inv.id !== invitation.id)
        );
      }
    } catch (error) {
      Alert.alert(
        "This user has already been invited to this event by another user"
      );
    }
  };

  const getFriendStatus = (friendId) => {
    if (eventData.eventAttendees?.includes(friendId)) {
      console.log(`Friend ID: ${friendId}, Status: accepted`);
      return "accepted";
    }

    const invitation = invitations.find((inv) => inv.inviteeId === friendId);

    if (invitation) {
      console.log(`Friend ID: ${friendId}, Status: ${invitation.status}`);
      return invitation.status;
    }

    console.log(`Friend ID: ${friendId}, Status: Not Invited`);
    return "Not Invited";
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.linkContainer}
        onPress={() => router.back()}
      >
        <Ionicons name={"arrow-back"} color={"#FFFFFF"} size={24} />
        <Text style={styles.backLink}>Go Back</Text>
      </TouchableOpacity>
      <Image
        source={{
          uri: eventData.photo || "https://www.openday.unsw.edu.au/share.jpg",
        }}
        style={styles.eventImage}
      />
      <Text style={styles.inviteTitle}>Invite your friends:</Text>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name='search'
          size={20}
          color='#888'
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchText}
          value={search}
          placeholder='Search for friends'
          onChangeText={setSearch}
        />
      </View>
      <ScrollView>
        {filteredFriends.map((friend) => {
          const status = getFriendStatus(friend.id);
          console.log(
            `Friend ID: ${friend.id}, Name: ${friend.name}, Status: ${status}`
          );
          return (
            <TouchableOpacity key={friend.id} style={styles.friendCard}>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri:
                      friend.photo ||
                      "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg",
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
              {status === "accepted" ? (
                <Image
                  source={require("../assets/images/attending.png")}
                  style={styles.attendingIcon}
                />
              ) : status === "rejected" ? (
                <Image
                  source={require("../assets/images/rejected.png")}
                  style={styles.PendingIcon}
                />
              ) : status === "pending" ? (
<<<<<<< HEAD
                <TouchableOpacity
                  onPress={() => toggleInvite(friend.id)}
                  style={styles.addButton}
                >
                  <Ionicons
                    name='remove-circle-outline'
                    size={30}
                    color='#FF3B30'
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => toggleInvite(friend.id)}
                  style={styles.addButton}
                >
                  <Ionicons
                    name='add-circle-outline'
                    size={30}
                    color='#116DFF'
                  />
=======
                <TouchableOpacity onPress={() => toggleInvite(friend.id)} style={styles.addButton}>
                  <Ionicons name="remove-circle-outline" size={40} color="#FF3B40" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => toggleInvite(friend.id)} style={styles.addButton}>
                  <Ionicons name="add-circle-outline" size={40} color="#116DFF" />
>>>>>>> 05cff5e5a1972761b40bcada01e7f0edc042a86a
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}
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
    width: 37,
    height: 37,
    marginRight: 12,
  },
  PendingIcon: {
    width: 45,
    height: 45,
    marginRight: 8,
  },
});
