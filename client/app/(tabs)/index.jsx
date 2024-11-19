import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Link,
  useLocalSearchParams,
  router,
  useFocusEffect,
} from "expo-router";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { getUserData } from "@/hooks/userContext";

import * as Haptics from "expo-haptics";

import { Ionicons } from "@expo/vector-icons";

const HomeTab = () => {
  const { setUserId, hasHaptic } = getUserData();
  const params = useLocalSearchParams();
  const [notifications, setNotifications] = useState([]);
  const [events, setEvents] = useState([]);
  const [expandedNotifications, setExpandedNotifications] = useState({}); // Track expanded state for all notifications
  const [username, setUsername] = useState("");
  const { userId } = getUserData();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (userId) {
      // Fetch request
      axios
        .get(`${BASE_URL}/users/${userId}`)
        .then(({ data }) => {
          setUserData(data.data);
        })
        .catch((e) => console.log(e));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        console.log("Home ID", params);
        setUsername(params.name);
        fetchUserNotifications(userId);
        fetchUserEvents(userId);
      }
    }, [userId, params.name])
  );

  const fetchUserNotifications = async (userId) => {
    try {
      const notifs = await axios
        .get(`${BASE_URL}/users/${userId}/notifications`)
        .catch((e) => console.log(e));

      console.log("NOTIFS", notifs.data.data);
      setNotifications(notifs.data.data);
    } catch (e) {
      {
        hasHaptic &&
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      console.log("Error fetching notifications:", e);
      Alert.alert("Error", "Could not fetch notifications");
    }
  };

  const fetchUserEvents = async (userId) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/users/${userId}/events`);
      console.log("Fetched Events:", data.data);
      setEvents(data.data || []);
    } catch (e) {
      hasHaptic &&
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.log("Error fetching events:", e);
      Alert.alert("Error", "Could not fetch events");
    }
  };

  const handleInvite = async (invitationId, status) => {
    try {
      await axios.put(`${BASE_URL}/invitations/update-status`, {
        invitationId,
        status,
      });
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif?.id !== invitationId)
      );
      hasHaptic &&
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (status === "accepted") {
        await fetchUserEvents(userId);
     }
      Alert.alert(`Success, Invitation ${status}!`);
    } catch (error) {
      {
        hasHaptic &&
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert("Error", "Could not update invitation status.");
    }
  };

  const toggleNotificationExpansion = (id) => {
    setExpandedNotifications((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={styles.homepage}>
      <View style={styles.titleContainer}>
        <Text style={[styles.text, styles.titleText]}>
          Welcome, {userData?.name}
        </Text>
      </View>

      {/* Notifications Section */}
      <View style={styles.notifications}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.notificationsList}>
          {notifications && notifications.length > 0 ? (
            <ScrollView
              contentContainerStyle={{ paddingBottom: 10, flexGrow: 1 }}
            >
              {notifications.map((notification) => {
                const isExpanded = expandedNotifications[notification?.id] || false;

                return (
                  <View key={notification?.id} style={styles.notificationItem}>
                    <View style={styles.notificationTextContainer}>
                      {/* Notification Text */}
                      <Image
                        source={{
                          uri: notification.inviter.photo || "https://www.gravatar.com/avatar/?d=identicon",
                        }}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 50,
                          marginRight: 10,
                        }}
                      />
                      <Text
                        style={styles.notificationText}
                        numberOfLines={isExpanded ? null : 1}
                        ellipsizeMode="tail"
                      >
                        {notification.inviter.name} invited you to{" "}
                        <Text style={styles.eventName}>
                          {notification.event?.name}
                        </Text>
                      </Text>
                    </View>
                    {/* Action Buttons */}
                    <View style={styles.notificationActions}>
                      {/* Dropdown Arrow */}
                      <TouchableOpacity
                        onPress={() =>
                          toggleNotificationExpansion(notification?.id)
                        } // Toggle expanded state
                        style={styles.dropdownIconContainer}
                      >
                        <Text style={styles.dropdownArrow}>
                          {isExpanded ? "▲" : "▼"}
                        </Text>
                      </TouchableOpacity>
                      <Pressable
                        onPress={() => handleInvite(notification?.id, "accepted")}
                      >
                        <Ionicons
                          name={"checkmark-circle"}
                          size={48}
                          color={"#E7E1A6"}
                        />
                      </Pressable>
                      <Pressable
                        onPress={() => handleInvite(notification?.id, "rejected")}
                      >
                        <Ionicons
                          name={"close-circle"}
                          size={48}
                          color={"#CA3E41"}
                        />
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.noNotiContainer}>
              <Text style={styles.noNotiText}>
                You don’t have any invites yet.
              </Text>
            </View>
          )}
        </View>
      </View>


      {/* Events Section */}
      <View style={styles.events}>
        <Text style={styles.sectionTitle}>Your Events</Text>
        {events && events.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.eventsList}
          >
            {events.map((event, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.eventItem}
                onPress={() => {
                  router.push({
                    pathname: "event-details",
                    params: { id: event?.id, page: "home" },
                  });
                }}
              >
                <Image
                  source={{
                    uri:
                      event?.photo || "https://www.openday.unsw.edu.au/share.jpg",
                  }}
                  style={styles.eventImage}
                />
                <Text style={styles.eventName}>{event?.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
        <View style={styles.noEventsContainer}>
            <Text style={styles.noEventsText}>
              You don’t have any events yet.{"\n"}Why not join one in the Events tab?
            </Text>
          </View>
        )}
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
  titleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  notifications: {
    flex: 3,
    gap: 15,
  },
  events: {
    flex: 4,
    gap: 15,
  },
  text: {
    color: "#454545",
    fontSize: 24,
  },
  titleText: {
    fontFamily: "Lexend_700Bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Lexend_500Medium",
    color: "#454545",
  },
  notificationsList: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },
  notificationTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  notificationText: {
    fontSize: 16,
    color: "#454545",
    flexShrink: 1,
  },
  eventName: {
    fontWeight: "bold",
    color: "#333333",
  },
  dropdownIconContainer: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownArrow: {
    fontSize: 18,
    color: "#454545",
  },
  notificationActions: {
    flexDirection: "row",
    columnGap: 10,
  },
  actionIcon: {
    width: 20,
    height: 20,
  },
  eventsList: {
    flexDirection: "row",
    gap: 15,
  },
  eventItem: {
    position: "relative",
    maxHeight: 180,
    marginRight: 15,
  },
  eventImage: {
    minWidth: 270,
    height: "100%",
    borderRadius: 10,
    marginBottom: 5,
  },
  noEventsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  noEventsText: {
    fontSize: 16,
    color: "#6B7280",
    fontFamily: "Lexend_500Medium",
    textAlign: "center",
    lineHeight: 22,
  },
  noNotiContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noNotiText: {
    fontSize: 16,
    color: "#6B7280",
    fontFamily: "Lexend_500Medium",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default HomeTab;
