import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import ActionSheet from "react-native-actions-sheet";
import { Link } from "expo-router";

import {
  Lexend_300Regular,
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  useFonts,
} from "@expo-google-fonts/lexend";

// placeholder data
const events = [
  {
    id: "1",
    title: "Lunch @ the Quad",
    time: "Today: 12-1pm",
    location: "Quad",
    // latitude: -33.91719,
    // longitude: 151.233033,
    image: require("../../assets/images/event-image.png"),
    icon: require("../../assets/images/food.png"),
    description: "Description!!!",
    attendees: ["001", "002"],
  },
  {
    id: "2",
    title: "Board games!",
    time: "Today: 4-5:30pm",
    location: "Village Green",
    description: "Description !!!",
    image: require("../../assets/images/event-image.png"),
    icon: require("../../assets/images/hang.png"),
    attendees: ["001", "002", "003"],
  },
  {
    id: "3",
    title: "Study session",
    time: "Today: 3-5pm",
    location: "SEB Basement",
    description: "Description !!!",
    image: require("../../assets/images/event-image.png"),
    icon: require("../../assets/images/study.png"),
    attendees: ["001", "002"],
  },
  {
    id: "4",
    title: "CSE Soc AGM",
    time: "Today: 6pm",
    location: "Ainsworth",
    description: "Description !!!",
    image: require("../../assets/images/event-image.png"),
    icon: require("../../assets/images/society.png"),
    attendees: ["001", "002", "003"],
  },
  {
    id: "5",
    title: "Other event",
    time: "Today: 8pm",
    location: "ASB",
    description: "Description !!!",
    image: require("../../assets/images/event-image.png"),
    icon: require("../../assets/images/other.png"),
    attendees: ["001", "003"],
  },
  {
    id: "6",
    title: "Other event",
    time: "Today: 8pm",
    location: "ASB",
    description: "Description !!!",
    icon: require("../../assets/images/other.png"),
    attendees: ["001", "003"],
  },
  {
    id: "7",
    title: "Other event",
    time: "Today: 8pm",
    location: "ASB",
    description: "Description !!!",
    image: require("../../assets/images/event-image.png"),
    icon: require("../../assets/images/other.png"),
    attendees: ["001", "003"],
  },
];

export default function EventTab() {
  const actionSheetRef = useRef(null);

  const collapseActionSheet = () => {
    if (actionSheetRef.current) {
      actionSheetRef.current.setModalVisible(false);
    }
  };

  const renderEventItem = ({ item }) => (
    <Link
      accessibilityLabel={`Open event details: ${item.title}`}
      href={{
        pathname: "/event-details",
        params: {
          title: item.title,
          time: item.time,
          location: item.location,
          image: item.image,
          description: item.description,
          latitude: item.latitude,
          longitude: item.longitude,
        },
      }}
      asChild
      onPress={collapseActionSheet}>
      <TouchableOpacity style={styles.eventItem}>
        <View style={styles.eventContent}>
          <Image source={item.icon} style={styles.eventIcon} />
          <View>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDetails}>{item.time}</Text>
            <Text style={styles.eventDetails}>{item.location}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          initialRegion={{
            latitude: -33.91719,
            longitude: 151.233033,
            latitudeDelta: 0.0088,
            longitudeDelta: 0.0091,
          }}
          style={styles.map}>
          <Marker
            key={1}
            coordinate={{ latitude: -33.91719, longitude: 151.233033 }}
            title={"Cool marker"}
            description={"Test marker"}
          />
        </MapView>
      </View>

      {/* placeholder button to open the action sheet */}
      <TouchableOpacity
        style={styles.openSheetButton}
        onPress={() => {
          if (actionSheetRef.current) {
            actionSheetRef.current.setModalVisible(true);
          }
        }}>
        <Text style={styles.openSheetButtonText}>Show Events</Text>
      </TouchableOpacity>

      {/* event list using the action sheet */}
      <ActionSheet ref={actionSheetRef} gestureEnabled={true}>
        <View style={[styles.sheetItems, { height: 600 }]}>
          <Text style={styles.sheetTitle}>Events</Text>
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={renderEventItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </ActionSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  openSheetButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#4285F4",
    padding: 15,
    borderRadius: 50,
  },
  openSheetButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  sheetItems: {
    padding: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  eventContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventIcon: {
    width: 40,
    height: 40,
    marginRight: 20,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Lexend_700Bold",
    color: "#4345ee",
  },
  eventDetails: {
    fontSize: 14,
    fontWeight: "semibold",
    fontFamily: "Lexend_400Regular",
    marginTop: 2,
    marginBottom: 2,
    color: "#555",
  },
});
