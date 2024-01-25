import { useEffect, useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api";
function App() {
  const [note, setNote] = useState("");
  const total = async () => {
    return await invoke("count_elements");
  };
  const newNote = async () => {
    return await invoke("new_note", { link: note });
  };
  useEffect(() => {
    total();
  }, []);
  return (
    <>
      <h1>My checked vacances</h1>
      <div className="flexator">
        <div>
          <input
            type="text"
            onChange={(e) => setNote(e.target.value)}
          />
          <button onClick={newNote}>Save</button>
        </div>
        <p>Total: {total}</p>
      </div>
    </>
  );
}

export default App;
