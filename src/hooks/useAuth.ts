import { useEffect, useState } from "react";
import { login, logout } from "@inrupt/solid-client-authn-browser";

export type User = {
  webID: string;
  sessionId: string;
  clientId: string;
};

export type Provider = {
  label: string;
  issuer: string;
};

export const PodSpaces = {
  label: "PodSpaces",
  issuer: "https://login.inrupt.com",
} as Provider;

const LOCAL_STORAGE_KEY = "user";

export const useAuth = () => {
  const [user, _setUser] = useState<User | null>(null);

  // Initialize user from local storage
  useEffect(() => {
    const user = localStorage.getItem(LOCAL_STORAGE_KEY);
    console.log(`User init from ${window.location.href}:`, user);
    if (user) {
      _setUser(JSON.parse(user));
    }
  }, []);

  const onCallback = (user: User) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    _setUser(user);
  };

  const signIn = (provider: Provider) => {
    login({
      oidcIssuer: provider.issuer,
      redirectUrl: new URL("/auth/callback", window.location.href).toString(),
      clientName: "Secure Player Data",
    });
  };

  const signOut = () => {
    logout({
      logoutType: "app",
    });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    _setUser(null);
  };

  return { user, signIn, signOut, onCallback };
};
