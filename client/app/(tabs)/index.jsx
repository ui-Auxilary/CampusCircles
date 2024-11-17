/*
NOTES
- have to complete accepting and rejecting notifications
- have to test functionality with data
*/

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
import { Link, useLocalSearchParams, router } from "expo-router";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { getUserData } from "@/hooks/userContext";

import tick from "../../assets/images/tick.png";
import cross from "../../assets/images/cross.png";
import { useFocusEffect } from "@react-navigation/native";

const HomeTab = () => {
  const { setUserId } = getUserData();
  const params = useLocalSearchParams();
  const [notifications, setNotifications] = useState([]);
  const [events, setEvents] = useState({ created: [], attending: [] });

  useFocusEffect(
    useCallback(() => {
      if (params.id) {
        console.log("Home ID", params);
        setUserId(params.id);
        fetchUserNotifications(params.id);
        fetchUserEvents(params.id);
      }
    }, [params.id])
  );

  const fetchUserNotifications = async (userId) => {
    try {
      const notifs = await axios
        .get(`${BASE_URL}/users/${userId}/notifications`)
        .catch((e) => console.log(e));
      setNotifications(notifs.data.data);
    } catch (e) {
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
      console.log("Error fetching events:", e);
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
    flex: 1,
    color: "#FFFFFF",
    backgroundColor: "#421f1f86",
    width: "100%",
    position: "absolute",
    bottom: 0,
    height: 50,
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
