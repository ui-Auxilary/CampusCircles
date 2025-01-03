import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams, router } from "expo-router";
import { getUserData } from "@/hooks/userContext";
import { BASE_URL } from "@/constants/api";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useFocusEffect } from "@react-navigation/native";

const EventDetails = () => {
  const {
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
    page,
  } = useLocalSearchParams();

  const [eventData, setEventData] = useState({
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

  const { userId } = getUserData();
  const [joined, setJoined] = useState(false);

  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    if (eventData.time) {
      let tzOffset = new Date(eventData.time).getTimezoneOffset() * 60000;
      let isoTime = new Date(new Date(eventData.time) - tzOffset);

      if (!isNaN(isoTime)) {
        setFormattedDate(
          isoTime.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
          })
        );

        setFormattedTime(
          isoTime.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "UTC",
          })
        );
      }
    }
  }, [eventData.time]);

  const fetchEventData = async () => {
    try {
      if (id) {
        const response = await axios.get(`${BASE_URL}/events/get/${id}`);
        setEventData(response.data.data);
      }
    } catch (e) {
      console.error("Error fetching event data:", e);
    }
  };

  useEffect(() => {
    const fetchAttendeeDetails = async () => {
      try {
        if (
          !eventData.eventAttendees ||
          eventData.eventAttendees.length === 0
        ) {
          console.warn("No attendees to fetch.");
          setEventData((prev) => ({
            ...prev,
            attendeeDetails: [],
          }));
          return;
        }

        const attendeeDetails = await Promise.all(
          eventData.eventAttendees.map(async (userId) => {
            try {
              const response = await axios.get(
                `${BASE_URL}/users/get/${userId}`
              );
              return response.data.data;
            } catch (error) {
              console.warn(`User not found for ID: ${userId}`, error);
              return null;
            }
          })
        );

        setEventData((prev) => ({
          ...prev,
          attendeeDetails: attendeeDetails.filter(
            (attendee) => attendee !== null
          ),
        }));
      } catch (error) {
        console.error("Error fetching attendee details:", error);
      }
    };

    if (eventData.eventAttendees) {
      fetchAttendeeDetails();
    }
  }, [eventData.eventAttendees]);

  useFocusEffect(
    useCallback(() => {
      fetchEventData();
    }, [id])
  );

  useFocusEffect(
    useCallback(() => {
      const checkUserJoined = async () => {
        try {
          if (id) {
            const response = await axios.get(`${BASE_URL}/events/get/${id}`);
            const event = response.data.data;

            setJoined(event.eventAttendees?.includes(userId) ?? false);
          }
        } catch (e) {
          console.error("Error checking if user has joined event:", e);
        }
      };

      if (id && userId) {
        checkUserJoined();
      }
    }, [id, userId])
  );

  const handleJoinLeave = async () => {
    try {
      if (!joined) {
        console.log("Joining event with ID:", id);
        await axios.post(`${BASE_URL}/events/join`, {
          eventId: id,
          userId: userId,
        });
        setJoined(true);
      } else {
        console.log("Leaving event with ID:", id);
        await axios.post(`${BASE_URL}/events/leave`, {
          eventId: id,
          userId: userId,
        });
        setJoined(false);
      }
    } catch (e) {
      console.error("Error joining/leaving event:", e);
    }
    fetchEventData();
  };

  const getMarker = (category) => {
    console.log("Marker", category);
    switch (category) {
      case "Hang":
        return require("../assets/images/hang_m.png");
      case "Study":
        return require("../assets/images/study_m.png");
      case "Eat":
        return require("../assets/images/food_m.png");
      case "Other":
        return require("../assets/images/other_m.png");
      default:
        return require("../assets/images/society_m.png");
    }
  };
  return (
    <View style={styles.container}>
      <ParallaxScrollView
        headerImage={
          <Image
            source={{
              uri: eventData.photo
                ? eventData.photo
                : "https://www.openday.unsw.edu.au/share.jpg",
            }}
            style={styles.eventImage}
          />
        }
        headerBackgroundColor={""}
      >
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() =>
            page === "create" || page === "home"
              ? router.push("/(tabs)")
              : router.push("/(tabs)/events")
          }
        >
          <Ionicons name={"arrow-back"} color={"#FFFFFF"} size={24} />
          <Text style={styles.backLink}>Go Back</Text>
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <Text style={styles.title}>{eventData.name}</Text>
              {eventData.society ? (
                <Text
                  style={{
                    backgroundColor: "#76DA69",
                    padding: 2,
                    paddingHorizontal: 10,
                    borderRadius: 5,
                    top: -2,
                    color: "#FFFFFF",
                    fontFamily: "Lexend_500Medium",
                  }}
                >
                  Society
                </Text>
              ) : null}
            </View>

            {userId === eventData.creatorId && (
              <TouchableOpacity
                onPress={() =>
                  router.push({ pathname: "/event-edit", params: { id } })
                }
                style={styles.editEventButton}
              >
                <Text style={styles.editEventText}>Edit Event</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.description}>{eventData.description}</Text>
          <View style={styles.detailsContainer}>
            <Image
              source={require("../assets/images/date.png")}
              style={styles.icon}
            />
            <Text
              style={styles.detailsText}
            >{`${formattedDate} at ${formattedTime}`}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Image
              source={require("../assets/images/location.png")}
              style={styles.icon}
            />
            <Text style={styles.detailsText}>{eventData.location}</Text>
          </View>
        </View>

        {/* attendees */}
        <View style={styles.attendeesContainer}>
          <Text style={styles.attendeesTitle}>Attendees</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.attendeesList}
          >
            <TouchableOpacity
              onPress={() =>
                router.push({ pathname: "/event-invite", params: { id } })
              }
            >
              <Image
                source={require("../assets/images/invite-friend.png")}
                style={styles.attendeeImage}
              />
            </TouchableOpacity>
            {eventData.attendeeDetails?.map((attendee, index) => (
              <Image
                key={index}
                source={{
                  uri:
                    attendee.photo ||
                    "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg",
                }}
                style={styles.attendeeImage}
              />
            ))}
          </ScrollView>
        </View>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(eventData.lat) || -33.91719,
            longitude: parseFloat(eventData.long) || 151.233033,

            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421,
          }}
        >
          <Marker
            coordinate={{
              latitude: parseFloat(eventData.lat),
              longitude: parseFloat(eventData.long),
            }}
            name={eventData.name}
            description={eventData.location}
          >
            {/* have the category icons as markers */}
            <View>
              <Image
                source={
                  eventData.category
                    ? getMarker(eventData.category)
                    : require("../assets/images/other_m.png")
                }
                style={styles.customMarker}
              />
            </View>
          </Marker>
        </MapView>
      </ParallaxScrollView>
      {/* switch between join and leave button */}
      <TouchableOpacity
        style={joined ? styles.leaveButton : styles.joinButton}
        onPress={handleJoinLeave}
      >
        <Text style={joined ? styles.leaveButtonText : styles.joinButtonText}>
          {joined ? "Leave Event" : "Join now!"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EventDetails;

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
    height: 200,
    position: "sticky",
    resizeMode: "cover",
  },
  contentContainer: {
    marginTop: 35,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "Lexend_700Bold",
    color: "#2a2a2a",
    marginBottom: 8,
  },
  editEventButton: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    top: -10,
    right: -5,
  },
  editEventText: {
    color: "#4345ee",
    fontSize: 16,
    fontFamily: "Lexend_500Medium",
  },
  description: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#2a2a2a",
    marginBottom: 16,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
    marginBottom: 8,
    marginRight: 12,
  },
  detailsText: {
    fontSize: 18,
    marginLeft: 15,
    marginRight: 15,
    fontFamily: "Lexend_400Regular",
  },
  icon: {
    width: 45,
    height: 45,
  },
  map: {
    width: "100%",
    height: 200,
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  linkContainer: {
    position: "absolute",
    top: 20,
    left: 15,
    zIndex: 1000,
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
  joinButton: {
    backgroundColor: "#5A57E0",
    padding: 15,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: "70%",
    alignSelf: "center",
    bottom: 37,
  },
  joinButtonText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontFamily: "Lexend_700Bold",
  },
  leaveButton: {
    backgroundColor: "#BF5E5E",
    padding: 15,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: "70%",
    alignSelf: "center",
    bottom: 37,
  },
  leaveButtonText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontFamily: "Lexend_700Bold",
  },
  attendeesContainer: {
    marginBottom: 16,
  },
  attendeesTitle: {
    fontSize: 17,
    marginBottom: 12,
    fontFamily: "Lexend_700Bold",
    color: "#2a2a2a",
  },
  attendeesList: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  attendeeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  customMarker: {
    width: 42,
    height: 50,
  },
});
