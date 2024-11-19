import React, { useState, useEffect, useRef } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import ActionSheet from "react-native-actions-sheet";
import languages from "../../data/languages.json";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const FriendFilter = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [initialFilters, setInitialFilters] = useState({});
  const [currentFilters, setCurrentFilters] = useState({
    selectedYear: "",
    selectedLanguage: "",
    course: "",
    interest: "",
  });
  const actionSheetRef = useRef(null);

  useEffect(() => {
    if (isFocused) {
      // If no filters have been applied, reset the current filters
      if (Object.keys(initialFilters).length === 0) {
        setCurrentFilters({ selectedYear: "", selectedLanguage: "", course: "", interest: "" });
      }
    }
  }, [isFocused]);

  const applyFilters = () => {
    setInitialFilters(currentFilters);
    navigation.navigate("addFriends", currentFilters);
  };

  const clearFilters = () => {
    setCurrentFilters({ selectedYear: "", selectedLanguage: "", course: "", interest: "" });
    setInitialFilters({});
  };

  const hasFiltersChanged = () => {
    return JSON.stringify(initialFilters) !== JSON.stringify(currentFilters);
  };

  const showButton = () => {
    return (
      currentFilters.selectedYear ||
      currentFilters.selectedLanguage ||
      currentFilters.course ||
      currentFilters.interest
    );
  };

  const buttonText = hasFiltersChanged() ? "Apply Filters" : "Clear Filters";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("addFriends")}
          style={styles.backButtonContainer}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.backButton}> Back</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Filter By</Text>
      <Text style={styles.sectionTitle}>Courses</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for one primary course..."
        placeholderTextColor="#888"
        value={currentFilters.course}
        onChangeText={(text) => setCurrentFilters({ ...currentFilters, course: text })}
      />
      <Text style={styles.sectionTitle}>Interests</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for one primary interest..."
        placeholderTextColor="#888"
        value={currentFilters.interest}
        onChangeText={(text) => setCurrentFilters({ ...currentFilters, interest: text })}
      />
      <Text style={styles.sectionTitle}>Languages</Text>
      <TouchableOpacity
        onPress={() => actionSheetRef.current?.setModalVisible(true)}
        style={styles.languageButton}>
        <Text
          style={
            currentFilters.selectedLanguage
              ? styles.languageTextSelected
              : styles.languageTextUnselected
          }>
          {currentFilters.selectedLanguage || "Select Language"}
        </Text>
      </TouchableOpacity>
      <ActionSheet ref={actionSheetRef}>
        <Picker
          selectedValue={currentFilters.selectedLanguage}
          onValueChange={(itemValue) =>
            setCurrentFilters({ ...currentFilters, selectedLanguage: itemValue })
          }>
          <Picker.Item label="Select Language" value="" />
          {languages.map(({ label, value }) => (
            <Picker.Item key={value} label={label} value={value} />
          ))}
        </Picker>
      </ActionSheet>
      <Text style={styles.sectionTitle}>Academic Year Group</Text>
      <View style={styles.tagRow}>
        {["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year+"].map((year) => (
          <TouchableOpacity
            key={year}
            onPress={() =>
              setCurrentFilters({
                ...currentFilters,
                selectedYear: year === currentFilters.selectedYear ? "" : year,
              })
            }
            style={[styles.tag, currentFilters.selectedYear === year ? styles.tagSelected : null]}>
            <Text
              style={[
                styles.tagText,
                currentFilters.selectedYear === year ? styles.tagTextSelected : null,
              ]}>
              {year}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {showButton() && (
        <TouchableOpacity
          style={styles.applyButton}
          onPress={hasFiltersChanged() ? applyFilters : clearFilters}>
          <Text style={styles.applyButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    fontSize: 16,
    color: "#000",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Lexend_400Bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Lexend_400Regular",
    marginBottom: 10,
  },
  searchInput: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#000",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  tag: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: 4,
  },
  tagSelected: {
    backgroundColor: "#3A72FF",
  },
  tagText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#3A72FF",
  },
  tagTextSelected: {
    fontFamily: "Lexend_400Regular",
    color: "#fff",
  },
  languageButton: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    justifyContent: "center",
  },
  languageTextUnselected: {
    color: "#888",
    fontSize: 16,
  },
  languageTextSelected: {
    color: "#000",
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default FriendFilter;
