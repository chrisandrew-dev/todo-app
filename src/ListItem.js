class ListItem {
  constructor(descriptionStr) {
    this.description = descriptionStr;
    this.checked = false;
    this.id = Date.now().toString();
  }
}

export default ListItem;