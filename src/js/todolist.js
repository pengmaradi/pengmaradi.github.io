import Alpine from 'alpinejs'

Alpine.data('todolist', () => ({
  id: '',
  title: '',
  text: '',
  submit: 'add list',
  list: [{ id: 1, title: 'lorem ipsum', text: 'some description: lorem ipsum', done: true, hidden: false }],
  init() {

    this.$nextTick(() => {
      this.list = localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : []
    })

  },
  addTodo() {
    if (this.id) {
      // update title / text
      this.list.map(todo => {
        if (todo.id === this.id) {
          todo.title = this.title
          todo.text = this.text
          return { ...this.list, title: this.title, text: this.text }
        } else {
          return todo
        }
      })
      this.submit = 'add list'
    } else {
      if (this.title.trim().length) {
        const newTodo = { id: Date.now(), title: this.title.trim(), text: this.text.trim(), done: false, hidden: false }
        this.list.push(newTodo)
      }
    }

    this.title = ''
    this.text = ''
    this.id = ''
    this.saveTodos()
  },

  editTodo(todo) {
    console.log(todo)
    this.id = todo.id
    this.title = todo.title
    this.text = todo.text
    this.submit = 'Edit list'
  },

  toggleDone(id) {
    this.list.map(todo => {
      if (todo.id === id) {
        todo.done = !todo.done
        return { ...this.list, done: !todo.done }
      } else {
        return todo
      }
    })
    this.saveTodos()
  },

  saveTodos() {
    localStorage.setItem('list', JSON.stringify(this.list));
  },

  removeTodo(todo) {
    this.list = this.list.filter((x) => x != todo)
    this.saveTodos()
  }
}))