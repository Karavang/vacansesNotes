import { invoke } from "@tauri-apps/api";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [totalValue, setTotalValue] = useState(0);
  const [isContain, setIsContain] = useState(false);
  const total = async () =>
    setTotalValue(await invoke("count_elements").catch(console.error));

  const contains_text = async () =>
    setIsContain(
      await invoke("contains_text", { searchText: note }).catch(console.error),
    );

  const newNote = async (e) => {
    e.preventDefault();
    await invoke("new_note", { link: note });
    total();
  };

  useEffect(() => {
    const inputVac = document.getElementById("input-vac");
    const buttonVac = document.getElementById("button-vac");
    if (isContain) {
      inputVac.style.borderColor = "green";
      buttonVac.setAttribute("disabled", "true");
    } else {
      inputVac.style.borderColor = "red";
      buttonVac.removeAttribute("disabled");
    }
  }, [isContain]);
  useEffect(() => {
    total();
  }, []);

  useEffect(() => {
    contains_text(note);
  }, [note]);

  return (
    <>
      <h1>My checked vacances</h1>
      <div className="flexator">
        <form onSubmit={newNote}>
          <input
            id="input-vac"
            type="text"
            onChange={(e) => {
              const value = e.target.value;
              setNote(value);
            }}
          />
          <button
            type="submit"
            id="button-vac"
          >
            Save
          </button>
        </form>
        <p>Total: {totalValue}</p>
      </div>
    </>
  );
}

export default App;
