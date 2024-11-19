import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BASE_URL } from "@/constants/api";
import axios from "axios";
import TagRow from "@/components/TagRow/TagRow";
import LanguageRow from "@/components/LanguageRow/LanguageRow";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRoute, useNavigation } from "@react-navigation/native";
import { getUserData } from "@/hooks/userContext";
import { Ionicons } from "@expo/vector-icons";

const OtherProfile = () => {
  const route = useRoute();
  const { userId: currentUserId, hasHaptic } = getUserData();
  const { userId } = route.params;
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});
  const [isFriend, setIsFriend] = useState(false);
  const [events, setEvents] = useState([]);

  const fetchUserEvents = async (userId) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/users/${userId}/events`);
      setEvents(data.data || []);
    } catch (e) {
      hasHaptic &&
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Could not fetch events");
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${userId}`);
      if (response.data) {
        setUserData(response.data.data);
        setIsFriend(response.data.data.friendIds?.includes(currentUserId) ?? false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const userResponse = await axios.get(`${BASE_URL}/users/${userId}`);
          setUserData(userResponse.data.data);
          setIsFriend(userResponse.data.data.friendIds?.includes(currentUserId) ?? false);
          fetchUserEvents(userId);
        } catch (error) {
          if (hasHaptic) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
          console.error("Error fetching user data:", error);
        }
      };

      if (userId) {
        fetchData();
      }

      return () => {
        setUserData({});
        setEvents([]);
      };
    }, [userId, currentUserId])
  );

  const handleAddFriend = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/${currentUserId}/add-friend`,
        {
          friendId: userId,
        }
      );

      if (response.data.status) {
        setIsFriend(true);
        fetchUserData();
      } else {
        {
          hasHaptic &&
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        alert(response.data.message);
      }
    } catch (error) {
      {
        hasHaptic &&
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      console.error("Failed to add friend:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleRemoveFriend = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/${currentUserId}/remove-friend`,
        {
          friendId: userId,
        }
      );

      if (response.data.status) {
        setIsFriend(false);
        fetchUserData();
      } else {
        {
          hasHaptic &&
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Failed to remove friend:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <ScrollView style={styles.profileContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("friends")}
          style={styles.backButtonContainer}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.backButton}> Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.userContainer}>
        <View style={styles.userDetailsWrapper}>
          <Image
            style={styles.profileImg}
            source={{
              uri: userData.photo
                ? userData.photo
                : "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg",
            }}
          />
          <View style={styles.userDetails}>
            <View style={styles.userNameWrapper}>
              <Text style={styles.userNameTitle}>
                {userData.name || "Unknown Name"}
              </Text>
              <Text style={styles.age}>
                {userData.age || "N/A"} • {userData.gender || "N/A"}
              </Text>
            </View>
            <Text style={styles.yearOfStudy}>
              {userData.studyYear || "Unknown Year"} |{" "}
              {userData.studyField || "Unknown Degree"}
            </Text>
            {userData.languages && userData.languages.length > 0 && (
              <LanguageRow languages={userData.languages} />
            )}
          </View>
        </View>
        <View style={styles.metricsContainer}>
          <View>
            <Text style={styles.metricText}>
              {userData.friendIds ? userData.friendIds.length : 0}
            </Text>
            <Text style={styles.metricSpan}>Friends</Text>
          </View>
          <View>
            <Text style={styles.metricText}>
              {events.length}
            </Text>
            <Text style={styles.metricSpan}>Events</Text>
          </View>
        </View>
      </View>
      <View style={styles.profileSection}>
        <Text style={styles.profileTitle}>Self introduction</Text>
        <View style={styles.introBlock}>
          <Text style={styles.introText}>
            {userData.bio || "No bio available"}
          </Text>
        </View>
      </View>
      <View style={styles.profileSection}>
        <LinearGradient
          colors={["#FFFFFF", "#D5A6FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.mbtiBlock}
        >
          <Text style={styles.mbtiText}>{userData.mbti || "N/A"}</Text>
        </LinearGradient>
      </View>
      <View style={styles.profileSection}>
        <Text style={styles.profileTitle}>Interests</Text>
        {userData.interests && userData.interests.length > 0 ? (
          <TagRow tags={userData.interests} />
        ) : (
          <Text style={styles.noDataText}>No interests</Text>
        )}
      </View>
      <View style={styles.profileSection}>
        <Text style={styles.profileTitle}>Courses I'm doing</Text>
        {userData.courses && userData.courses.length > 0 ? (
          <TagRow tags={userData.courses} />
        ) : (
          <Text style={styles.noDataText}>No courses</Text>
        )}
      </View>
      <View style={styles.overscroll} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={isFriend ? styles.removeFriendButton : styles.addFriendButton}
          onPress={isFriend ? handleRemoveFriend : handleAddFriend}
        >
          <Text
            style={
              isFriend
                ? styles.removeFriendButtonText
                : styles.addFriendButtonText
            }
          >
            {isFriend ? "Remove Friend" : "Add Friend"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.overscroll} />
    </ScrollView>
  );
};

