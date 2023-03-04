// decalring variables
const listTitle = document.getElementById("listTitle");
const todoList = document.getElementById("todoList");
const addButtonList = document.getElementById("addButtonList");
const addButton = document.getElementById("addButton");
const addButtonInput = document.getElementById("addButtonInput");
const selectAllBox = document.getElementById("selectAllBox");
const deleteItemButton = document.getElementById("deleteItemButton");
const saveButton = document.getElementById("saveButton");
const loadButton = document.getElementById("loadButton");
const saveAsJsonButton = document.getElementById("saveAsJsonButton");
const loadFromJsonButton = document.getElementById("loadFromJsonButton");
const moveUpButton = document.getElementById("moveUpButton");
const moveDownButton = document.getElementById("moveDownButton");

// initial loading
window.addEventListener("load", () => {
  load();
});

// some functions
//   creating new item
const createNewListItem = (name) => {
  const newItem = document.createElement("li");
  const checkBox = document.createElement("input");
  const span = document.createElement("span");
  checkBox.name = "item";
  checkBox.type = "checkbox";
  span.textContent = name;
  span.contentEditable = true;
  span.className = "name";
  span.onblur = removeIfEmpty;
  newItem.className = "item";
  newItem.append(checkBox, span);
  return newItem;
};

//   removing empty item
const removeIfEmpty = (event) => {
  if (event.target.textContent === "") {
    event.target.parentElement.remove();
  }
  save();
};

// adding items to list
const addItem = () => {
  const itemName = addButtonInput.value;
  if (!itemName) {
    return;
  }
  const newItem = createNewListItem(itemName);
  todoList.appendChild(newItem);
  addButtonInput.value = "";
  save();
};

addButton.addEventListener("click", addItem);
addButtonInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    addItem();
  }
});

// selecting all items in the list
selectAllBox.addEventListener("change", () => {
  const items = document.querySelectorAll("input[name=item]");
  items.forEach((ele) => (ele.checked = selectAllBox.checked));
});

// deleting selected items
deleteItemButton.addEventListener("click", () => {
  const selectedItems = document.querySelectorAll(
    "li > input[name=item]:checked"
  );
  selectedItems.forEach((ele) => ele.parentElement.remove());
  save();
});

// saving list
const save = () => {
  localStorage.clear();
  const listItems = document.querySelectorAll("li.item span.name");
  listItems.forEach((ele, key) => {
    localStorage.setItem(`list${key}`, ele.textContent);
  });
  localStorage.setItem("listTitle", listTitle.textContent);
};

const saveAsJson = () => {
  const obj = new Object();
  obj.title = listTitle.textContent;
  obj.items = [];
  document.querySelectorAll("li.item span.name").forEach((ele) => {
    obj.items.push({ name: ele.textContent });
  });
  const json = JSON.stringify(obj);
  console.log(json);
  console.log(obj);
  const blob = new Blob([json], { type: ".json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download =
    listTitle.textContent.toLowerCase().split(/ +/).join("-") + ".json";

  const mouseEvent = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
  });

  anchor.dispatchEvent(mouseEvent);
};

// loading list
const load = () => {
  document
    .querySelectorAll("input[name=item]")
    .forEach((ele) => ele.parentElement.remove());
  listTitle.textContent =
    localStorage.getItem("listTitle") || "Click To Edit Title";
  let i = 0;
  while (true && i < 10) {
    const itemName = localStorage.getItem(`list${i}`);
    if (!itemName) {
      break;
    }
    todoList.appendChild(createNewListItem(itemName));
    i++;
  }
  if (i === 0) {
    todoList.appendChild(createNewListItem("Item"));
  }
};

const loadFromJson = () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";
  fileInput.addEventListener("change", async (e) => {
    document
      .querySelectorAll("input[name=item]")
      .forEach((ele) => ele.parentElement.remove());
    const file = e.target.files[0];
    const text = await file.text();
    console.log(text);
    const parsedObj = JSON.parse(text);
    console.log(parsedObj);
    listTitle.textContent = parsedObj.title;
    parsedObj.items.forEach((obj) => {
      todoList.appendChild(createNewListItem(obj.name));
    });
  });
  fileInput.click();
};

// setting saving and loading event listener
saveButton.addEventListener("click", save);
saveAsJsonButton.addEventListener("click", saveAsJson);
loadButton.addEventListener("click", load);
loadFromJsonButton.addEventListener("click", loadFromJson);

// moving items up
moveUpButton.addEventListener("click", () => {
  document.querySelectorAll("input[name=item]:checked").forEach((ele) => {
    todoList.insertBefore(
      ele.parentElement,
      ele.parentElement.previousElementSibling
    );
  });
  save();
});

// moving items down
moveDownButton.addEventListener("click", () => {
  Array.prototype.slice
    .call(document.querySelectorAll("input[name=item]:checked"))
    .reverse()
    .forEach((ele) => {
      try {
        todoList.insertBefore(
          ele.parentElement,
          ele.parentElement.nextElementSibling.nextElementSibling
        );
      } catch {
        todoList.insertBefore(ele.parentElement, todoList.firstChild);
      }
    });
  save();
});
