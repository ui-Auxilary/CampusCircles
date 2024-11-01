import React, { useState } from "react";
import { Stack, Link, router } from "expo-router";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Pressable,
  TextInput,
} from "react-native";

// imported assets

import pic from "../assets/images/Image.png";
import unchecked from "../assets/images/unchecked.png";
import checked from "../assets/images/checked.png";
import createButton from "../assets/images/createbutton.png";

///////////////////////////////////////////////////////////////////////////////
// APP ////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export default function App() {
  // Data for event

  const [event, setEvent] = useState({
    id: "",
    name: "",
    photo: "",
    location: "",
    date: "",
    time: "",
    description: "",
    publicEvent: true,
    society: false,
    tagID: "Hang",
    attendeeIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: "",
  });

  const [image, setImage] = useState(null);

  // retrieve tag

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

  // onPress functions

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

  //

  const handleCreate = () => {
    const eventData = {
      ...event,
    };

    axios
      .post(
        "https://6601-123-208-248-87.ngrok-free.app/events/create",
        eventData
      )
      .then(() => {
        router.push("/create-event"); // ???
      })
      .catch((e) => {
        console.log(e);
      });
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
            <View style={[styles.field, { width: 200 }]}></View>
          </View>
          {/* location */}
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Location</Text>
            <View style={[styles.field, { width: 200 }]}></View>
          </View>
        </View>
      </View>

      <View style={styles.horiz}>
        {/* Date */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Date</Text>
          <View style={[styles.field, { width: 180 }]}></View>
        </View>
        {/* Time */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Time</Text>
          <View style={[styles.field, { width: 180 }]}></View>
        </View>
      </View>

      {/* description */}
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Description</Text>
        <View style={styles.descriptionContainer}></View>
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
}

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
