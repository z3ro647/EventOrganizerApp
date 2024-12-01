import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const AddEventScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext); // Current user
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleAddEvent = async () => {
    if (!title.trim() || !description.trim() || !location.trim()) {
      return Alert.alert("Validation Error", "All fields are required.");
    }

    try {
      const eventsCollection = collection(db, "events");
      await addDoc(eventsCollection, {
        title,
        description,
        location,
        createdBy: user.uid,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Event added successfully!");
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      console.error("Error adding event:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Event</Text>

      <TextInput
        style={styles.input}
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Event Location"
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Add Event" onPress={handleAddEvent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 16,
  },
});

export default AddEventScreen;
