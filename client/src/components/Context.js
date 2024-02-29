import React, { createContext, useContext, useState } from "react";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    const [user, setUser] = useState(false)
    const [logIn, setLogIn] = useState(false)
    const [events, setEvents] = useState([])
    const [hostedEvents, setHostedEvents] = useState([])

  
  
    const globalState = {
      user, setUser,
      logIn, setLogIn, 
      events, setEvents,
      hostedEvents, setHostedEvents,
    };

  return (
    <GlobalStateContext.Provider value={globalState}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  return useContext(GlobalStateContext);
};
