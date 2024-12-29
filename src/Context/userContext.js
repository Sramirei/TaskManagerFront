/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();
const UserProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const loggedUserJSON = window.localStorage.getItem("user");

  const login = async (body) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/login`,
        body
      );

      if (response.data.code === 1) {
        const user = response.data;
        localStorage.setItem("user", JSON.stringify(user.user));
        localStorage.setItem("token", user.token);
        setSession(user);
        return {
          success: true,
          user,
        };
      } else {
        throw new Error(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setSession(user);
    }
  }, []);

  const handleLogout = () => {
    setSession(null);
    localStorage.clear();
    sessionStorage.clear();
  };

  const data = { session, login, handleLogout };

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

export { UserProvider };
export default UserContext;
