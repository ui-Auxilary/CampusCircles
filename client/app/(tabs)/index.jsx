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
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams, router } from "expo-router";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { getUserData } from "@/hooks/userContext";

import * as Haptics from "expo-haptics";

import tick from "../../assets/images/tick.png";
import cross from "../../assets/images/cross.png";

const HomeTab = () => {
  const { setUserId, hasHaptic } = getUserData();
  const params = useLocalSearchParams();
  const [notifications, setNotifications] = useState([]);
  const [events, setEvents] = useState({ created: [], attending: [] });
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

  const dumb = [
    {
      id: "1",
      inviter: { name: "John Doe" },
      event: { name: "Study Time" },
    },
    {
      id: "2",
      inviter: { name: "Jane Smith" },
      event: { name: "Eat Sesh" },
    },
    {
      id: "3",
      inviter: { name: "LonglonglonglonglongLonglonglonglonglong" },
      event: { name: "long long long long long long long long long long long" },
    },
    {
      id: "4",
      inviter: { name: "Short" },
      event: { name: "s" },
    },
    {
      id: "5",
      inviter: { name: "Filler" },
      event: { name: "filler" },
    },
    {
      id: "6",
      inviter: { name: "Scroll" },
      event: { name: "scroll" },
    },
  ];

  useEffect(() => {
    setNotifications(dumb);

    if (params.id) {
      console.log("Home ID", params);
      setUsername(params.name);
      setUserId(params.id);
      fetchUserNotifications(params.id);
      fetchUserEvents(params.id);
    }
  }, [params.id]);

  const fetchUserNotifications = async (userId) => {
    try {
      const notifs = await axios
        .get(`${BASE_URL}/users/${userId}/notifications`)
        .catch((e) => console.log(e));
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

  useEffect(() => {
    console.log("EVENT DATA", events);
  }, [events]);

  const fetchUserEvents = async (userId) => {
    try {
      const events = await axios
        .get(`${BASE_URL}/users/${userId}/events`)
        .then(({ data }) => {
          setEvents(data.data);
        })
        .catch((e) => console.log(e));
    } catch (e) {
      {
        hasHaptic &&
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      console.log("Error fetching events:", e);
      Alert.alert("Error", "Could not fetch events");
    }
  };

  const handleAcceptInvite = async (notificationId) => {
    try {
      await axios.put(`${BASE_URL}/invite/${notificationId}/accept`);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.id !== notificationId)
      );
      {
        hasHaptic &&
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Succeess);
      }
      Alert.alert("Success", "Invitation accepted!");
    } catch (error) {
      {
        hasHaptic &&
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      console.error("Error accepting invite:", error);
      Alert.alert("Error", "Failed to accept the invitation.");
    }
  };

  const handleRejectInvite = async (notificationId) => {
    try {
      await axios.put(`${BASE_URL}/invite/${notificationId}/reject`);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.id !== notificationId)
      );
      {
        hasHaptic &&
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Succeess);
      }
      Alert.alert("Success", "Invitation rejected!");
    } catch (error) {
      {
        hasHaptic &&
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      console.error("Error rejecting invite:", error);
      Alert.alert("Error", "Failed to reject the invitation.");
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
          Welcome, {userData.name}
        </Text>
      </View>

      {/* Notifications Section */}
      <View style={styles.notifications}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <ScrollView
          style={styles.notificationsList}
          contentContainerStyle={{ paddingBottom: 10, flexGrow: 1 }}
        >
          {notifications.map((notification) => {
            const isExpanded = expandedNotifications[notification.id] || false;

            return (
              <View key={notification.id} style={styles.notificationItem}>
                <View style={styles.notificationTextContainer}>
                  {/* Notification Text */}
                  <Text
                    style={styles.notificationText}
                    numberOfLines={isExpanded ? null : 1} // Expand if isExpanded is true
                    ellipsizeMode='tail'
                  >
                    {notification.inviter.name} invited you to{" "}
                    <Text style={styles.eventName}>
                      {notification.event.name}
                    </Text>
                  </Text>
                </View>
                {/* Action Buttons */}
                <View style={styles.notificationActions}>
                  {/* Dropdown Arrow */}
                  <TouchableOpacity
                    onPress={() => toggleNotificationExpansion(notification.id)} // Toggle expanded state
                    style={styles.dropdownIconContainer}
                  >
                    <Text style={styles.dropdownArrow}>
                      {isExpanded ? "▲" : "▼"} {/* Change arrow direction */}
                    </Text>
                  </TouchableOpacity>
                  <Pressable
                    onPress={() => handleAcceptInvite(notification.id)}
                  >
                    <Image source={tick} style={styles.actionIcon} />
                  </Pressable>
                  <Pressable
                    onPress={() => handleRejectInvite(notification.id)}
                  >
                    <Image source={cross} style={styles.actionIcon} />
                  </Pressable>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Events Section */}
      <View style={styles.events}>
        <Text style={styles.sectionTitle}>Your Events</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.eventsList}
        >
          {[...events.created, ...events.attending].map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventItem}
              onPress={() => {
                router.push({
                  pathname: "event-details",
                  params: { id: event.id },
                });
              }}
            >
              <Image
                source={{
                  uri:
                    event.photo || "https://www.openday.unsw.edu.au/share.jpg",
                }}
                style={styles.eventImage}
              />
              <Text style={styles.eventName}>{event.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    fontSize: 25,
  },
  titleText: {
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#454545",
  },
  notificationsList: {
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
});

export default HomeTab;
