import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
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

const EventDetails = () => {
  const { title, time, location, description, latitude, longitude, image, attendees } =
    useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      <Image source={image} style={styles.eventImage} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.detailsContainer}>
          <Image source={require("../assets/images/date.png")} style={styles.icon} />
          <Text style={styles.detailsText}>{time}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Image source={require("../assets/images/location.png")} style={styles.icon} />
          <Text style={styles.detailsText}>{location}</Text>
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
        }}>
        <Marker
          // change this too
          // coordinate={{ latitude: latitude, longitude: longitude }}
          coordinate={{ latitude: -33.91719, longitude: 151.233033 }}
          title={title}
          description={location}
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
});
