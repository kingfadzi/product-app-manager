import React, { createContext, useState, useContext } from 'react';

// Demo users matching mock data productOwners/systemArchitects
const demoUsers = [
  { id: 'user-1', name: 'Jane Williams', email: 'jane.williams@example.com', initials: 'JW' },
  { id: 'user-2', name: 'Sarah Connor', email: 'sarah.connor@example.com', initials: 'SC' },
  { id: 'user-3', name: 'Tony Stark', email: 'tony.stark@example.com', initials: 'TS' },
  { id: 'admin', name: 'Admin User', email: 'admin@example.com', initials: 'AD', isAdmin: true },
];

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(demoUsers[0]);

  const switchUser = (userId) => {
    const user = demoUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const isMyApp = (app) => {
    if (currentUser.isAdmin) return true;
    return (
      app.productOwner === currentUser.name ||
      app.systemArchitect === currentUser.name
    );
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      demoUsers,
      switchUser,
      isMyApp,
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
