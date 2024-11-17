import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import Header from "../../components/Header";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { router } from "expo-router";

const { height } = Dimensions.get("window");

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "blue",
          header: () => {
            let title = "";
            let showAddFriendButton = false;
            let showSettings = false;

            switch (route.name) {
              case "index":
                title = "Home";
                break;
              case "events":
                title = "Events";
                break;
              case "create":
                title = "Create";
                break;
              case "friends":
                title = "Friends";
                showAddFriendButton = true;
                break;
              case "profile":
                title = "Profile";
                showSettings = true;
                break;
              case "addFriends":
                title = "Add Friends";
                break;
              case "otherProfile":
                title = "Profile";
                break;
              default:
                title = "Campus Circles";
            }

            return (
              <Header
                title={title}
                showAddFriendButton={showAddFriendButton}
                showSettings={showSettings}
                onAddFriend={() => {
                  console.log(
                    "Navigating to addFriends screen using router.push"
                  );
                  router.push("/addFriends");
                }}
              />
            );
          },
          tabBarStyle: styles.tabBarStyle,
        })}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name='home-outline' color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='events'
          options={{
            title: "Events",
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name='location-outline' color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='create'
          options={{
            title: "Create",
            tabBarIcon: ({ focused }) => (
              <View
                style={[
                  styles.createButton,
                  focused && styles.createButtonFocused,
                ]}
              >
                <Ionicons size={32} name='add' color='#fff' />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name='friends'
          options={{
            title: "Friends",
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name='people-outline' color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name='person-circle-outline' color={color} />
            ),
          }}
        />
        {/* Remove the extra "header" screen definition */}
        <Tabs.Screen name='addFriends' options={{ href: null }} />
        <Tabs.Screen name='otherProfile' options={{ href: null }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarStyle: {
    height: 80,
    paddingBottom: 25,
    paddingTop: 8,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  createButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 35,
  },
  createButtonFocused: {
    backgroundColor: "#2563eb",
  },
});
