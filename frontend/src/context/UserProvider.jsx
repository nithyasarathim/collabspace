import React, { useState, useEffect } from 'react';
import * as jwtDecode from 'jwt-decode'; // import everything
import UserContext from './UserContext';

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode.default(token); // call default
        setUser(decoded);
      } catch (err) {
        console.error("Token decode failed:", err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
