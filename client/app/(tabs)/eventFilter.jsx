import React, { useState, useEffect, useRef } from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const EventFilter = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [initialFilters, setInitialFilters] = useState({});
  const [currentFilters, setCurrentFilters] = useState({
    selectedCategory: "",
    selectedDate: null,
    selectedTime: "",
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    if (isFocused) {
      if (Object.keys(initialFilters).length === 0) {
        setCurrentFilters({ selectedCategory: "", selectedDate: null, selectedTime: "" });
      }
    }
  }, [isFocused]);

  const applyFilters = () => {
    setInitialFilters(currentFilters);
    
    const filtersToSend = {
      ...currentFilters,
      selectedDate: currentFilters.selectedDate ? currentFilters.selectedDate.toISOString() : null,
    };
  
    navigation.navigate("events", {
      filters: filtersToSend,
      openEventsList: true,
    });
  };

  const clearFilters = () => {
    setCurrentFilters({ selectedCategory: "", selectedDate: null, selectedTime: "" });
    setInitialFilters({});
  };

  const hasFiltersChanged = () => {
    return JSON.stringify(initialFilters) !== JSON.stringify(currentFilters);
  };

  const showButton = () => {
    return (
      currentFilters.selectedCategory || currentFilters.selectedDate || currentFilters.selectedTime
    );
  };

  const buttonText = hasFiltersChanged() ? "Apply Filters" : "Clear Filters";

  const formatDate = (date) => {
    return date ? date.toLocaleDateString("en-GB") : "Select Date";
  };

  const handleConfirmDate = (selectedDate) => {
    setCurrentFilters((prev) => ({ ...prev, selectedDate: selectedDate }));
    setDatePickerVisibility(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("events")}
          style={styles.backButtonContainer}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.backButton}> Back</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Filter By</Text>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Category</Text>
      <View style={styles.tagRow}>
        {["Hang", "Study", "Eat", "Society", "Other"].map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() =>
              setCurrentFilters({
                ...currentFilters,
                selectedCategory: category === currentFilters.selectedCategory ? "" : category,
              })
            }
            style={[
              styles.tag,
              currentFilters.selectedCategory === category ? styles.tagSelected : null,
            ]}>
            <Text
              style={[
                styles.tagText,
                currentFilters.selectedCategory === category ? styles.tagTextSelected : null,
              ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Date</Text>

      {/* Date */}
      <View style={styles.detailContainer}>
        <Pressable onPress={() => setDatePickerVisibility(true)} style={styles.dateTimeField}>
          <Text style={styles.dateTimeText}>{formatDate(currentFilters.selectedDate)}</Text>
        </Pressable>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisibility(false)}
        />
      </View>

      {/* Time */}
      <Text style={styles.sectionTitle}>Time</Text>
      <View style={styles.tagRow}>
        {["Morning", "Midday", "Afternoon", "Night"].map((time) => (
          <TouchableOpacity
            key={time}
            onPress={() =>
              setCurrentFilters({
                ...currentFilters,
                selectedTime: time === currentFilters.selectedTime ? "" : time,
              })
            }
            style={[styles.tag, currentFilters.selectedTime === time ? styles.tagSelected : null]}>
            <Text
              style={[
                styles.tagText,
                currentFilters.selectedTime === time ? styles.tagTextSelected : null,
              ]}>
              {time}
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
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  tag: {
    paddingVertical: 8,
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
  dateTimeField: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    height: 45,
    padding: 7.5,
    justifyContent: "center",
    marginBottom: 20,
  },
  dateTimeText: {
    color: "#454545",
    fontSize: 15,
  },
});

export default EventFilter;
