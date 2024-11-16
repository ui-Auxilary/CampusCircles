import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import ActionSheet from "react-native-actions-sheet";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

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

const categories = ["All Categories", "Hang", "Study", "Eat", "Society", "Other"];
const timeOptions = ["Anytime", "Morning", "Midday", "Afternoon", "Night"];

// placeholder data
const events2 = [
  {
    id: "1",
    name: "Lunch @ the Quad",
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
    name: "Board games!",
    time: "Today: 4-5:30pm",
    location: "Village Green",
    description: "Description !!!",
    image: require("../../assets/images/event-image.png"),
    icon: require("../../assets/images/hang.png"),
    attendees: ["001", "002", "003"],
  },
  {
    id: "3",
    name: "Study session",
    time: "Today: 3-5pm",
    location: "SEB Basement",
    description:
      "Description !!! wowowowo w oweiriowe ioweriwoer ow ieriwo rweio rwioruwiru wiro weioru wioru woeiru weioruweioru wiorthdfsiogh sdfgihfds ihgdsiogh sdiofgh iosdfgh ",
    image: require("../../assets/images/event-image.png"),
    icon: require("../../assets/images/study.png"),
    attendees: ["001", "002"],
  },
  {
    id: "4",
    name: "CSE Soc AGM",
    time: "Today: 6pm",
    location: "Ainsworth",
    description: "Description !!!",
    image: require("../../assets/images/event-image.png"),
    icon: require("../../assets/images/society.png"),
    attendees: ["001", "002", "003"],
  },
  {
    id: "5",
    name: "Other event",
    time: "Today: 8pm",
    location: "ASB",
    description: "Description !!!",
    image: require("../../assets/images/event-image.png"),
    icon: require("../../assets/images/other.png"),
    attendees: ["001", "003"],
  },
  {
    id: "6",
    name: "Other event",
    time: "Today: 8pm",
    location: "ASB",
    description: "Description !!!",
    icon: require("../../assets/images/other.png"),
    attendees: ["001", "003"],
  },
  {
    id: "7",
    name: "Other event",
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
  const [searchText, setSearchText] = useState("");
  const [events, setEvents] = useState([]);

  const [selectedTime, setSelectedTime] = useState("Anytime");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [TimePickerVisibility, setTimePickerVisibility] = useState(false);

  const [icon, setIcon] = useState(require("../../assets/images/food.png"));

  const collapseActionSheet = () => {
    if (actionSheetRef.current) {
      actionSheetRef.current.setModalVisible(false);
    }
  };

  const getIcon = (category) => {
    switch (category) {
      case "Hang":
        return require("../../assets/images/hang.png");
      case "Study":
        return require("../../assets/images/study.png");
      case "Eat":
        return require("../../assets/images/food.png");
      default:
        return require("../../assets/images/other.png");
    }
  };

  useEffect(() => {
    // Fetch events once
    console.log("Fetching events today");
    axios
      .get(`${BASE_URL}/events/get/today`)
      .then(({ data }) => {
        setEvents(data.data);
      })
      .catch((e) => console.log(e));
  }, []);

  const openTimePicker = () => setTimePickerVisibility(true);
  const closeTimePicker = () => setTimePickerVisibility(false);

  const renderEventItem = ({ item }) => (
    <Link
      accessibilityLabel={`Open event details: ${item.name}`}
      href={{
        pathname: "/event-details",
        params: {
          name: item.name,
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
          <Image
            source={
              item.category ? getIcon(item.category) : require("../../assets/images/hang.png")
            }
            style={styles.eventIcon}
          />
          <View>
            <Text style={styles.eventTitle}>{item.name}</Text>
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
            name={"Cool marker"}
            description={"Test marker"}
          />
        </MapView>
      </View>

      {/* searchbar */}
      <View style={styles.searchbarContainer}>
        <TextInput
          style={styles.searchbar}
          placeholder="Search events"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity style={styles.filterIcon}>
          <Ionicons name="filter-circle-outline" size={30} color="#4285F4" />
        </TouchableOpacity>
      </View>

      {/* quick filters */}
      <ScrollView horizontal={true} style={styles.filterContainer}>
        {/* Time filter */}
        <TouchableOpacity
          style={[styles.quickFilterButtons, styles.selectedFilter]}
          onPress={openTimePicker}>
          <Text style={[styles.filterText, styles.selectedFilterText]}>{selectedTime}</Text>
        </TouchableOpacity>

        {/* category filters */}
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.quickFilterButtons,
              selectedCategory === category ? styles.selectedFilter : null,
            ]}
            onPress={() => setSelectedCategory(category)}>
            <Text
              style={[
                styles.filterText,
                selectedCategory === category ? styles.selectedFilterText : null,
              ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}

        {/* time options */}
        <Modal
          transparent={true}
          visible={TimePickerVisibility}
          animationType="slide"
          onRequestClose={closeTimePicker}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Time Period</Text>
              {timeOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.modalOption, option === selectedTime && styles.selectedFilter]}
                  onPress={() => {
                    setSelectedTime(option);
                    closeTimePicker();
                  }}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      option === selectedTime && styles.selectedFilterText,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </ScrollView>

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
  searchbarContainer: {
    position: "absolute",
    top: 22,
    left: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 20,
    paddingHorizontal: 13,
    paddingVertical: 3,
    backgroundColor: "white",
    borderRadius: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  searchbar: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#000",
  },
  filterIcon: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  filterContainer: {
    position: "absolute",
    top: 62,
    left: 20,
    right: 20,
    flexDirection: "row",
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingLeft: 7,
  },
  quickFilterButtons: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: "white",
  },
  filterText: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "#555",
  },
  selectedFilter: {
    backgroundColor: "#4285F4",
  },
  selectedFilterText: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Lexend_700Bold",
    marginBottom: 13,
  },
  modalOption: {
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 8,
  },
  modalOptionText: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
  },
});
