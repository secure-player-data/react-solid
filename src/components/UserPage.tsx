import { useContext, useEffect, useState } from "react";
import {
  addStringNoLocale,
  addUrl,
  createSolidDataset,
  createThing,
  getPodUrlAll,
  getSolidDataset,
  getStringNoLocale,
  getThingAll,
  saveSolidDatasetAt,
  setThing,
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { AuthContext } from "../context/AuthContext";
import { SCHEMA_INRUPT, RDF, AS } from "@inrupt/vocab-common-rdf";

export default function UserPage() {
  const { user, signOut } = useContext(AuthContext);
  const [pods, setPods] = useState<string[]>([]);
  const [selectedPod, setSelectedPod] = useState<string | null>(null);
  const [readingList, setReadingList] = useState<(string | null)[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      getPods();
    }
  }, []);

  useEffect(() => {
    if (selectedPod) {
      fetchReadingList();
    }
  }, [selectedPod]);

  const readingListUrl = (pod: string) => `${pod}/reading-list`;

  async function getPods() {
    const pods = await getPodUrlAll(user!.webID, { fetch: fetch });
    setPods(pods);
  }

  async function fetchReadingList() {
    if (!selectedPod) return;

    try {
      const readingList = await getSolidDataset(readingListUrl(selectedPod), {
        fetch: fetch,
      });

      const items = getThingAll(readingList).map((item) =>
        getStringNoLocale(item, SCHEMA_INRUPT.name)
      );
      setReadingList(items);
    } catch (err) {
      console.log(err);
    }
  }

  async function addToReadingList() {
    setError("");

    if (!selectedPod) {
      setError("Please select a pod before writing...");
      return;
    }

    if (input.trim() === "") {
      setError("Field cannot be empty...");
      return;
    }

    let myReadingList;
    try {
      myReadingList = await getSolidDataset(readingListUrl(selectedPod), {
        fetch: fetch,
      });
    } catch (err) {
      myReadingList = createSolidDataset();
    }

    let item = createThing({ name: input });
    item = addUrl(item, RDF.type, AS.Article);
    item = addStringNoLocale(item, SCHEMA_INRUPT.name, input);
    myReadingList = setThing(myReadingList, item);

    try {
      const savedReadingList = await saveSolidDatasetAt(
        readingListUrl(selectedPod),
        myReadingList,
        { fetch: fetch }
      );
      const updatedReadingList = getThingAll(savedReadingList);
      const mappedReadingList = updatedReadingList.map((item) =>
        getStringNoLocale(item, SCHEMA_INRUPT.name)
      );

      setReadingList(mappedReadingList);
    } catch (err) {
      console.log(err);
    }
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
          {readingList.map((item) => {
            return item && <li key={item}>{item}</li>;
          })}
        </ul>
      </div>

      <div>
        <h2>Add item to reading list</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What to read..."
          />
          <button onClick={addToReadingList}>Add</button>
          {error && <p>{error}</p>}
        </form>
      </div>
    </>
  );
}
