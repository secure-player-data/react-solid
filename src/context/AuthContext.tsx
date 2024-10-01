import { login, logout } from "@inrupt/solid-client-authn-browser";
import { createContext, ReactNode, useState } from "react";

type Props = {
  children?: ReactNode;
};

type User = {
  webID: string;
  sessionId: string;
  clientId: string;
};

type Provider = {
  label: string;
  issuer: string;
};

export const PodSpaces = {
  label: "PodSpaces",
  issuer: "https://login.inrupt.com",
} as Provider;

type IAuthContext = {
  user: User | null;
  signIn: (provider: Provider) => void;
  signOut: () => void;
  onCallback: (user: User) => void;
};

const LOCAL_STORAGE_KEY = "user";

const initialValue = {
  user: localStorage.getItem(LOCAL_STORAGE_KEY)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!)
    : null,
  signIn: (_: Provider) => {},
  signOut: () => {},
  onCallback: (_: User) => {},
};

const AuthContext = createContext<IAuthContext>(initialValue);

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(initialValue.user);

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
    setUser(null);
  };

  const onCallback = (user: User) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, onCallback }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
