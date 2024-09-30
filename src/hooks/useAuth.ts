import { useEffect, useState } from "react";
import { login } from "@inrupt/solid-client-authn-browser";

export type User = {
  webID: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  // Initialize user from local storage
  useEffect(() => {
    const webID = localStorage.getItem("webID");
    if (webID) {
      setUser({ webID });
    }
  }, []);

  const signIn = () => {
    throw new Error("Not implemented");
  };

  const signOut = () => {
    throw new Error("Not implemented");
  };

  return { user, signIn, signOut };
};
