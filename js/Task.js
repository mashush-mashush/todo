class Task {
  constructor(options) {
    this.descr = options.descr
    this.check = options.check
  }


  execute(button) {
    return true
  }


  edit(button) {
    const task = button.closest('.task-item')
    const value = button.getAttribute('data-task-edit')
    const input = task.querySelector('.task-item__content')
    const controlButtons = task.querySelectorAll('.task-item__button')

    if (value === 'was changed') {
      button.textContent = 'Принять'
      button.setAttribute('data-task-edit','is changing now')
      input.removeAttribute('readonly')
      input.removeAttribute('disabled')

      controlButtons.forEach((controlButton) => {
        if (!controlButton.hasAttribute('data-task-edit')) {
          controlButton.setAttribute('disabled','')
        }
      })

      return false
    }

    if (value === 'is changing now') {
      button.textContent = 'Изменить'
      button.setAttribute('data-task-edit','was changed')
      input.setAttribute('readonly','')
      input.setAttribute('disabled','')

      controlButtons.forEach((controlButton) => {
        if (!controlButton.hasAttribute('data-task-edit')) {
          controlButton.removeAttribute('disabled')
        }
      })

      const check = button.classList.contains('task-item__button--done')
      const descr = input.value

      if (this.descr !== descr) {
        App.todo = App.todo.map((task) => {
          if (task === this) {
            return new Task({
              descr: descr,
              check: check
            })
          }
          return task
        })
      }

      return true
    }
  }


  remove(button) {
    const index = App.todo.findIndex((task) => task === this)
    App.todo.splice(index, 1)
    return true
  }


  render() {
    return `
      <li class="task-list__item task-item">
        <div class="task-item__body">
          <input class="input-transparent task-item__content" type="text" readonly disabled value="${this.descr}"/>
          <div class="task-item__control">
            <button class="button-blue task-item__button ${this.check ? 'task-item__button--done' : null}" data-task-button="execute">${this.check ? 'Выполнено' : 'Выполнить'}</button>
            <button class="button-blue task-item__button" data-task-button="edit" data-task-edit="was changed">Изменить</button>
            <button class="button-blue task-item__button" data-task-button="remove">Удалить</button>
          </div>
        </div>
      </li>
    `
  }
}