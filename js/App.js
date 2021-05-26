class App {
  constructor() {
    this.$app = document.querySelector('#app')
    this.render()
    this.setup()
  }


  static todo = []


  setup() {
    this.submit = document.querySelector('#task-submit')
    this.output = document.querySelector('#task-output')
    this.input  = document.querySelector('#task-input')

    this.output.addEventListener('click', this.actionTask.bind(this))
    this.submit.addEventListener('click', this.createTask.bind(this))
  }


  render() {
    this.$app.innerHTML = `
      <div class="app__inner">
        <div class="app__head">
          <h1 class="app__head-title">TODO-LIST</h1>
          <p class="app__head-descr">Создайте задачу прямо сейчас!</p>
        </div>
        <div class="app__body">
          <ul class="task-list" id="task-output"></ul>
          <div class="task-create">
            <input class="input-transparent task-create__input" id="task-input" placeholder="Описание задачи" type="text"/>
            <button class="button-blue task-create__submit" id="task-submit">Создать</button>
          </div>
        </div>
      </div>
    `
  }


  listRender() {
    if (App.todo.length > 0) {
      let html = ''

      for (let task of App.todo) {
        html += task.render()
      }

      this.output.innerHTML = html;
    }
  }


  actionTask(event) {
    if (event.target.closest('.task-item') && event.target.hasAttribute('data-task-button')) {
      const item = event.target.closest('.task-item')
      const text = item.querySelector('.task-item__content').value
      const task = App.todo.find((task) => task.descr === text)
      const data = event.target.getAttribute('data-task-button')

      const isRender = task[data](event.target)

      if (isRender) this.listRender() 
    }
  }


  createTask() {
    const task = new Task({
      descr: this.input.value,
      check: false,
    })
    App.todo.push(task)
    this.clearInput()
    this.listRender()
  }


  clearInput() {
    this.input.value = ''
  }
}