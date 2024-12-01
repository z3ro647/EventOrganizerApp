import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const EventCard = ({ 
  event, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  isFavorite 
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <Text style={styles.location}>Location: {event.location || "N/A"}</Text>
      <View style={styles.actions}>
        {onEdit && (
          <Button title="Edit" onPress={() => onEdit(event)} />
        )}
        {onDelete && (
          <Button title="Delete" onPress={() => onDelete(event.id)} />
        )}
        <Button
          title={isFavorite ? "Unfavorite" : "Favorite"}
          onPress={() => onToggleFavorite(event)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    marginVertical: 4,
  },
  location: {
    fontStyle: "italic",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default EventCard;
