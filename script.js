import List from "./src/List.js";
import ListItem from "./src/ListItem.js";

// DATA
const LOCAL_STORAGE_LISTS_KEY = "liistsApp.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "liistsApp.listItems";

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LISTS_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

// EVENT LISTENERS
// New list form events
const newListForm = document.querySelector("[data-new-list-form]");
newListForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newListInput = document.querySelector("[data-new-list-input]");
  const newListName = newListInput.value;

  if (newListName == null || newListName === "") return;
  newListInput.value = null;

  const newList = new List(newListName);
  lists.push(newList);
  selectedListId = newList.id;

  save();
  render();
});

// Lists container events
const listsContainer = document.querySelector("[data-lists]");

listsContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    save();
    render();
  }
});

// New list item form events
const newListItemForm = document.querySelector("[data-new-list-item-form]");
newListItemForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newListItemInput = document.querySelector("[data-new-list-item-input]");
  const newListItemDesc = newListItemInput.value;

  if (newListItemDesc == null || newListItemDesc === "") return;
  newListItemInput.value = null;

  const selectedList = lists.find((list) => list.id === selectedListId);
  const newListItem = new ListItem(newListItemDesc);
  selectedList.items.push(newListItem);

  save();
  render();
});

// List item events
const listItemsContainer = document.querySelector("[data-list-items]");
listItemsContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const item = selectedList.items.find((item) => item.id === e.target.id);
    item.checked = e.target.checked;
    save();
    renderSelectedList(selectedList);
  }
});

// Clear Completed button events
const clearCheckedBtn = document.querySelector("[data-clear-checked-btn]");
clearCheckedBtn.addEventListener("click", (e) => {
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.items = selectedList.items.filter((item) => !item.checked);

  save();
  render();
});

// Delete List button events
const deleteListBtn = document.querySelector("[data-delete-list-btn]");
deleteListBtn.addEventListener("click", (e) => {
  lists = lists.filter((list) => list.id != selectedListId);
  lists.length ? (selectedListId = lists[0].id) : (selectedListId = null);

  save();
  render();
});

// Filter button events
const filtersContainer = document.querySelector("[data-filters]");
filtersContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "button") {
    const selectedList = lists.find((list) => list.id === selectedListId);
    selectedList.filter = e.target.innerText;
    renderSelectedList(selectedList);
  }
});

// PERSISTENCE LOGIC
// Save to local storage to persist lists
function save() {
  localStorage.setItem(LOCAL_STORAGE_LISTS_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

// RENDERING LOGIC
function render() {
  const listDisplayContainer = document.querySelector(
    "[data-list-display-container]"
  );

  renderLists();

  if (selectedListId == null) {
    listDisplayContainer.style.display = "none";
  } else {
    const selectedList = lists.find((list) => list.id === selectedListId);
    listDisplayContainer.style.display = "";

    renderSelectedList(selectedList);
  }
}

function clear(node) {
  while (node.hasChildNodes()) {
    node.removeChild(node.firstChild);
  }
}

function renderLists() {
  clear(listsContainer);
  lists.forEach((listObj) => {
    const listElement = createListElement(listObj);
    listsContainer.appendChild(listElement);
  });
}

function renderSelectedList(selectedList) {
  clear(listItemsContainer);

  const listTitleElement = document.querySelector("[data-list-title]");
  listTitleElement.innerText = selectedList.name;

  renderSelectedListItems(selectedList);
  renderSelectedListUncheckedCount(selectedList);
}

function renderSelectedListItems(selectedList) {
  const listItemsToRender = applyFilter(selectedList);
  renderFilteredListItems(listItemsToRender);
}

function applyFilter(selectedList) {
  switch (selectedList.filter) {
    case "Active":
      return [selectedList.items.filter((item) => !item.checked)];
      break;
    case "Completed":
      return [selectedList.items.filter((item) => item.checked)];
      break;
    default:
      return [
        selectedList.items.filter((item) => !item.checked),
        selectedList.items.filter((item) => item.checked)
      ]
  }
}

function renderFilteredListItems(filteredItemsArr) {
  filteredItemsArr.forEach((itemGroup) =>
    itemGroup.forEach((item) => {
      const itemElement = createListItemElement(item);
      listItemsContainer.appendChild(itemElement);
    })
  );
}

function renderSelectedListUncheckedCount(selectedList) {
  const countElement = document.querySelector(
    "[data-unchecked-list-items-count]"
  );
  const uncheckedItems = selectedList.items.filter((item) => !item.checked);
  const noun = uncheckedItems.length === 1 ? "item" : "items";
  countElement.innerText = `${uncheckedItems.length} ${noun}`;
}

// HTML generation functions
function createListElement(listObj) {
  const template = document.querySelector("[data-list-template]");
  const listElement = document.importNode(template.content, true);
  listElement.querySelector("li").innerText = listObj.name;
  listElement.querySelector("li").dataset.listId = listObj.id;

  if (lists.length === 1) {
    listElement.querySelector("li").className = "active";
    selectedListId = listObj.id;
  } else if (selectedListId === listObj.id) {
    listElement.querySelector("li").className = "active";
  }

  return listElement;
}

function createListItemElement(item) {
  const template = document.querySelector("[data-list-item-template]");
  const itemElement = document.importNode(template.content, true);

  const label = itemElement.querySelector("label");
  label.append(item.description);
  label.htmlFor = item.id;

  const checkbox = itemElement.querySelector("input[type='checkbox']");
  checkbox.checked = item.checked;
  checkbox.id = item.id;

  return itemElement;
}

// RUN ON LOAD
render();
