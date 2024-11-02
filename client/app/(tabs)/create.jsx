/*
NOTES
- LATER create button onPress needs to redirect user event detail page
- NOW need invalidated create form if fields are not filled properly
- NOW add permission for image picker
- NOW fix tag?
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
import React, { useState } from "react";
import { router } from "expo-router";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

// imported assets

import pic from "../../assets/images/Image.png";
import unchecked from "../../assets/images/unchecked.png";
import checked from "../../assets/images/checked.png";
import { BASE_URL } from "@/constants/api";

///////////////////////////////////////////////////////////////////////////////
// APP ////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const CreateTab = () => {
  // Data for event
  const defaultEventData = {
    name: "",
    photo: "",
    location: "",
    date: new Date(),
    time: new Date(),
    description: "",
    public: true,
    tagID: {
      create: {
        name: "Hang",
        events: {},
      },
    },
    eventAttendees: {},
    society: false,
    invitations: {},
    creatorId: {
      // Connect event to temporary user for now
      connect: {
        id: "6722204d9e232f55d0a0903c",
      },
    },
  };
  const [event, setEvent] = useState(defaultEventData);
  const [image, setImage] = useState(null);

  // Functions to handle changes to event details

  const handleInputChange = (field, value) => {
    setEvent((prevEvent) => ({ ...prevEvent, [field]: value }));
  };

  const getTag = () => {
    switch (event.tagID) {
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setEvent({ ...event, photo: result.assets[0].uri });
      setImage(result.assets[0].uri);
    }
  };

  const toggleTag = (tag) => {
    setEvent({ ...event, tagID: tag });
  };

  const togglePrivacy = () => {
    setEvent({ ...event, publicEvent: !event.publicEvent });
  };

  const toggleSociety = () => {
    setEvent({ ...event, society: !event.society });
  };

  const validateDate = (value) => {
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return datePattern.test(value);
  };

  const validateTime = (value) => {
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
    return timePattern.test(value);
  };

  // Function to handle post request creating event

  const handleCreate = () => {
    if (!validateDate(event.date)) {
      Alert.alert(
        "Invalid Date Format",
        "Please enter date in DD/MM/YYYY format."
      );
      return;
    }

    if (!validateTime(event.time)) {
      Alert.alert(
        "Invalid Time Format",
        "Please enter time in 24-hour HH:MM format."
      );
      return;
    }

    // Change base_url in constants instead of directly modifying
    axios
      .post(`${BASE_URL}/events/create`, event)
      .then(() => router.push("/create-event"))
      .catch((e) => console.log(e));

    resetForm();
  };

  const resetForm = () => {
    setEvent(defaultEventData);
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
            event.tagID === "Hang" && styles.typeButtonFirstInverted,
          ]}
          onPress={() => toggleTag("Hang")}
        >
          <Text
            style={[
              styles.typeText,
              event.tagID === "Hang" && styles.typeTextInverted,
            ]}
          >
            Hang
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.typeButton,
            event.tagID === "Study" && styles.typeButtonInverted,
          ]}
          onPress={() => toggleTag("Study")}
        >
          <Text
            style={[
              styles.typeText,
              event.tagID === "Study" && styles.typeTextInverted,
            ]}
          >
            Study
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.typeButton,
            event.tagID === "Eat" && styles.typeButtonInverted,
          ]}
          onPress={() => toggleTag("Eat")}
        >
          <Text
            style={[
              styles.typeText,
              event.tagID === "Eat" && styles.typeTextInverted,
            ]}
          >
            Eat
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.typeButtonLast,
            event.tagID === "Other" && styles.typeButtonLastInverted,
          ]}
          onPress={() => toggleTag("Other")}
        >
          <Text
            style={[
              styles.typeText,
              event.tagID === "Other" && styles.typeTextInverted,
            ]}
          >
            Other
          </Text>
        </Pressable>
      </View>

      <View style={styles.horiz}>
        {/* image */}
        <View style={styles.imageContainer}>
          <Pressable onPress={handleImagePick} style={styles.imageContainer}>
            {event.photo ? (
              <Image style={styles.fullImage} source={{ uri: image }} />
            ) : (
              <Image style={styles.iconImage} source={pic} />
            )}
          </Pressable>
        </View>
        {/* event name */}
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
          {/* location */}
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
        {/* Date */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={[styles.field, { width: 180 }]}
            placeholder="DD/MM/YYYY"
            value={event.date}
            onChangeText={(value) => handleInputChange("date", value)}
          />
        </View>
        {/* Time */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Time</Text>
          <TextInput
            style={[styles.field, { width: 180 }]}
            placeholder="HH:MM"
            value={event.time}
            onChangeText={(value) => handleInputChange("time", value)}
          />
        </View>
      </View>

      {/* description */}
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

      {/* privacy */}
      <View style={[styles.privacyContainer, styles.shadow]}>
        <Pressable
          style={[
            styles.privacyButtonLeft,
            event.publicEvent === true && styles.privacyButtonLeftInverted,
          ]}
          onPress={togglePrivacy}
        >
          <Text
            style={[
              styles.privacyText,
              event.publicEvent === true && styles.privacyTextInverted,
            ]}
          >
            Public
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.privacyButtonRight,
            event.publicEvent === false && styles.privacyButtonRightInverted,
          ]}
          onPress={togglePrivacy}
        >
          <Text
            style={[
              styles.privacyText,
              event.publicEvent === false && styles.privacyTextInverted,
            ]}
          >
            Private
          </Text>
        </Pressable>
      </View>

      <View style={[styles.societyCreateContainer, styles.horiz]}>
        {/* society check */}
        <Pressable onPress={toggleSociety}>
          <Image
            source={event.society ? checked : unchecked}
            style={styles.iconImage}
          />
        </Pressable>
        <Text style={styles.label}>Society</Text>

        {/* create button */}
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
    fontSize: "25",
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
