/* API for interacting with Localstorage  in web browser */
function generateUniqueId() {
  return (
    Math.random()
      .toString(36)
      .substring(2) + Date.now().toString(36)
  );
}

function saveNote(note) {
  let id = note.id;
  if (!id) {
    id = generateUniqueId();
  }
  let currentNotes = JSON.parse(window.localStorage.getItem("notes")) || {};
  currentNotes[id] = { ...note, id };
  window.localStorage.setItem("notes", JSON.stringify(currentNotes));
  return id;
}

function getNoteById(id) {
  let currentNotes = JSON.parse(window.localStorage.getItem("notes"));
  return currentNotes[id];
}

function getAllNotes() {
  return JSON.parse(window.localStorage.getItem("notes")) || {};
}

function deleteNote(id) {
  let currentNotes = JSON.parse(window.localStorage.getItem("notes"));
  delete currentNotes[id];
  window.localStorage.setItem("notes", JSON.stringify(currentNotes));
}

/* Method to render all the notes to DOM available in the browser's localStorage */
function addNotesToDOM() {
  const notes = getAllNotes();
  // const allNotesDiv = document.createElement('div');
  const allNotesFragment = document.createDocumentFragment();
  Object.keys(notes).forEach(key => {
    const currentNote = notes[key];
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");

    const editBtn = document.createElement("span");
    editBtn.classList.add("close-button");
    editBtn.innerHTML = "&#10000;";
    editBtn.addEventListener("click", function() {
      editNote(currentNote);
    });

    const closeBtn = document.createElement("span");
    closeBtn.classList.add("close-button");
    closeBtn.innerHTML = "&#10006;";
    closeBtn.addEventListener("click", function() {
      deleteNote(currentNote.id);
      reRenderNotes();
    });
    const title = document.createElement("h4");
    title.appendChild(document.createTextNode(currentNote.title));
    const description = document.createElement("p");
    description.appendChild(document.createTextNode(currentNote.description));

    noteDiv.appendChild(closeBtn);
    noteDiv.appendChild(editBtn);

    noteDiv.appendChild(title);
    noteDiv.appendChild(description);
    noteDiv.style.backgroundColor = currentNote.color;

    allNotesFragment.appendChild(noteDiv);
  });
  document.getElementById("all-notes").appendChild(allNotesFragment);
}

/* Method to remove all the notes from DOM and then re-render all the notes available in the browser's localStorage */
function reRenderNotes() {
  const allNotes = document.querySelectorAll(".note");
  allNotes.forEach(node => {
    node.remove();
  });
  addNotesToDOM();
}

addNotesToDOM();

/* API for showing and hiding the Modal for adding/editing a note */
const modal = document.querySelector(".modal");
function showModal() {
  modal.classList.add("show-modal");
}
function closeModal() {
  modal.classList.remove("show-modal");
}
const closeButton = document.querySelector("#close-modal-btn");
closeButton.addEventListener("click", function() {
  resetModal();
  closeModal();
});

function resetModal() {
  document.getElementById("noteId").value = null;
  document.getElementById("new-note-title").value = "";
  document.getElementById("new-note-description").value = "";
  document.getElementById("new-note-save").innerHTML = "Add";
  document.getElementById("new-note-modal-heading").innerHTML = "Add new note";
  document.getElementById("noteColor").value = "lightpink";
  setColor("lightpink");
}

function editNote(note) {
  document.getElementById("noteId").value = note.id;
  document.getElementById("new-note-title").value = note.title;
  document.getElementById("new-note-description").value = note.description;
  document.getElementById("new-note-save").innerHTML = "Save";
  document.getElementById("new-note-modal-heading").innerHTML = "Edit note";
  setColor(note.color);
  modal.classList.add("show-modal");
}

function setColor(color) {
  const allColorOptions = document.querySelectorAll(".colorOption");
  allColorOptions.forEach(node => {
    node.classList.remove("selected");
  });
  document.getElementById(`color-${color}`).classList.add("selected");
}

/* Event listeners for:
  1. Add new note link 
  2. "Save or edit a note" button in the modal
  3. "Cancel adding/editing a note" button in the modal
  4. Selecting a color for the  note in the modal
*/
document.getElementById("add-new-note").addEventListener("click", function() {
  showModal();
  document.getElementById("new-note-title").focus();
});

document.getElementById("new-note-save").addEventListener("click", function() {
  const newNoteTitle = document.getElementById("new-note-title").value;
  const newNoteDesc = document.getElementById("new-note-description").value;
  const noteColor = document.getElementById("noteColor").value;
  const noteId = document.getElementById("noteId").value;
  if (!newNoteTitle && !newNoteDesc) {
    window.alert("Please enter title and description for the new note.");
    return false;
  } else {
    let note = {
      title: newNoteTitle,
      description: newNoteDesc,
      color: noteColor
    };
    if (noteId) {
      note.id = noteId;
    }
    saveNote(note);
    resetModal();
    reRenderNotes();
    closeModal();
  }
});

document
  .getElementById("new-note-cancel")
  .addEventListener("click", function() {
    resetModal();
    closeModal();
  });

document
  .querySelector(".allColorOptions")
  .addEventListener("click", function(event) {
    if (event.target.id) {
      const selectedColor = event.target.id.split("-")[1];
      document.getElementById("noteColor").value = selectedColor;
      setColor(selectedColor);
    }
  });
