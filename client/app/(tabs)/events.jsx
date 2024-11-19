import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import ActionSheet from "react-native-actions-sheet";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { BASE_URL } from "@/constants/api";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";

const categories = [
  "All Categories",
  "Hang",
  "Study",
  "Eat",
  "Society",
  "Other",
];
const timeOptions = ["Anytime", "Morning", "Midday", "Afternoon", "Night"];

export default function EventTab() {
  const actionSheetRef = useRef(null);
  const route = useRoute();
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedTime, setSelectedTime] = useState("Anytime");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [TimePickerVisibility, setTimePickerVisibility] = useState(false);
  const [textFilter, setTextFilter] = useState({});
  const [fetchToday, setFetchToday] = useState(route.params ? false : true);

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
      case "Other":
        return require("../../assets/images/other_m.png");
      default:
        return require("../../assets/images/other.png");
    }
  };

  const getMarker = (category) => {
    switch (category) {
      case "Hang":
        return require("../../assets/images/hang_m.png");
      case "Study":
        return require("../../assets/images/study_m.png");
      case "Eat":
        return require("../../assets/images/food_m.png");
      case "Other":
        return require("../../assets/images/other_m.png");
      default:
        return require("../../assets/images/society_m.png");
    }
  };

  let { filters } = route.params || {};

  if (filters && filters.selectedDate) {
    filters = {
      ...filters,
      selectedDate: new Date(filters.selectedDate),
    };
  }

  const handleSearchFilter = (text) => {
    setSearchText(text);
    if (text) {
      setTextFilter({ text });
    } else {
      setTextFilter(fetchToday ? { selectedDate: new Date(Date.now()) } : null);
    }
  };

  useEffect(() => {
    if (route.params?.openEventsList && actionSheetRef.current) {
      actionSheetRef.current.setModalVisible(true);
    }
  }, [route.params]);

  const filterEvents = (events, filters) => {
    return events.filter((event) => {
      // Convert event date and filter date to UTC, and extract the date part only
      const eventDateString = event.date
        ? new Date(event.date).toISOString().substring(0, 10)
        : null;
      const filterDateString = filters.selectedDate
        ? new Date(filters.selectedDate).toISOString().substring(0, 10)
        : null;

      const categoryMatch =
        !filters.selectedCategory ||
        filters.selectedCategory === "All Categories"
          ? true
          : event.category === filters.selectedCategory;

      let timeCategory = "";
      if (event.time) {
        const eventDate = new Date(event.time);

        const hours = eventDate.getUTCHours();
        if (hours >= 6 && hours < 12) {
          timeCategory = "Morning";
        } else if (hours >= 12 && hours < 14) {
          timeCategory = "Midday";
        } else if (hours >= 14 && hours < 18) {
          timeCategory = "Afternoon";
        } else if (hours >= 18 || hours < 6) {
          timeCategory = "Night";
        }
      }

      const textMatch =
        !filters.text || (event.name && event.name.includes(filters.text));

      const timeMatch =
        !filters.selectedTime || filters.selectedTime === "Anytime"
          ? true
          : filters.selectedTime === timeCategory;

      const dateMatch =
        !filterDateString || eventDateString === filterDateString;

      return categoryMatch && timeMatch && dateMatch && textMatch;
    });
  };

  useFocusEffect(
    useCallback(() => {
      const fetchEvents = async () => {
        try {
          const { data } = await axios.get(
            `${BASE_URL}/events/get/${
              fetchToday || !filters ? "today" : "upcoming"
            }`
          );
          let fetchedEvents = data.data;
          // Apply filters if any
          if (filters || textFilter) {
            fetchedEvents = filterEvents(fetchedEvents, {
              ...filters,
              ...textFilter,
            });
          } else {
            setFetchToday(true);
          }

          setEvents([...fetchedEvents]);
        } catch (e) {
          console.log("Error fetching events:", e);
        }
      };

      fetchEvents();
    }, [filters, textFilter])
  );

  const openTimePicker = () => setTimePickerVisibility(true);
  const closeTimePicker = () => setTimePickerVisibility(false);

  const formatDate = (date) => {
    if (date) {
      let [strDate, time] = date.split("T");
      time = time.split(".")[0];

      return [strDate, " ", time];
    }
    return;
  };

  const renderEventItem = ({ item }) => (
    <Link
      accessibilityLabel={`Open event details: ${item.name}`}
      href={{
        pathname: "/event-details",
        params: {
          id: item.id,
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
      onPress={collapseActionSheet}
    >
      <TouchableOpacity style={styles.eventItem}>
        <View style={styles.eventContent}>
          <Image
            source={
              item.category
                ? getIcon(item.category)
                : require("../../assets/images/hang.png")
            }
            style={styles.eventIcon}
          />
          <View>
            <Text style={styles.eventTitle}>{item.name}</Text>
            <Text style={styles.eventDetails}>{formatDate(item.time)}</Text>
            <Text style={styles.eventDetails}>{item.location}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      {/* Map Container */}
      <View style={styles.mapContainer}>
        <MapView
          key={events.length}
          initialRegion={{
            latitude: -33.91719,
            longitude: 151.233033,
            latitudeDelta: 0.0088,
            longitudeDelta: 0.0091,
          }}
          style={styles.map}
        >
          {events.map(({ id, lat, long, description, name, category }, idx) => (
            <Marker
              key={idx}
              coordinate={{
                latitude: parseFloat(lat),
                longitude: parseFloat(long),
              }}
              title={name}
              description={description}
              onPress={() =>
                router.push({
                  pathname: "/event-details",
                  params: {
                    id: id,
                    location: description,
                    latitude: lat,
                    longitude: long,
                    name: name,
                    time: description,
                  },
                })
              }
            >
              <View>
                <Image
                  style={styles.customMarker}
                  source={
                    category
                      ? getMarker(category)
                      : require("../../assets/images/other_m.png")
                  }
                />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* searchbar */}
      <View style={styles.searchbarContainer}>
        <TextInput
          style={styles.searchbar}
          placeholder='Search events'
          value={searchText}
          onChangeText={(text) => {
            handleSearchFilter(text);
          }}
        />
        {/* full events filter */}
        <Link href='/eventFilter' asChild>
          <TouchableOpacity style={styles.filterIcon}>
            <Ionicons name='filter-circle-outline' size={35} color='#4285F4' />
          </TouchableOpacity>
        </Link>
      </View>

      {/* quick filters */}
      <ScrollView horizontal={true} style={styles.filterContainer}>
        {/* time filter */}
        <TouchableOpacity
          style={[styles.quickFilterButtons, styles.selectedFilter]}
          onPress={openTimePicker}
        >
          <Text style={[styles.filterText, styles.selectedFilterText]}>
            Today's Times
          </Text>
        </TouchableOpacity>

        {/* category filters */}
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.quickFilterButtons,
              selectedCategory === category ? styles.selectedFilter : null,
            ]}
            onPress={() => {
              setSelectedCategory(category);
              setTextFilter({ selectedCategory: category });
            }}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === category
                  ? styles.selectedFilterText
                  : null,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}

        {/* time options */}
        <Modal
          transparent={true}
          visible={TimePickerVisibility}
          animationType='slide'
          onRequestClose={closeTimePicker}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Time Period</Text>
              {timeOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.modalOption,
                    option === selectedTime && styles.selectedFilter,
                  ]}
                  onPress={() => {
                    setSelectedTime(option);
                    console.log("OPTION", option);
                    setTextFilter({ selectedTime: option });
                    closeTimePicker();
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      option === selectedTime && styles.selectedFilterText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </ScrollView>

      {/* button to open the action sheet */}
      <TouchableOpacity
        style={styles.openSheetButton}
        onPress={() => {
          if (actionSheetRef.current) {
            actionSheetRef.current.setModalVisible(true);
          }
        }}
      >
        <Text style={styles.openSheetButtonText}>Events List</Text>
      </TouchableOpacity>

      {/* event list using the action sheet */}
      <ActionSheet ref={actionSheetRef} gestureEnabled={true}>
        <View style={[styles.sheetItems, { height: 600 }]}>
          <Text style={styles.sheetTitle}>Events</Text>
          {events.length > 0 ? (
            <FlatList
              data={events}
              keyExtractor={(item) => item.id}
              renderItem={renderEventItem}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                Oh no! There are no results matching your filter :(
              </Text>
              <Link
                href='/eventFilter'
                asChild
                onPress={() => {
                  collapseActionSheet();
                }}
              >
                <TouchableOpacity style={styles.returnButton}>
                  <Text style={styles.returnButtonText}>Return to Filters</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
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
    bottom: 37,
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
    paddingVertical: 12,
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
    paddingVertical: 11,
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
  customMarker: {
    width: 52,
    height: 60,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noResultsText: {
    paddingTop: 50,
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
    color: "#555",
    marginBottom: 15,
  },
  returnButton: {
    marginTop: 20,
    backgroundColor: "#4285F4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  returnButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
  },
});
