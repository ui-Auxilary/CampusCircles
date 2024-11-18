import { View, Text, StyleSheet } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Image } from "react-native";

import Wizard1 from "../assets/wizard/Wizard1.png";
import MessageBox from "@/components/MessageBox/MessageBox";
import { MotiView } from "moti";
const Wizard = () => {
  let [pageNum, setPageNum] = useState(0);

  const wizardPages = [
    {
      src: require("../assets/wizard/Wizard1.png"),
      dialogue: `Hey guys, there's a newbie!\n\nMy friends and I'll give you a tour of CampusCircles!`,
      top: 200,
      left: 30,
    },
    {
      src: require("../assets/wizard/Wizard2.png"),
      dialogue:
        "Great! First stop is the Homepage.\nThis is where you can see your\n upcoming events.",
      top: 400,
      left: 30,
    },
    {
      src: require("../assets/wizard/Wizard3.png"),
      dialogue:
        "Event invites show as notifications\nthat you can accept or decline.",
      top: 200,
      left: 30,
    },
    {
      src: require("../assets/wizard/Wizard4.png"),
      dialogue:
        "Next up is Events. This is where you\ncan find and discover public “events”\nhappening around on Campus.",
      top: 250,
      left: 30,
    },
    {
      src: require("../assets/wizard/Wizard5.png"),
      dialogue:
        "Events are colour-coded by categories\nwhich you can filter by.",
      top: 50,
      left: 30,
    },
    {
      src: require("../assets/wizard/Wizard6.png"),
      dialogue:
        "The map view only shows events that\nare on 'Today'. Searching gives a List\nView with more events!",
      top: 200,
      left: 30,
    },
    {
      src: require("../assets/wizard/Wizard7.png"),
      dialogue: `Event you're looking for doesn't exist?\nNo problem! Under the create tab, you\ncan use our provided tags.`,
      top: 300,
      left: 30,
    },
    {
      src: require("../assets/wizard/Wizard8.png"),
      dialogue:
        "It's time to get social and expand your\nnetwork. We can add friends with icon in\nthe top-right corner",
      top: 350,
      left: 30,
    },
    {
      src: require("../assets/wizard/Wizard9.png"),
      dialogue:
        "This provides us with a list of active\nusers! You can find and search for\npeople that align with your interests!",
      top: 250,
      left: 30,
    },
    {
      src: require("../assets/wizard/Wizard10.png"),
      dialogue: `Back on the first Circle page.\nFriends that you add will appear here!`,
      top: 250,
      left: 30,
    },
    {
      src: require("../assets/wizard/Wizard11.png"),
      dialogue:
        "Last stop of the day!\n\nThe profile is where you can show off\nyour interests and be yourself!",
      top: 200,
      left: 30,
    },
  ];

  const renderComponent = useCallback(() => {
    if (pageNum != null) {
      return (
        <MessageBox
          dialogue={wizardPages[pageNum].dialogue}
          top={wizardPages[pageNum].top}
          left={wizardPages[pageNum].left}
          handleNext={setPageNum}
          page={pageNum}
        />
      );
    } else {
      setTimeout(() => {
        setPageNum(0);
      }, [200]);
    }
  }, [pageNum]);

  useEffect(() => {
    renderComponent();
  }, [pageNum]);

  return (
    <View style={styles.container}>
      {renderComponent()}

      <Image
        style={styles.wizardImg}
        source={wizardPages[pageNum]?.src || ""}
      />
    </View>
  );
};

export default Wizard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wizardImg: {
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },
});
