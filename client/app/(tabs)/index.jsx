import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams, router } from "expo-router";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { getUserData } from "@/hooks/userContext";

import tick from "../../assets/images/tick.png";
import cross from "../../assets/images/cross.png";

const HomeTab = () => {
  const { setUserId } = getUserData();
  const params = useLocalSearchParams();
  const [notifications, setNotifications] = useState([]);
  const [events, setEvents] = useState({ created: [], attending: [] });

  useEffect(() => {
    if (params.id) {
      console.log("Home ID", params);
      setUserId(params.id);
      fetchUserNotifications(params.id);
      fetchUserEvents(params.id);
    }
  }, [params.id]);

  const fetchUserNotifications = async (userId) => {
    try {
      const notifs = await axios.get(
        `${BASE_URL}/users/${userId}/notifications`
      );
      setNotifications(notifs.data.data);
    } catch (e) {
      console.error("Error fetching notifications:", error);
      Alert.alert("Error", "Could not fetch notifications");
    }
  };

  const fetchUserEvents = async (userId) => {
    try {
      const events = await axios.get(`${BASE_URL}/users/${userId}/events`);
      setEvents(events.data.data);
    } catch (e) {
      console.error("Error fetching events:", error);
      Alert.alert("Error", "Could not fetch events");
    }
  };

  // TODO FINISH OFF THIS SHIT

  const handleAcceptInvite = (notificationId) => {
    console.log("Accept invite for notification:", notificationId);
  };

  const handleRejectInvite = (notificationId) => {
    console.log("Reject invite for notification:", notificationId);
  };

  return (
    <View style={styles.homepage}>
      <View style={styles.titleContainer}>
        <Text style={[styles.text, styles.titleText]}>Welcome, USER</Text>
      </View>

      {/* Notifications Section */}
      <View style={styles.notifications}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <ScrollView style={styles.notificationsList}>
          {notifications.map((notification) => (
            <View key={notification.id} style={styles.notificationItem}>
              <Text style={styles.notificationText}>
                {notification.inviter.name} invited you to{" "}
                <Text style={styles.eventName}>{notification.event.name}</Text>
              </Text>
              <View style={styles.notificationActions}>
                <Pressable onPress={() => handleAcceptInvite(notification.id)}>
                  <Image source={tick} style={styles.actionIcon} />
                </Pressable>
                <Pressable onPress={() => handleRejectInvite(notification.id)}>
                  <Image source={cross} style={styles.actionIcon} />
                </Pressable>
              </View>
            </View>
          ))}
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
            <View key={event.id} style={styles.eventItem}>
              <Image
                source={{ uri: event.photo || sampleEventImage }}
                style={styles.eventImage}
              />
              <Text style={styles.eventName}>{event.name}</Text>
            </View>
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
    marginVertical: 10,
    rowGap: 15,
  },
  events: {
    flex: 4,
    marginVertical: 10,
    rowGap: 15,
  },
  text: {
    paddingLeft: 7.5,
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
    marginBottom: 5,
  },
  notificationsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },
  notificationText: {
    fontSize: 16,
    color: "#454545",
  },
  eventName: {
    fontWeight: "bold",
    color: "#333333",
  },
  notificationActions: {
    flexDirection: "row",
    columnGap: 10,
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: "#454545",
  },
  eventsList: {
    flexDirection: "row",
  },
  eventItem: {
    marginRight: 15,
    alignItems: "center",
  },
  eventImage: {
    width: 120,
    height: 80,
    borderRadius: 10,
    marginBottom: 5,
  },
});

export default HomeTab;
