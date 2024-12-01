import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, AuthContext } from "./src/context/AuthContext"; // Correct import
import { EventProvider } from "./src/context/EventContext"; // Assuming EventContext is defined
import AuthStack from "./src/navigation/AuthStack";
import MainStack from "./src/navigation/MainStack";

export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </EventProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useContext(AuthContext); // Safely access the context
  return user ? <MainStack /> : <AuthStack />;
}
