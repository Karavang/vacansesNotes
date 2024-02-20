import { invoke } from "@tauri-apps/api";
import { useState, useEffect } from "react";
import "./App.css";
import { Modal } from "./Modal";

function App() {
  const [note, setNote] = useState("");
  const [mot, setMot] = useState("");
  const [totalValue, setTotalValue] = useState(0);
  const [isContain, setIsContain] = useState(false);
  const [listText, setList] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [liForModal, setLiForModal] = useState({});
  const [sorting, setSorting] = useState("");
  const total = async () =>
    setTotalValue(await invoke("count_elements").catch(console.error));
  const openBrowserAndLink = async (e) => {
    console.log(e);
    await invoke("redirection", { link: e }).catch(console.error);
  };

  const contains_text = async () =>
    setIsContain(
      await invoke("contains_text", { searchText: note }).catch(console.error),
    );

  const listSorting = async () =>
    setList(
      await invoke("filtred_list", {
        searchText: sorting,
      }).catch(console.error),
    );

  const listNotes = async () => {
    setList(await invoke("list_text").catch(console.error));
  };
  const newNote = async () => {
    if (!isContain) {
      await invoke("new_note", { link: note, motivation: mot });
    }
    total();
    listNotes();
    contains_text();
  };
  const motivationModal = async (e) => {
    console.log(e);
    setIsModal(true);
    setLiForModal(e);
  };
  useEffect(() => {
    if (sorting !== "") {
      listSorting();
    } else {
      listNotes();
    }
  }, [sorting]);
  useEffect(() => {
    const inputVac = document.getElementById("input-vac");
    const motivation = document.getElementById("input-mot");
    const buttonVac = document.getElementById("button-vac");
    if (isContain) {
      inputVac.style.borderColor = "green";
      buttonVac.setAttribute("disabled", "true");
      motivation.setAttribute("disabled", "true");
    } else {
      inputVac.style.borderColor = "red";
      buttonVac.removeAttribute("disabled");
      motivation.removeAttribute("disabled");
    }
  }, [isContain]);
  useEffect(() => {
    listNotes();
    total();
  }, []);

  useEffect(() => {
    contains_text(note);
  }, [note]);
  const reverseIsModal = () => {
    setIsModal(!isModal);
  };
  return (
    <>
      <h1>Notes with uniqueness check</h1>
      <div className="flexator">
        <form onSubmit={newNote}>
          <input
            id="input-vac"
            type="text"
            placeholder="Link"
            onChange={(e) => {
              const value = e.target.value;
              setNote(value);
            }}
          />
          <input
            id="input-mot"
            type="text"
            placeholder="Motivation list"
            onChange={(e) => {
              const value = e.target.value;
              setMot(value);
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
          <div>
            <input
              type="text"
              id="sorterByLink"
              onChange={(e) => setSorting(e.target.value)}
            />
            <ul className="totalAndlistUl">
              {listText
                ? listText.map((e, index) => (
                    <li
                      key={index}
                      className="totalAndlistUlLi"
                      onClick={() => motivationModal(e)}
                    >
                      {e.link}
                    </li>
                  ))
                : "Now that's empty"}
            </ul>
          </div>
        </div>
      </div>
      {isModal && (
        <Modal
          data={liForModal}
          setIsModal={reverseIsModal}
          openBrowserAndLink={openBrowserAndLink}
        />
      )}
    </>
  );
}

export default App;
