const listsContainer = document.querySelector("[data-lists]");
const listDisplayContainer = document.querySelector(
  "[data-list-display-container]"
);
const listTitleElement = document.querySelector("[data-list-title]");
const listItemsContainer = document.querySelector("[data-list-items]");
const uncheckedListItemsCountElement = document.querySelector(
  "[data-unchecked-list-items-count]"
);

// List items stuff

const newListItemForm = document.querySelector("[data-new-list-item-form]");
const newListItemInput = document.querySelector("[data-new-list-item-input]");

newListItemForm.addEventListener("submit", (e) => {

  e.preventDefault();
  const newListItemDescription = newListItemInput.value;
  // Check a name was entered
  if (newListItemDescription == null || newListItemDescription === "") return;

  // Create the new list and push it to the lists array.
  const newListItem = new ListItem(newListItemDescription);
  console.log(selectedList)

  // Clear the new list input
  newListItemInput.value = null;

  // Render all the lists
  saveAndRender();
});


function renderSelectedListItems(selectedList) {
  // Create list item element for each list item in "list.listItems" and append to "listItemsContainer"
  const listItemTemplate = document.querySelector("[data-list-item-template]");
  selectedList.listItems.forEach((listItem) => {
    // Create list item element
    const listItemElement = document
      .importNode(listItemTemplate.content, true)
      .querySelector("li");

    const listItemElementCheckbox = listItemElement.querySelector(
      "input[type='checkbox']"
    );
    const listItemElementLabel = listItemElement.querySelector("label");

    listItemElementCheckbox.id = listItem.id;
    listItemElementCheckbox.checked = listItem.checked;
    listItemElementLabel.innerText = listItem.description;

    listItemsContainer.appendChild(listItemElement);
  });
}

function renderUncheckedListItemsCount(selectedList) {
  const uncheckedListItemsCount = selectedList.listItems.filter(
    (listItem) => !listItem.checked
  ).length;
  const uncheckedListItemsStr =
    uncheckedListItemsCount === 1 ? "item" : "items";
  uncheckedListItemsCountElement.innerText = `${uncheckedListItemsCount} ${uncheckedListItemsStr}`;
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
