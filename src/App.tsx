import { useAuth } from "./hooks/useAuth";

function App() {
  const { user, signIn } = useAuth();

  if (!user) return <button onClick={signIn}>Login</button>;

  return (
    <div>
      <h1>Seecure Player Data - React + Solid Protocol</h1>;
      <p>Welcome: {user.webID}</p>
    </div>
  );
}

export default App;
