import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Check user role in Firestore
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            // Default role for new users
            const defaultRole = currentUser.email === 'gopalzone2025@gmail.com' ? 'admin' : 'user';
            await setDoc(doc(db, 'users', currentUser.uid), {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: defaultRole,
            });
            setRole(defaultRole);
          }
        } catch (error) {
          console.error("Auth Firestore Error:", error);
          if (error instanceof Error && (error.message.includes('Quota') || error.message.includes('quota'))) {
            window.dispatchEvent(new CustomEvent('firestore-quota-exceeded'));
          }
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = role === 'admin' || user?.email === 'gopalzone2025@gmail.com';

  return (
    <AuthContext.Provider value={{ user, role, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
