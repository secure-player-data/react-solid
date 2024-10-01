import { PodSpaces, useAuth } from "./hooks/useAuth";

function App() {
  const { user, signIn, signOut } = useAuth();

  if (!user)
    return (
      <button onClick={() => signIn(PodSpaces)}>Login with PodSpaces</button>
    );

  return (
    <div>
      <h1>Seecure Player Data - React + Solid Protocol</h1>
      <p>Welcome: {user.webID}</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}

export default App;
