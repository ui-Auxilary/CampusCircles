import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import Header from '../../components/Header';
import { View, StyleSheet, Text, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "blue",
          header: ({ route }) => {
            let title = "";
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
                break;
              case "profile":
                title = "Profile";
                break;
              default:
                title = "Campus Circles";
            }
            return <Header title={title} />;
          },
          tabBarStyle: styles.tabBarStyle,
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name='home-outline' color={color} />
            ),
            tabBarLabel: ({ focused }) => (
              <View style={styles.labelContainer}>
                <Text
                  style={[
                    styles.tabBarLabelStyle,
                    focused && styles.tabBarLabelFocused,
                  ]}
                >
                  Home
                </Text>
                {focused && <View style={styles.underline} />}
              </View>
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
            tabBarLabel: ({ focused }) => (
              <View style={styles.labelContainer}>
                <Text
                  style={[
                    styles.tabBarLabelStyle,
                    focused && styles.tabBarLabelFocused,
                  ]}
                >
                  Events
                </Text>
                {focused && <View style={styles.underline} />}
              </View>
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
            tabBarLabel: ({ focused }) => (
              <View style={styles.labelContainer}>
                <Text
                  style={[
                    styles.tabBarLabelStyle,
                    focused && styles.tabBarLabelFocused,
                  ]}
                >
                  Create
                </Text>
                {focused && <View style={styles.underline} />}
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
            tabBarLabel: ({ focused }) => (
              <View style={styles.labelContainer}>
                <Text
                  style={[
                    styles.tabBarLabelStyle,
                    focused && styles.tabBarLabelFocused,
                  ]}
                >
                  Friends
                </Text>
                {focused && <View style={styles.underline} />}
              </View>
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
            tabBarLabel: ({ focused }) => (
              <View style={styles.labelContainer}>
                <Text
                  style={[
                    styles.tabBarLabelStyle,
                    focused && styles.tabBarLabelFocused,
                  ]}
                >
                  Profile
                </Text>
                {focused && <View style={styles.underline} />}
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  tabBarStyle: {
    height: 80,
    paddingBottom: 25,
    paddingTop: 8,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    position: 'absolute',
  },
  tabBarLabelStyle: {
    fontSize: 12,
    color: 'gray',
  },
  tabBarLabelFocused: {
    color: 'blue',
  },
  labelContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  underline: {
    position: 'absolute',
    bottom: -10,
    height: 4,
    width: 35,
    backgroundColor: 'blue',
    borderRadius: 2,
  },
  createButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 35,
  },
  createButtonFocused: {
    backgroundColor: '#2563eb',
  },
});
