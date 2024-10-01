import { useContext, useEffect, useState } from "react";
import { getPodUrlAll } from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { AuthContext } from "../context/AuthContext";

export default function UserPage() {
  const { user, signOut } = useContext(AuthContext);
  const [pods, setPods] = useState<string[]>([]);
  const [selectedPod, setSelectedPod] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getPods();
    }
  }, []);

  useEffect(() => {
    console.log("Selected pod:", selectedPod);
  }, [selectedPod]);

  async function getPods() {
    const pods = await getPodUrlAll(user!.webID, { fetch: fetch });
    setPods(pods);
  }

  return (
    <>
      <p>Welcome: {user?.webID}</p>
      <button onClick={signOut}>Sign out</button>

      <div>
        <h2>Select pod</h2>
        <select
          onChange={(e) =>
            e.target.value !== ""
              ? setSelectedPod(e.target.value)
              : setSelectedPod(null)
          }
        >
          <option value="">Select pod</option>
          {pods.map((pod) => (
            <option key={pod} value={pod}>
              {pod}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h2>Reading list</h2>
        <ul>
          {pods.map((pod) => {
            return <li key={pod}>{pod}</li>;
          })}
        </ul>
      </div>

      <div>
        <h2>Add item to reading list</h2>
        <form>
          <textarea placeholder="What to read..." />
          <button>Add</button>
        </form>
      </div>
    </>
  );
}
