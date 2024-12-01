import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import EventsScreen from "../screens/EventsScreen";
import AddEventScreen from "../screens/AddEventScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons

const Tab = createBottomTabNavigator();

export default function MainStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Set icons based on the route name
          if (route.name === "Events") {
            iconName = focused ? "list-circle" : "list-circle-outline";
          } else if (route.name === "AddEvent") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Favorites") {
            iconName = focused ? "heart" : "heart-outline";
          }

          // Return the icon component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato", // Active tab color
        tabBarInactiveTintColor: "gray", // Inactive tab color
        tabBarStyle: {
          backgroundColor: "#fff",
        },
        headerShown: false, // Hide the header for tabs
      })}
    >
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="AddEvent" component={AddEventScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}
