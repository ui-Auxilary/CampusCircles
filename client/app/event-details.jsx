import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams, router } from "expo-router";
import { BASE_URL } from "@/constants/api";
import axios from "axios";
import { Link } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ParallaxScrollView from "@/components/ParallaxScrollView";

const EventDetails = () => {
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
    page,
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

  const [joined, setJoined] = useState(false);

  const setJoinLeave = () => {
    setJoined(!joined);
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
            page === "create"
              ? router.push("/(tabs)")
              : router.push("/(tabs)/events")
          }
        >
          <Ionicons name={"arrow-back"} color={"#FFFFFF"} size={24} />
          <Text style={styles.backLink}>Go Back</Text>
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{eventData.name}</Text>

            <TouchableOpacity
              onPress={() =>
                router.push({ pathname: "/event-edit", params: { id } })
              }
              style={styles.editEventButton}
            >
              <Text style={styles.editEventText}>Edit Event</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>{eventData.description}</Text>
          <View style={styles.detailsContainer}>
            <Image
              source={require("../assets/images/date.png")}
              style={styles.icon}
            />
            <Text style={styles.detailsText}>{eventData.time}</Text>
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
          <View style={styles.attendeesList}>
            {/* invite friend icon */}

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

            {eventData.attendees?.map((attendee, index) => (
              <Image
                key={index}
                // not sure if it's .user.photo
                source={{ uri: attendee.user.photo }}
                style={styles.attendeeImage}
              />
            ))}
          </View>
        </View>

        <MapView
          style={styles.map}
          initialRegion={{
            // change this
            // latitude: latitude,
            // longitude: longitude,
            latitude: -33.91719,
            longitude: 151.233033,

            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421,
          }}
        >
          <Marker
            // change this too
            // coordinate={{ latitude: latitude, longitude: longitude }}
            coordinate={{ latitude: -33.91719, longitude: 151.233033 }}
            name={eventData.name}
            description={eventData.location}
          />
        </MapView>
      </ParallaxScrollView>
      {/* switch between join and leave button */}
      <TouchableOpacity
        style={joined ? styles.leaveButton : styles.joinButton}
        onPress={setJoinLeave}
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
    height: 230,
    position: "sticky",
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 20,
    paddingVertical: 40,
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
    marginBottom: 10,
  },
  editEventButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
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
    paddingVertical: 5,
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 18,
    marginLeft: 15,
    fontFamily: "Lexend_400Regular",
  },
  icon: {
    width: 45,
    height: 45,
  },
  map: {
    width: "90%",
    height: 200,
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  linkContainer: {
    position: "absolute",
    top: 20,
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
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  attendeesTitle: {
    fontSize: 20,
    marginBottom: 12,
    fontFamily: "Lexend_700Bold",
    color: "#2a2a2a",
  },
  attendeeImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
});
