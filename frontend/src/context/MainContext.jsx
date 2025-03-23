import { createContext, useContext, useEffect, useState } from "react";
import axios from "../config/axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        axios
          .get("/user/profile")
          .then((response) => {
            setUser(response.data);
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log("auth initailization failed", error);
      }
    }

    setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const UseUser = () => {
  return useContext(UserContext);
};
