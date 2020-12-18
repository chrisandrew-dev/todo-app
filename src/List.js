class List {
  constructor(name) {
    this.name = name;
    this.items = [];
    this.id = Date.now().toString();
    this.filter = "All";
  }
}

export default List;
