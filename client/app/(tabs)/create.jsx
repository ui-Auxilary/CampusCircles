// changed search result suggestions to scrollview
// fixed layering issue with search suggestions
// changed borderRadius and border visibility for location field to dynamic

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
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";

// backend
import { router, useNavigation } from "expo-router";
import axios from "axios";

// helper
import { uploadImage } from "@/helper/uploadImage";

// imported components
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";

// imported assets
import pic from "../../assets/images/Image.png";
import unchecked from "../../assets/images/unchecked.png";
import checked from "../../assets/images/checked.png";
import { BASE_URL } from "@/constants/api";
import { getUserData } from "@/hooks/userContext";

// UNSW Locations
import UNSW_LOCATIONS from "../../data/locations.json";
import RNDateTimePicker from "@react-native-community/datetimepicker";

///////////////////////////////////////////////////////////////////////////////
// APP ////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const CreateTab = () => {
  // Variables //////////////////////////////////////////////////////////
  const { userId, hasHaptic } = getUserData();
  const navigation = useNavigation();
  const [eventType, setEventType] = useState("Hang");
  const [image, setImage] = useState(null);
  const [mediaLibraryPermissions, requestMediaLibraryPermissions] =
    ImagePicker.useMediaLibraryPermissions();
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [displayTime, setDisplayTime] = useState();

  // Helper functions
  const getTimeNow = () => {
    let d = new Date(Date.now());
    d.setTime(d.getTime() - d.getTimezoneOffset() * 60 * 1000);
    return d;
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

  const defaultEventData = {
    name: "",
    photo: "",
    lat: "",
    long: "",
    category: "",
    date: new Date(),
    time: getTimeNow(),
    description: "",
    public: true,
    eventAttendees: [userId],
    society: false,
    creator: {
      connect: {
        id: userId,
      },
    },
  };

  const [event, setEvent] = useState(defaultEventData);

  // FUNCTIONS: useEffect ////////////////////////////////////////////////////////////////////

  const checkPermissions = async () => {
    if (!mediaLibraryPermissions?.granted) {
      const libraryStatus = await requestMediaLibraryPermissions();

      if (!libraryStatus.granted) {
        {
          hasHaptic &&
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        Alert.alert(
          "Permissions Required",
          "Please grant camera and media library permissions in settings to use this feature."
        );
      }
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      resetForm();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setEvent({ ...event, ["creator"]: { connect: { id: userId } } });
  }, [userId]);

  // FUNCTIONS: on form update //////////////////////////////////////

  const handleInputChange = (field, value) => {
    setEvent((prevEvent) => ({ ...prevEvent, [field]: value }));
  };

  const handleImagePick = async () => {
    if (!mediaLibraryPermissions?.granted) {
      const hasPermissions = await checkPermissions();
      if (!hasPermissions) return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: 1,
      base64: true,
    });

    if (result && !result.canceled) {
      const base64Image = result.assets ? result.assets[0].base64 : "";

      try {
        const response = await uploadImage(userId, {
          photo: base64Image,
        });
        setEvent((prev) => ({ ...prev, photo: response.data.data }));
        setImage(result.assets[0].uri);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleLocationChange = (query) => {
    setLocationQuery(query);
    if (query.length > 1) {
      const filteredResults = UNSW_LOCATIONS.filter((location) =>
        location.name.toLowerCase().includes(query.toLowerCase())
      );
      setLocationResults(filteredResults);
      setShowSuggestions(filteredResults.length > 0);
    } else {
      setLocationResults([]);
      setShowSuggestions(false);
    }
  };

  const selectLocation = (location) => {
    setLocationQuery(location.name);
    setEvent((prevEvent) => ({
      ...prevEvent,
      lat: location.lat.toString(),
      long: location.lng.toString(),
      location: location.name,
    }));
    setShowSuggestions(false);
  };

  const togglePrivacy = () => {
    setEvent({ ...event, public: !event.public });
  };

  const toggleSociety = () => {
    setEvent({ ...event, society: !event.society });
  };

  // FUNCTIONS: on form submission ////////////////////////////////////////////

  const validateDate = (value) => {
    return !isNaN(Date.parse(value));
  };

  const validateTime = (value) => {
    return !isNaN(value);
  };

  const validateForm = () => {
    const requiredFields = ["name", "location", "date", "time", "description"];
    for (let field of requiredFields) {
      if (!event[field]) {
        {
          hasHaptic &&
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        Alert.alert("Form Incomplete", `Please fill out the ${field} field.`);
        return false;
      }
    }

    if (!validateDate(event.date)) {
      {
        hasHaptic &&
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert(
        "Invalid Date Format",
        "Please enter date in DD/MM/YYYY format."
      );
      return false;
    }

    if (!validateTime(event.time.getTime())) {
      {
        hasHaptic &&
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
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

    const postData = {
      name: event.name,
      photo: event.photo,
      lat: event.lat,
      long: event.long,
      category: eventType,
      date: event.date.toISOString(),
      time: event.time.toISOString(),
      description: event.description,
      public: event.public,
      eventAttendees: [userId],
      society: event.society,
      location: event.location,
      creator: {
        connect: { id: userId },
      },
    };

    // Format event/date
    let date = postData.date.split("T")[0];
    let time = postData.time.split("T")[1];

    let formatDateTime = `${date}T${time}`;

    if (event.society) {
      postData["category"] = "Society";
    }

    postData["date"] = formatDateTime;
    postData["time"] = formatDateTime;

    Haptics.selectionAsync();
    await axios
      .post(`${BASE_URL}/events/create`, postData)
      .then(({ data }) => {
        let createdEvent = data.data;
        if (createdEvent && createdEvent.id) {
          {
            hasHaptic &&
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
          }
          router.back();
          router.push({
            pathname: "/event-details",
            params: { id: createdEvent.id, page: "create" },
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const resetForm = () => {
    setEvent({ ...defaultEventData });
    setImage(null);
    setLocationQuery("");
    setLocationResults([]);
  };

  /////////////////////////////////////////////////////////////////////////////
  // DESIGN ///////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  return (
    <ScrollView style={getTag()}>
      <View style={[styles.container]}>
        <View style={[styles.typeContainer, styles.shadow]}>
          <Pressable
            style={[
              styles.typeButtonFirst,
              eventType === "Hang" && styles.typeButtonFirstInverted,
            ]}
            onPress={() => setEventType("Hang")}
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
            onPress={() => setEventType("Study")}
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
            onPress={() => setEventType("Eat")}
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
            onPress={() => setEventType("Other")}
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

        <View style={[styles.horiz, { zIndex: 3, position: "relative" }]}>
          {/* Image */}
          <Pressable onPress={handleImagePick} style={styles.imageContainer}>
            {event.photo ? (
              <Image style={styles.fullImage} source={{ uri: image }} />
            ) : (
              <Image style={styles.iconImage} source={pic} />
            )}
          </Pressable>
          {/* Event Name */}
          <View style={[styles.verti, { zIndex: 4, position: "relative" }]}>
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Event Name</Text>
              <TextInput
                style={[styles.field, { flex: 1 }]}
                placeholder='Enter event name'
                value={event.name}
                onChangeText={(value) => handleInputChange("name", value)}
              />
            </View>
            {/* Location */}
            <View
              style={[
                styles.detailContainer,
                { zIndex: 5, position: "relative" },
              ]}
            >
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={[
                  styles.field,
                  {
                    flex: 1,
                    borderBottomLeftRadius: showSuggestions ? 0 : 10,
                    borderBottomRightRadius: showSuggestions ? 0 : 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#ccc",
                  },
                ]}
                placeholder='Search for location'
                value={locationQuery}
                onChangeText={handleLocationChange}
              />
              {showSuggestions && (
                <View style={styles.suggestionsContainer}>
                  {locationResults.map((location, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => selectLocation(location)}
                      style={styles.locationItem}
                    >
                      <Text>{location.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.horiz}>
          {/* Date Field */}
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Date</Text>
            <Pressable style={[styles.dateField, { padding: 0 }]}>
              <RNDateTimePicker
                style={{ flex: 1, width: 100 }}
                mode='date'
                value={event.date || new Date(Date.now())}
                onChange={(_, d) => {
                  let today = new Date(
                    d.getTime() - d.getTimezoneOffset() * 60 * 1000
                  );

                  setEvent({ ...event, date: today });
                }}
              />
            </Pressable>
          </View>

          {/* Time Field */}
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Time</Text>
            <Pressable style={[styles.dateField, { padding: 0 }]}>
              <RNDateTimePicker
                style={{ flex: 1, width: 100 }}
                mode='time'
                value={displayTime || new Date()}
                onChange={(_, d) => {
                  setEvent({ ...event, time: d });
                  setDisplayTime(d);
                }}
              />
            </Pressable>
          </View>
        </View>

        {/* Description */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.descriptionContainer}
            placeholder='Describe the event details'
            value={event.description}
            onChangeText={(value) => handleInputChange("description", value)}
            multiline
            textAlignVertical='top'
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
          <View style={{ flexDirection: "row", gap: 10, alignSelf: "center" }}>
            <Pressable onPress={toggleSociety}>
              <Image
                source={event.society ? checked : unchecked}
                style={styles.iconImage}
              />
            </Pressable>
            <Text style={styles.label}>Society</Text>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            onPress={handleCreate}
            style={[styles.createButton, styles.shadow]}
          >
            <Text style={styles.createText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footerArea} />
    </ScrollView>
  );
};
/////////////////////////////////////////////////////////////////////////////
// STYLE ////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 20,
    padding: 20,
    alignItems: "center",
  },
  containerHang: {
    backgroundColor: "#E7948D",
  },
  containerStudy: {
    backgroundColor: "#A0B7EF",
  },
  containerEat: {
    backgroundColor: "#F0D074",
  },
  containerOther: {
    backgroundColor: "#EEEEEE",
  },
  // Type Selector
  typeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 10,
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
    flex: 1,
    width: "100%",
  },
  label: {
    color: "#454545",
    fontSize: 20,
  },
  dateTimeText: {
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
  imageContainer: {
    backgroundColor: "#FFFFFF",
    height: 160,
    flex: 1,
    maxWidth: 160,
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
    borderRadius: 10,
    padding: 10,
  },
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: "100%",
    position: "absolute",
    top: 78,
    zIndex: 10,
    padding: 5,
  },
  locationItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  // Privacy
  privacyContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  privacyButtonLeft: {
    alignItems: "center",
    width: "50%",
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingVertical: 10,
  },
  privacyButtonRight: {
    alignItems: "center",
    width: "50%",
    backgroundColor: "white",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 10,
  },
  privacyButtonLeftInverted: {
    alignItems: "center",
    width: "50%",
    backgroundColor: "#3A72FF",
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  privacyButtonRightInverted: {
    alignItems: "center",
    width: "50%",
    backgroundColor: "#3A72FF",
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
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  // Create
  createButton: {
    backgroundColor: "#76DA69",
    paddingHorizontal: 27.5,
    paddingVertical: 12.5,
    borderRadius: 15,
  },
  createText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "bold",
  },
  // Other
  horiz: {
    columnGap: 15,
    width: "100%",
    flexDirection: "row",
  },
  verti: {
    rowGap: 5,
    flexDirection: "column",
    flex: 1,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  footerArea: {
    marginTop: 100,
  },
  dateContainer: {
    flex: 1,
  },
  dateField: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CreateTab;
