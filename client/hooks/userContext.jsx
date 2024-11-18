import { createContext, useContext, useState } from "react";

export const UserContext = createContext({});

export const getUserData = () => useContext(UserContext);

export default function UserProvider({ children }) {
  // For now global access to userID, maybe store events and stuff idk
  const [userId, setUserId] = useState("");
  const [showAge, setShowAge] = useState(true);
  const [showPronoun, setShowPronoun] = useState(true);
  const [hasHaptic, setHasHaptic] = useState(true);
  const [allowNotif, setAllowNotif] = useState(true);
  const [editData, setEditData] = useState({
    name: "",
    age: "",
    languages: [],
    bio: "",
    mbti: "",
    interests: "",
    courses: "",
  });

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        editData,
        setEditData,
        showAge,
        setShowAge,
        showPronoun,
        setShowPronoun,
        hasHaptic,
        setHasHaptic,
        allowNotif,
        setAllowNotif,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
