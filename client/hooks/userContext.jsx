import { createContext, useContext, useState } from 'react';

export const UserContext = createContext({});

export const getUserData = () => useContext(UserContext);

export default function UserProvider({ children }) {
  // For now global access to userID, maybe store events and stuff idk
  const [userId, setUserId] = useState('');
  const [editData, setEditData] = useState({
    name: '',
    age: 0,
    languages: [],
    bio: '',
    mbti: '',
    interests: '',
    courses: '',
  });

  return (
    <UserContext.Provider value={{ userId, setUserId, editData, setEditData }}>
      {children}
    </UserContext.Provider>
  );
}
