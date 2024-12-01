import React, { useContext, useState, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { collection, getDocs, getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { onSnapshot } from "firebase/firestore";

const FavoritesScreen = () => {
  const { user } = useContext(AuthContext); // Get the current user
  const [favorites, setFavorites] = useState([]);

  // Fetch favorite events
  const fetchFavorites = () => {
    const eventsCollection = collection(db, "events");
    const unsubscribe = onSnapshot(eventsCollection, (querySnapshot) => {
      const favoriteEvents = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((event) => event.favoritedBy?.includes(user.uid));
  
      setFavorites(favoriteEvents);
    });
  
    return unsubscribe; // Return unsubscribe to clean up listener
  };

  // Remove an event from favorites
  const handleRemoveFavorite = async (eventId) => {
    try {
      const eventDoc = doc(db, "events", eventId);
      const eventSnapshot = await getDoc(eventDoc);

      if (eventSnapshot.exists()) {
        const eventData = eventSnapshot.data();
        const updatedFavorites = eventData.favoritedBy.filter((uid) => uid !== user.uid);

        await updateDoc(eventDoc, { favoritedBy: updatedFavorites });
        fetchFavorites(); // Refresh favorites list
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = fetchFavorites();
    return unsubscribe; // Cleanup on unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Favorite Events</Text>
      {favorites.length === 0 ? (
        <Text style={styles.noFavorites}>No favorites yet. Add some from the events list!</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDescription}>{item.description}</Text>
              <Text style={styles.eventLocation}>Location: {item.location}</Text>
              <Button
                title="Remove from Favorites"
                onPress={() => handleRemoveFavorite(item.id)}
              />
            </View>
          )}
        />
      )}
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
  noFavorites: {
    fontSize: 16,
    color: "#555",
  },
  eventItem: {
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventDescription: {
    marginVertical: 4,
  },
  eventLocation: {
    fontStyle: "italic",
  },
});

export default FavoritesScreen;