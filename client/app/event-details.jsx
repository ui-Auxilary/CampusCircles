import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";

import {
  Lexend_300Regular,
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  useFonts,
} from "@expo-google-fonts/lexend";
import { BASE_URL } from "@/constants/api";
import axios from "axios";
import { Link } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const EventDetails = () => {
  const {
    title,
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
    title,
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

    axios
      .get(`${BASE_URL}/events/get/${id}`)
      .then(({ data }) => {
        console.log("EVENT DATA", data);
        setEventData(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [id]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.linkContainer}>
        <Ionicons name={"arrow-back"} color={"#FFFFFF"} size={24} />
        <Link to='/(tabs)' style={styles.backLink}>
          Go home
        </Link>
      </TouchableOpacity>
      <Image
        source={{
          uri: eventData.photo
            ? eventData.photo
            : "https://www.openday.unsw.edu.au/share.jpg",
        }}
        style={styles.eventImage}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{eventData.title}</Text>
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
          title={eventData.title}
          description={eventData.location}
        />
      </MapView>
    </ScrollView>
  );
};

export default EventDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  eventImage: {
    width: "100%",
    height: 230,
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "Lexend_700Bold",
    color: "#2a2a2a",
    marginBottom: 10,
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
    marginBottom: 15,
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
    top: 15,
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
});
