import { useContext } from "react";
import UserPage from "./components/UserPage";
import { AuthContext, PodSpaces } from "./context/AuthContext";

function App() {
  const { user, signIn } = useContext(AuthContext);

  if (!user)
    return (
      <button onClick={() => signIn(PodSpaces)}>Login with PodSpaces</button>
    );

  return (
    <div>
      <h1>Seecure Player Data - React + Solid Protocol</h1>
      <UserPage />
    </div>
  );
}

export default App;
