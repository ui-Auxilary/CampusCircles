import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";

import { MotiView, useDynamicAnimation } from "moti";
import { MotiPressable } from "moti/interactions";

const MessageBox = ({ dialogue, top, left, handleNext, page }) => {
  const animation = useDynamicAnimation(() => ({
    opacity: 1,
  }));

  const getNext = () => {
    switch (page) {
      case 0:
        return "I'm in";
      case 10:
        return "Finish";
      default:
        return "Next";
    }
  };

  return (
    <MotiView
      state={animation}
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        type: "timing",
        duration: 1000,
      }}
      style={styles.container}
    >
      <View style={styles.messageWrapper}>
        <View>
          {page > 0 ? <Text style={styles.counter}>{page} / 10</Text> : null}
          <Text style={styles.dialogue}>{dialogue}</Text>
        </View>
        <View style={styles.flexRow}>
          {page < 10 ? (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)")}
              style={[styles.btn, styles.exitBtn]}
            >
              <Text style={styles.btnText}>
                {page === 0 ? "Skip tour" : "Exit"}
              </Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={() => {
              handleNext((prev) => {
                if (prev === 10) {
                  router.push("/(tabs)");
                } else if (prev < 10) {
                  animation.animateTo((current) => ({
                    ...current,
                    top: top,
                    left: left,
                  }));

                  return prev + 1;
                }
              });
            }}
            style={[styles.btn, styles.nextBtn]}
          >
            <Text style={styles.btnText}>{getNext()}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </MotiView>
  );
};

export default MessageBox;

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    position: "absolute",
    backgroundColor: "white",
    zIndex: 2,
    top: 200,
    left: 30,
  },
  messageWrapper: {
    padding: 20,
    flexDirection: "column",
    gap: 20,
  },
  dialogue: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
  },
  flexRow: {
    flexDirection: "row",
    gap: 20,
  },
  btn: {
    flex: 1,
    color: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontFamily: "Lexend_500Medium",
    fontSize: 12,
    color: "white",
    textAlign: "center",
  },
  exitBtn: {
    backgroundColor: "#FF3460",
  },
  nextBtn: {
    backgroundColor: "#754FFF",
  },
  counter: {
    fontFamily: "Lexend_500Medium",
    fontSize: 12,
    color: "#D29B9B",
    alignSelf: "flex-end",
    marginBottom: 5,
  },
});