export default OtherProfile;

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    backgroundColor: "#EEEEEE",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#EEEEEE",
  },
  header: {
    marginLeft: 10,
    marginTop: 10,
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    fontSize: 16,
    color: "#000",
  },
  profileHeader: {
    height: 100,
    backgroundColor: "#FFFFFF",
    width: "100%",
    padding: 20,
    top: 0,
    alignItems: "center",
    paddingTop: 40,
  },
  headerTitle: {
    color: "#454545",
    fontSize: 28,
    fontFamily: "Lexend_700Bold",
  },
  inputBlock: {},
  inputRow: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 2,
  },
  inputField: {
    paddingHorizontal: 15,
    width: "70%",
    borderBottomColor: "#D9D9D9",
    borderBottomWidth: 2,
    zIndex: 2,
  },
  inputLabel: {
    color: "#000000",
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
  },

  loginButton: {
    paddingHorizontal: 10,
    backgroundColor: "#76DA69",
    height: 55,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Lexend_700Bold",
  },
  loginFooter: {
    alignItems: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#FFFFFF",
    fontSize: 16,
    zIndex: 2,
  },
  profileImgContainer: {
    height: 150,
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  userDetailsWrapper: {
    flexDirection: "row",
    gap: 10,
  },
  userNameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userNameTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 18,
  },
  userContainer: {
    flexDirection: "column",
    gap: 25,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    elevation: 4,
  },
  age: {
    backgroundColor: "#3A72FF",
    paddingHorizontal: 10,
    paddingVertical: 2,
    color: "#FFFFFF",
    letterSpacing: -0.5,
    borderRadius: 20,
    alignItems: "center",
    fontFamily: "Lexend_600SemiBold",
  },
  yearOfStudy: {
    fontFamily: "Lexend_400Regular",
    color: "#8E8E93",
  },

  metricsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  metricText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 20,
    textAlign: "center",
  },
  metricSpan: {
    fontFamily: "Lexend_400Regular",
    color: "#AEAEB2",
    fontSize: 12,
  },
  profileSection: {
    paddingHorizontal: 10,
  },
  profileTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 18,
    marginTop: 10,
    color: "#20303C",
  },
  mbtiBlock: {
    borderRadius: 10,
    width: "100%",
    height: 55,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffsetWidth: 10,
    shadowOffsetHeight: 20,
    elevation: 4,
    marginTop: 15,
  },
  mbtiText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 20,
    color: "#AE79F9",
  },
  introBlock: {
    padding: 5,
    backgroundColor: "#FFFFFF",
    height: 120,
    width: "100%",
    marginTop: 10,
    borderRadius: 10,
    elevation: 4,
    padding: 10,
  },
  introText: {
    fontFamily: "Lexend_500Medium",
    fontSize: 12,
    color: "#20303C",
  },
  overscroll: {
    height: 50,
  },
  editText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#3A72FF",
  },
  editProfile: {
    alignSelf: "flex-end",
  },
  editWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  buttonContainer: {
    marginTop: -30,
    alignItems: "center",
  },
  addFriendButton: {
    width: "90%",
    paddingVertical: 20,
    backgroundColor: "#8a2be2",
    borderRadius: 10,
    alignItems: "center",
  },
  addFriendButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  removeFriendButton: {
    width: "90%",
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ff0000",
  },
  removeFriendButtonText: {
    color: "#ff0000",
    fontSize: 18,
    fontWeight: "bold",
  },
  noDataText: {
    fontFamily: 'Lexend_500Medium',
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 10,
  },
});
