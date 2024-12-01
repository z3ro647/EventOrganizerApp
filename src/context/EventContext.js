import React, { createContext, useState } from "react";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);

  return (
    <EventContext.Provider value={{ events, setEvents, favorites, setFavorites }}>
      {children}
    </EventContext.Provider>
  );
};
