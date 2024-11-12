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

// imported components
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// imported assets
import pic from "../../assets/images/Image.png";
import unchecked from "../../assets/images/unchecked.png";
import checked from "../../assets/images/checked.png";
import { BASE_URL } from "@/constants/api";
import { getUserData } from "@/hooks/userContext";

// UNSW Locations
const UNSW_LOCATIONS = [
  { name: "AGSM", lat: -33.91816351947832, lng: 151.23558345263652 },
  {
    name: "Ainsworth Building",
    lat: -33.91851453103917,
    lng: 151.23133733660842,
  },
  {
    name: "Anita B. Lawrence Centre",
    lat: -33.91771478748421,
    lng: 151.22993773558224,
  },
  { name: "Bank", lat: -33.91741693751213, lng: 151.23366010298952 },
  {
    name: "Barker Apartments",
    lat: -33.91938338786202,
    lng: 151.22894467791113,
  },
  {
    name: "Barker Street Parking Station",
    lat: -33.919304745367505,
    lng: 151.23118470859555,
  },
  { name: "Basser College", lat: -33.916533771804296, lng: 151.23173330859547 },
  {
    name: "Biological Sciences - North",
    lat: -33.917113247208896,
    lng: 151.23533310664283,
  },
  {
    name: "Biological Sciences - South",
    lat: -33.91749008702639,
    lng: 151.2360874509244,
  },
  { name: "Blockhouse", lat: -33.91679957245693, lng: 151.22691986626663 },
  {
    name: "Botany Street Parking Station",
    lat: -33.91814496632007,
    lng: 151.23465422024003,
  },
  { name: "Building K17", lat: -33.918687986372426, lng: 151.23100012208883 },
  { name: "Building L5", lat: -33.917950482078275, lng: 151.22613484417772 },
  { name: "Chancellery", lat: -33.91665220187508, lng: 151.23452163367372 },
  {
    name: "Civil Engineering",
    lat: -33.918038356559435,
    lng: 151.23251199140503,
  },
  {
    name: "Clancy Auditorium",
    lat: -33.91571246881472,
    lng: 151.23421581029595,
  },
  { name: "Colombo House", lat: -33.91543162507806, lng: 151.2316535478737 },
  { name: "Dalton", lat: -33.916681924556414, lng: 151.22939774452036 },
  {
    name: "Electrical Engineering",
    lat: -33.91693544802448,
    lng: 151.23135084098033,
  },
  {
    name: "Esme Timbery Creative Studio",
    lat: -33.91544234041234,
    lng: 151.22751571768825,
  },
  { name: "Fig Tree Hall", lat: -33.91499450053618, lng: 151.23174396426992 },
  { name: "Fig Tree Theatre", lat: 0, lng: 0 }, ///////////
  {
    name: "Fitness and Aquatic Centre",
    lat: -33.91496879500578,
    lng: 151.22665221719004,
  },
  {
    name: "Goldstein College",
    lat: -33.914834071431954,
    lng: 151.2322021404227,
  },
  { name: "Goldstein Hall", lat: -33.91593841726432, lng: 151.2315816404232 },
  { name: "Goodsell", lat: -33.91685822456282, lng: 151.23265093303118 },
  {
    name: "Gordon and Jacqueline Samuels Building",
    lat: -33.91784383633943,
    lng: 151.2351217069306,
  },
  { name: "Hilmer Building", lat: -33.91626711251456, lng: 151.22848038700502 },
  {
    name: "House At Pooh Corner",
    lat: -33.91837305083146,
    lng: 151.22741129439962,
  },
  {
    name: "International House",
    lat: -33.91506906938383,
    lng: 151.22736464837172,
  },
  {
    name: "John Niland Scientia",
    lat: -33.91712713729993,
    lng: 151.23224640234773,
  },
  {
    name: "June Griffith Building",
    lat: -33.91692269440534,
    lng: 151.2289577662659,
  },
  {
    name: "Keith Burrows Theatre",
    lat: -33.917999933253725,
    lng: 151.2300628361579,
  },
  { name: "Law Building", lat: -33.91562203554193, lng: 151.227612075638 },
  { name: "Library", lat: -33.917062940844794, lng: 151.23330447280085 },
  {
    name: "Lowy Cancer Research Centre",
    lat: -33.91553579327924,
    lng: 151.23541480234675,
  },
  { name: "Mathews", lat: -33.9170068162199, lng: 151.23413582166373 },
  { name: "Mathews Arcade", lat: -33.916926938022215, lng: 151.23458763303108 },
  { name: "Mathews Theatre", lat: -33.91698686638026, lng: 151.234129308595 },
  { name: "Morven Brown", lat: -33.91585482348208, lng: 151.23244087166324 },
  { name: "Moya Dodd Grandstand", lat: 0, lng: 0 }, ////// doesnt exist
  { name: "New College", lat: -33.91816510885186, lng: 151.22673492230592 },
  {
    name: "New College Postgraduate Village",
    lat: -33.917150141660095,
    lng: 151.22568349643126,
  },
  { name: "Newton", lat: -33.91727165153532, lng: 151.22995396371516 },
  { name: "NIDA", lat: -33.91568254371104, lng: 151.22516934999473 },
  {
    name: "NIDA Parade Theatre",
    lat: -33.9160595733547,
    lng: 151.2252295624611,
  },
  { name: "Old Main", lat: -33.91747557887084, lng: 151.23116958644985 },
  { name: "Old Tote", lat: -33.91747557887084, lng: 151.23116958644985 },
  {
    name: "Patricia O'Shane Building",
    lat: -33.91706475603473,
    lng: 151.23248473278863,
  }, // central lecture block // CLB
  {
    name: "Philip Baxter College",
    lat: -33.91665148815054,
    lng: 151.23168180088723,
  }, // basser college
  { name: "Physics Theatre", lat: -33.91766219321098, lng: 151.23012756371543 },
  { name: "Quadrangle", lat: -33.91624698854793, lng: 151.23056801029622 },
  { name: "Repository", lat: -33.916203428520085, lng: 151.23352506914696 },
  {
    name: "Rex Vowels Theatre",
    lat: -33.91695415114445,
    lng: 151.23136250234745,
  },
  { name: "Robert Webster", lat: -33.917586351959706, lng: 151.23061076272342 },
  {
    name: "Robert Webster Theatres",
    lat: -33.917344034298196,
    lng: 151.2306733351128,
  },
  { name: "Roundhouse", lat: -33.91561870757597, lng: 151.22665140234673 },
  { name: "Rupert Myers", lat: -33.918464688373156, lng: 151.230352848374 },
  {
    name: "Sam Cracknell Pavilion",
    lat: -33.916904273382485,
    lng: 151.22691777961296,
  },
  {
    name: "Science and Engineering",
    lat: -33.91654528620154,
    lng: 151.22767034788,
  },
  {
    name: "Science Theatre",
    lat: -33.916315928489816,
    lng: 151.22944691029625,
  },
  {
    name: "Shalom Apartments",
    lat: -33.9191837796625,
    lng: 151.22766669194556,
  }, // shalom college
  {
    name: "Solar Industrial Research Facility (SIRF)",
    lat: -33.917475042142264,
    lng: 151.23401101768968,
  },
  { name: "Squarehouse", lat: -33.916292993199065, lng: 151.22635170276118 }, // unsw design futures lab
  {
    name: "Tyree Energy Technologies Building (TETB)",
    lat: -33.91721148764159,
    lng: 151.22665461540814,
  }, // school of photovoltaic and renewable energy engineering
  {
    name: "University Terraces",
    lat: -33.914827949872155,
    lng: 151.22826467905494,
  }, // university terraces apartment
  {
    name: "UNSW Business School",
    lat: -33.9157852829548,
    lng: 151.22939657166336,
  },
  { name: "UNSW Regiment", lat: -33.91717917186827, lng: 151.22469523151156 },
  { name: "UNSW Regiment 2", lat: -33.91717917186827, lng: 151.22469523151156 },
  { name: "UNSW Village", lat: -33.91520531144744, lng: 151.22904227905534 },
  {
    name: "Vallentine Annexe",
    lat: -33.917323614190046,
    lng: 151.23352052508258,
  },
  {
    name: "Village Green Food and Beverage",
    lat: -33.9176791002627,
    lng: 151.2288597163693,
  }, // home ground kiosk
  {
    name: "Village Green Pick up and Play",
    lat: -33.9176791002627,
    lng: 151.2288597163693,
  }, // home ground kiosk
  { name: "Wallace Wurth", lat: -33.91603334460775, lng: 151.23569104097953 },
  {
    name: "Warrane College",
    lat: -33.918329623925366,
    lng: 151.22648654098117,
  },
  { name: "White House", lat: -33.91557635487205, lng: 151.23065054837193 },
  { name: "Willis Annexe", lat: -33.91796057112238, lng: 151.2314470870065 },
];

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
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

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
      lat: location.lat,
      lng: location.lng,
    }));
    setShowSuggestions(false);
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
              placeholder="Search for location"
              value={locationQuery}
              onChangeText={handleLocationChange}
            />
            {showSuggestions && (
              <FlatList
                data={locationResults}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => selectLocation(item)}
                    style={styles.locationItem}
                  >
                    <Text>{item.name}</Text>
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
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 200,
    maxHeight: 150,
    position: "absolute",
    top: 70,
    zIndex: 1000,
    padding: 5,
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
