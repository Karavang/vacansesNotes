import { invoke } from "@tauri-apps/api";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [totalValue, setTotalValue] = useState(0);
  const [isContain, setIsContain] = useState(false);
  const [listText, setList] = useState([]);
  const total = async () =>
    setTotalValue(await invoke("count_elements").catch(console.error));

  const contains_text = async () =>
    setIsContain(
      await invoke("contains_text", { searchText: note }).catch(console.error),
    );

  const listNotes = async () =>
    setList(await invoke("list_text").catch(console.error));
  const newNote = async (e) => {
    e.preventDefault();
    if (!isContain) {
      await invoke("new_note", { link: note });
    }
    total();
    listNotes();
    contains_text();
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
    listNotes();
    total();
  }, []);

  useEffect(() => {
    contains_text(note);
  }, [note]);

  return (
    <>
      <h1>Notes with uniqueness check</h1>
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
        <div className="totalAndList">
          <p>Total: {totalValue ? totalValue : 0}</p>
          <ul className="totalAndlistUl">
            {listText
              ? listText.map((e) => (
                  <li
                    key={e}
                    className="totalAndlistUlLi"
                  >
                    {e}
                  </li>
                ))
              : "Now that's empty"}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
