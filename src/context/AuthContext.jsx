/* eslint-disable react/prop-types */
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import Loading from "../components/Loading";
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        getDoc(doc(db, "users", user.uid)).then((docSnap) => {
          if (docSnap.exists) {
            setCurrentUser(docSnap.data());
          }
        });
      }
      setUser(user);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const value = { user, currentUser };

  if (loading) return <Loading />;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
