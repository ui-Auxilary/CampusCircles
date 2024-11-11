/*
to review
marked additional imports and variables
on form update function additions
changes to resetForm
design for location
*/

import {
  StyleSheet,
  View,
  Image,
  Text,
  Pressable,
  TextInput,
  Alert,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";

// backend
import { router, useNavigation } from "expo-router";
import axios from "axios";

// imported APIs
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// imported assets
import pic from "../../assets/images/Image.png";
import unchecked from "../../assets/images/unchecked.png";
import checked from "../../assets/images/checked.png";
import { BASE_URL } from "@/constants/api";
import { getUserData } from "@/hooks/userContext";

// opencage API
const OPENCAGE_API_KEY = "0b76d125882040e6b92dd7ddf1f3ab13";

///////////////////////////////////////////////////////////////////////////////
// APP ////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const CreateTab = () => {
  // Variables //////////////////////////////////////////////////////////
  const { userId } = getUserData();
  const navigation = useNavigation();
  const [eventType, setEventType] = useState("Hang");
  const [image, setImage] = useState(null);
  const [mediaLibraryPermissions, requestMediaLibraryPermissions] =
    ImagePicker.useMediaLibraryPermissions();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  // Event Obj ////////////////////////////////////////
  const defaultEventData = {
    name: "",
    photo: "",
    lat: "",
    long: "",
    date: new Date(),
    time: new Date(),
    description: "",
    public: true,
    tag: {
      connectOrCreate: {
        where: {
          id: "6722204d9e232f55d0a0903c",
        },
        create: {
          name: eventType,
        },
      },
    },
    eventAttendees: {},
    society: false,
    invitations: {},
    creator: {
      connect: {
        id: userId,
      },
    },
  };
  const [event, setEvent] = useState(defaultEventData);

  // Variables: OpenCage
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // FUNCTIONS: useEffect ////////////////////////////////////////////////////////////////////

  const checkPermissions = async () => {
    if (!mediaLibraryPermissions?.granted) {
      const libraryStatus = await requestMediaLibraryPermissions();

      if (!libraryStatus.granted) {
        Alert.alert(
          "Permissions Required",
          "Please grant camera and media library permissions in settings to use this feature."
        );
      }
    }
  };

  useEffect(() => {
    checkPermissions();
    const unsubscribe = navigation.addListener("focus", () => {
      resetForm();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    console.log("ID:", userId);
  }, [userId]);

  // FUNCTIONS: on form update //////////////////////////////////////

  const handleInputChange = (field, value) => {
    setEvent((prevEvent) => ({ ...prevEvent, [field]: value }));
  };

  const getTag = () => {
    switch (eventType) {
      case "Study":
        return styles.containerStudy;
      case "Eat":
        return styles.containerEat;
      case "Other":
        return styles.containerOther;
      default:
        return styles.containerHang;
    }
  };

  const handleImagePick = async () => {
    if (!mediaLibraryPermissions?.granted) {
      const hasPermissions = await checkPermissions();
      if (!hasPermissions) return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setEvent((prev) => ({ ...prev, photo: result.assets[0].uri }));
      setImage(result.assets[0].uri);
    }
  };

  const handleLocationChange = async (query) => {
    setLocationQuery(query);
    if (query.length > 2) {
      try {
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            query
          )}&key=${OPENCAGE_API_KEY}&countrycode=AU&limit=5`
        );
        setLocationResults(response.data.results);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Geocoding Error:", error);
      }
    } else {
      setLocationResults([]);
      setShowSuggestions(false);
    }
  };

  const selectLocation = (location) => {
    setSelectedLocation(location.formatted);
    setEvent((prevEvent) => ({
      ...prevEvent,
      location: location.formatted,
      latitude: location.geometry.lat,
      longitude: location.geometry.lng,
    }));
    setLocationResults([]);
    setLocationQuery(location.formatted);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB");
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleConfirmDate = (selectedDate) => {
    setEvent((prev) => ({ ...prev, date: selectedDate }));
    setDatePickerVisibility(false);
  };

  const handleConfirmTime = (selectedTime) => {
    setEvent((prev) => ({ ...prev, time: selectedTime }));
    setTimePickerVisibility(false);
  };

  const toggleTag = (tag) => {
    setEventType(tag);
  };

  const togglePrivacy = () => {
    setEvent({ ...event, public: !event.public });
  };

  const toggleSociety = () => {
    setEvent({ ...event, society: !event.society });
  };

  // FUNCTIONS: on form submission ////////////////////////////////////////////

  const validateDate = (value) => {
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return datePattern.test(value);
  };

  const validateTime = (value) => {
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
    return timePattern.test(value);
  };

  const validateForm = () => {
    const requiredFields = ["name", "location", "date", "time", "description"];
    for (let field of requiredFields) {
      if (!event[field]) {
        Alert.alert("Form Incomplete", `Please fill out the ${field} field.`);
        return false;
      }
    }

    if (!validateDate(event.date)) {
      Alert.alert(
        "Invalid Date Format",
        "Please enter date in DD/MM/YYYY format."
      );
      return false;
    }

    if (!validateTime(event.time)) {
      Alert.alert(
        "Invalid Time Format",
        "Please enter time in 24-hour HH:MM format."
      );
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }

    let postData = {
      ...event,
      date: date.toISOString(),
      time: time.toISOString(),
    };

    try {
      const response = await axios.post(`${BASE_URL}/events/create`, postData);
      const createdEvent = response.data.data;

      // THIS IS HOW I WILL BE POSTING CREATED EVENT ID TO USER DATA
      if (createdEvent && createdEvent.id) {
        await axios.put(`${BASE_URL}/users/${userId}/update`, {
          eventsCreated: {
            create: createdEvent,
          },
        });

        router.push({
          pathname: "event-details",
          params: { id: createdEvent.id },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setEvent({ ...defaultEventData });
    setImage(null);
    setLocationQuery("");
    setLocationResults([]);
    setSelectedLocation(null);
  };

  // COMPONENT: geolocation suggestions ///////////////////////////////////////

  const LocationSuggestionsModal = ({
    visible,
    results,
    onSelect,
    onClose,
  }) => (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
                style={styles.locationItem}
              >
                <Text>{item.formatted}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  /////////////////////////////////////////////////////////////////////////////
  // DESIGN ///////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  return (
    <View style={getTag()}>
      <View style={[styles.typeContainer, styles.shadow]}>
        <Pressable
          style={[
            styles.typeButtonFirst,
            eventType === "Hang" && styles.typeButtonFirstInverted,
          ]}
          onPress={() => toggleTag("Hang")}
        >
          <Text
            style={[
              styles.typeText,
              eventType === "Hang" && styles.typeTextInverted,
            ]}
          >
            Hang
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.typeButton,
            eventType === "Study" && styles.typeButtonInverted,
          ]}
          onPress={() => toggleTag("Study")}
        >
          <Text
            style={[
              styles.typeText,
              eventType === "Study" && styles.typeTextInverted,
            ]}
          >
            Study
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.typeButton,
            eventType === "Eat" && styles.typeButtonInverted,
          ]}
          onPress={() => toggleTag("Eat")}
        >
          <Text
            style={[
              styles.typeText,
              eventType === "Eat" && styles.typeTextInverted,
            ]}
          >
            Eat
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.typeButtonLast,
            eventType === "Other" && styles.typeButtonLastInverted,
          ]}
          onPress={() => toggleTag("Other")}
        >
          <Text
            style={[
              styles.typeText,
              eventType === "Other" && styles.typeTextInverted,
            ]}
          >
            Other
          </Text>
        </Pressable>
      </View>

      <View style={styles.horiz}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Pressable onPress={handleImagePick} style={styles.imageContainer}>
            {event.photo ? (
              <Image style={styles.fullImage} source={{ uri: image }} />
            ) : (
              <Image style={styles.iconImage} source={pic} />
            )}
          </Pressable>
        </View>
        {/* Event Name */}
        <View style={styles.verti}>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Event Name</Text>
            <TextInput
              style={[styles.field, { width: 200 }]}
              placeholder="Enter event name"
              value={event.name}
              onChangeText={(value) => handleInputChange("name", value)}
            />
          </View>
          {/* Location */}
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={[styles.field, { width: 200 }]}
              placeholder="Search for location"
              value={locationQuery}
              onChangeText={handleLocationChange}
            />
            {locationResults.length > 0 && (
              <FlatList
                data={locationResults}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => selectLocation(item)}
                    style={styles.locationItem}
                  >
                    <Text>{item.formatted}</Text>
                  </TouchableOpacity>
                )}
                style={styles.suggestionsContainer}
              />
            )}
          </View>
        </View>
      </View>

      <View style={styles.horiz}>
        {/* Date Field */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Date</Text>
          <Pressable
            onPress={() => setDatePickerVisibility(true)}
            style={styles.dateTimeField}
          >
            <Text style={styles.dateTimeText}>{formatDate(event.date)}</Text>
          </Pressable>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={() => setDatePickerVisibility(false)}
          />
        </View>

        {/* Time Field */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Time</Text>
          <Pressable
            onPress={() => setTimePickerVisibility(true)}
            style={styles.dateTimeField}
          >
            <Text style={styles.dateTimeText}>{formatTime(event.time)}</Text>
          </Pressable>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmTime}
            onCancel={() => setTimePickerVisibility(false)}
          />
        </View>
      </View>

      {/* Description */}
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.descriptionContainer}
          placeholder="Describe the event details"
          value={event.description}
          onChangeText={(value) => handleInputChange("description", value)}
          multiline
        />
      </View>

      {/* Privacy */}
      <View style={[styles.privacyContainer, styles.shadow]}>
        <Pressable
          style={[
            styles.privacyButtonLeft,
            event.public === true && styles.privacyButtonLeftInverted,
          ]}
          onPress={togglePrivacy}
        >
          <Text
            style={[
              styles.privacyText,
              event.public === true && styles.privacyTextInverted,
            ]}
          >
            Public
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.privacyButtonRight,
            event.public === false && styles.privacyButtonRightInverted,
          ]}
          onPress={togglePrivacy}
        >
          <Text
            style={[
              styles.privacyText,
              event.public === false && styles.privacyTextInverted,
            ]}
          >
            Private
          </Text>
        </Pressable>
      </View>

      <View style={[styles.societyCreateContainer, styles.horiz]}>
        {/* Society Check */}
        <Pressable onPress={toggleSociety}>
          <Image
            source={event.society ? checked : unchecked}
            style={styles.iconImage}
          />
        </Pressable>
        <Text style={styles.label}>Society</Text>

        {/* Create Button */}
        <Pressable
          onPress={handleCreate}
          style={[styles.createButton, styles.shadow]}
        >
          <Text style={styles.createText}>Create</Text>
        </Pressable>
      </View>
    </View>
  );
};
/////////////////////////////////////////////////////////////////////////////
// STYLE ////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  // Background
  global: {
    flex: 1,
  },
  containerHang: {
    flex: 1,
    backgroundColor: "#E7948D",
    alignItems: "center",
    rowGap: 5,
  },
  containerStudy: {
    flex: 1,
    backgroundColor: "#A0B7EF",
    alignItems: "center",
    rowGap: 5,
  },
  containerEat: {
    flex: 1,
    backgroundColor: "#F0D074",
    alignItems: "center",
    rowGap: 5,
  },
  containerOther: {
    flex: 1,
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    rowGap: 5,
  },
  // Type Selector
  typeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 10,
    marginVertical: 25,
  },
  typeButtonFirst: {
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  typeButton: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  typeButtonLast: {
    backgroundColor: "white",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  typeButtonFirstInverted: {
    backgroundColor: "#3A72FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  typeButtonInverted: {
    backgroundColor: "#3A72FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  typeButtonLastInverted: {
    backgroundColor: "#3A72FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  typeText: {
    color: "#454545",
    fontSize: 25,
  },
  typeTextInverted: {
    color: "#FFF",
    fontSize: 25,
  },
  // Event Details
  detailContainer: {
    rowGap: 5,
  },
  label: {
    color: "#454545",
    fontSize: 20,
  },
  dateTimeLabel: {
    color: "#454545",
    fontSize: 15,
  },
  field: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    height: 45,
    padding: 7.5,
    justifyContent: "center",
  },
  dateTimeField: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    height: 45,
    width: 180,
    padding: 7.5,
    justifyContent: "center",
  },
  imageContainer: {
    backgroundColor: "#FFFFFF",
    height: 160,
    width: 160,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    overflow: "hidden",
  },
  fullImage: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  iconImage: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  descriptionContainer: {
    backgroundColor: "#FFFFFF",
    height: 160,
    width: 375,
    borderRadius: 10,
    padding: 10,
  },
  // geocoding shit
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "80%",
    maxHeight: 200,
    padding: 10,
  },
  locationItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  // Privacy
  privacyContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
  },
  privacyButtonLeft: {
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 65,
    paddingVertical: 10,
  },
  privacyButtonRight: {
    backgroundColor: "white",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 65,
    paddingVertical: 10,
  },
  privacyButtonLeftInverted: {
    backgroundColor: "#3A72FF",
    paddingHorizontal: 65,
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  privacyButtonRightInverted: {
    backgroundColor: "#3A72FF",
    paddingHorizontal: 65,
    paddingVertical: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  privacyText: {
    color: "#454545",
    fontSize: 20,
  },
  privacyTextInverted: {
    color: "#FFF",
    fontSize: 20,
  },
  // Society
  societyCreateContainer: {
    width: "80%",
    marginTop: 25,
  },
  // Create
  createButton: {
    backgroundColor: "#76DA69",
    paddingHorizontal: 27.5,
    paddingVertical: 12.5,
    borderRadius: 15,
    marginLeft: 100, // hardcoded
  },
  createText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "bold",
  },
  // Other
  horiz: {
    columnGap: 15,
    flexDirection: "row",
  },
  verti: {
    rowGap: 5,
    flexDirection: "column",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default CreateTab;
