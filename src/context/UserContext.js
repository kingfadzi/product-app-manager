import React, { createContext, useState, useContext } from 'react';

// Demo users matching mock data productOwners/systemArchitects
const demoUsers = [
  { id: 'guest', name: null, isGuest: true },
  { id: 'user-1', name: 'Jane Williams', email: 'jane.williams@example.com', initials: 'JW', tc: 'tc-7' },
  { id: 'user-2', name: 'Sarah Connor', email: 'sarah.connor@example.com', initials: 'SC', tc: 'tc-1' },
  { id: 'user-3', name: 'Tony Stark', email: 'tony.stark@example.com', initials: 'TS', tc: 'tc-7' },
];

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(demoUsers[0]); // Start as guest

  const switchUser = (userId) => {
    const user = demoUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const isMyApp = (app) => {
    if (currentUser.isGuest) return true; // Guest sees all
    return (
      app.productOwner === currentUser.name ||
      app.systemArchitect === currentUser.name
    );
  };

  const isLoggedIn = !currentUser.isGuest;

  return (
    <UserContext.Provider value={{
      currentUser,
      demoUsers,
      switchUser,
      isMyApp,
      isLoggedIn,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;
