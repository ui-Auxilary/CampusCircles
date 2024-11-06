import { createContext, useContext, useState } from 'react';

export const UserContext = createContext({});

export const getUserData = () => useContext(UserContext);

export default function UserProvider({ children }) {
  // For now global access to userID, maybe store events and stuff idk
  const [userId, setUserId] = useState('');

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
}
