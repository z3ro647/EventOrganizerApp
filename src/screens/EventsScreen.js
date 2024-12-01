import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import EventCard from "../components/EventCard";
import { onSnapshot } from "firebase/firestore";

const EventsScreen = () => {
  const { user, logout } = useContext(AuthContext); // Add logout functionality
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editEventId, setEditEventId] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const eventsCollection = collection(db, "events");

  const fetchEvents = () => {
    const unsubscribe = onSnapshot(eventsCollection, (querySnapshot) => {
      const allEvents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      const userEvents = allEvents.filter((event) => event.createdBy === user.uid);
      setEvents(userEvents);
  
      const userFavorites = userEvents.filter((event) =>
        event.favoritedBy?.includes(user.uid)
      );
      setFavorites(userFavorites);
    });
  
    return unsubscribe; // Return unsubscribe to clean up listener
  };

  const handleAddEvent = async () => {
    if (!title.trim() || !description.trim())
      return alert("Please fill in all fields.");
    try {
      await addDoc(eventsCollection, {
        title,
        description,
        createdBy: user.uid,
        createdAt: new Date(),
      });
      setTitle("");
      setDescription("");
      fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleEditEvent = async () => {
    if (!title.trim() || !description.trim())
      return alert("Please fill in all fields.");
    try {
      const eventDoc = doc(db, "events", editEventId);
      await updateDoc(eventDoc, { title, description });
      setEditEventId(null);
      setTitle("");
      setDescription("");
      fetchEvents();
    } catch (error) {
      console.error("Error editing event:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const eventDoc = doc(db, "events", id);
      await deleteDoc(eventDoc);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const toggleFavorite = async (event) => {
    try {
      const eventDoc = doc(db, "events", event.id);
      const isFavorite = event.favoritedBy?.includes(user.uid);
  
      const updatedFavorites = isFavorite
        ? event.favoritedBy.filter((uid) => uid !== user.uid)
        : [...(event.favoritedBy || []), user.uid];
  
      await updateDoc(eventDoc, { favoritedBy: updatedFavorites });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  
  useEffect(() => {
    if (user) {
      const unsubscribe = fetchEvents();
      return unsubscribe; // Cleanup on unmount
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Events</Text>

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
      />
      <Button
        title={editEventId ? "Save Changes" : "Add Event"}
        onPress={editEventId ? handleEditEvent : handleAddEvent}
      />

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onEdit={(event) => {
              setEditEventId(event.id);
              setTitle(event.title);
              setDescription(event.description);
            }}
            onDelete={handleDeleteEvent}
            onToggleFavorite={toggleFavorite}
            isFavorite={favorites.some((fav) => fav.id === item.id)}
          />
        )}
      />
      <Button title="Logout" onPress={logout} />
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
    marginBottom: 8,
  },
});

export default EventsScreen;