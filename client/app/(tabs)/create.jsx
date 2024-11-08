/*
NOTES
- NOW date time picker
- NOW geomap thingy
*/

import {
  StyleSheet,
  View,
  Image,
  Text,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router, useNavigation } from "expo-router";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

// imported assets
import pic from "../../assets/images/Image.png";
import unchecked from "../../assets/images/unchecked.png";
import checked from "../../assets/images/checked.png";
import { BASE_URL } from "@/constants/api";
import { getUserData } from "@/hooks/userContext";

///////////////////////////////////////////////////////////////////////////////
// APP ////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const CreateTab = () => {
  // VARAIBLES
  const { userId } = getUserData();
  const navigation = useNavigation();
  const [eventType, setEventType] = useState("Hang");
  const [image, setImage] = useState(null);
  const [mediaLibraryPermissions, requestMediaLibraryPermissions] =
    ImagePicker.useMediaLibraryPermissions();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const defaultEventData = {
    name: "",
    photo: "",
    location: "",
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

  // FUNCTIONS: useEffect

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

  // FUNCTIONS: on form update

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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      handleInputChange("date", selectedDate.toISOString().split("T")[0]); // Set date string
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
      handleInputChange("time", selectedTime.toTimeString().slice(0, 5)); // Set time string
    }
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

  // FUNCTOINS: on form submission

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
    // ensure that the form is valid
    if (!validateForm()) {
      return;
    }

    try {
      // post event to prisma
      const response = await axios.post(`${BASE_URL}/events/create`, event);
      // connect event ID to user
      const createdEventId = response.data?.data?.id;
      await axios.put(`${BASE_URL}/users/${userId}/update`, {
        eventsCreated: {
          create: {
            id: createdEventId,
            name: event.name, // Replace with actual event data
            location: event.location,
            date: event.date,
            time: event.time,
            photo: event.photo,
            description: event.description,
            public: event.public,
            society: event.society,
            // Needs the other fields ie. tag, creator etc
          },
        },
      });

      /*
      await axios.put(`${BASE_URL}/users/${userId}/update`, {
        eventsCreated: {
          connect: { id: createdEventId },
        },
      });
      */

      // navigate to the event's detail page
      router.push({
        pathname: "event-details",
        params: { id: createdEventId },
      });
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const resetForm = () => {
    setEvent({ ...defaultEventData });
    setImage(null);
  };

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
              placeholder="Enter event location"
              value={event.location}
              onChangeText={(value) => handleInputChange("location", value)}
            />
          </View>
        </View>
      </View>

      <View style={styles.horiz}>
        {/* Date Picker */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Date</Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={styles.field}
          >
            <Text>{date.toISOString().split("T")[0]}</Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Time Picker */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Time</Text>
          <Pressable
            onPress={() => setShowTimePicker(true)}
            style={styles.field}
          >
            <Text>{time.toTimeString().slice(0, 5)}</Text>
          </Pressable>
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
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
  // Privacy Selector
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
  // Event Details
  detailContainer: {
    rowGap: 5,
  },
  label: {
    color: "#454545",
    fontSize: 20,
  },
  field: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    height: 45,
    padding: 5,
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
