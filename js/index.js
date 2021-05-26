const todoSubmit = document.querySelector('#todo-submit')
const todoOutput = document.querySelector('#todo-output')
const todoInput  = document.querySelector('#todo-input')
const todoForm   = document.querySelector('#todo-form')
let todo = []


if (localStorage.getItem('todo')) {
  todo = JSON.parse(localStorage.getItem('todo'))
  todoToHTML()
}



function getUserData(event) {
  event.preventDefault()

  const descript = todoInput.value.trim()
  const isAright = descript.length > 0
  const isUnique = todo.findIndex((task) => task.descript === descript) === -1

  todoInput.value = ''

  if (isAright && isUnique) {
    
    const task = {
      descript: descript,
      status: false,
      edited: false,
    }
    
    todo.push(task)
    todoToHTML(true)

    return
  }

  if (!isUnique) return alert('Такая задача уже есть!')
  if (!isAright) return alert('Задача не может быть пустой!')
}


function todoToHTML(toKeep) {
  
  if (toKeep) {
    localStorage.setItem('todo', JSON.stringify(todo))
  }

  todoOutput.innerHTML = todo.length > 0
    ? todo.map((task) => taskToHTML(task)).join('')
    : '<div class="task-list__caption">У Вас пока нет задач...</div>'
}


function taskToHTML(task) {
  return `
    <li class="task-list__item task-item ${task.done ? 'task-item--done' : ''}">
      <div class="task-item__body">
        <input class="input-transparent task-item__content" type="text" ${task.edited ? '' : 'readonly disabled'} value="${task.descript}"/>
        <div class="task-item__control">
          <button class="button-blue task-item__button ${task.done ? 'task-item__button--done' : ''}" data-action="execute" data-execute="${task.done ? 'done' : 'not done'}" ${task.edited ? 'disabled' : ''}>${task.done ? 'Выполнено' : 'Выполнить'}</button>
          <button class="button-blue task-item__button" data-action="edit" data-edit="${task.edited ? 'accept' : 'edit'}">${task.edited ? 'Принять' : 'Изменить'}</button>
          <button class="button-blue task-item__button" data-action="remove" ${task.edited ? 'disabled' : ''}>Удалить</button>
        </div>
      </div>
    </li>
  `
}


function taskHandler(event) {
  if (event.target.hasAttribute('data-action')) {
    const func = event.target.getAttribute('data-action')
    const task = event.target.closest('.task-item')

    if (func === 'execute') taskExecute(task)
    if (func === 'remove')  taskRemove(task)
    if (func === 'edit')    taskEdit(task)
  }
}


function taskExecute(htmlTask) {
  const buttonExecute = htmlTask.querySelector('[data-action="execute"]')
  const statusExecute = buttonExecute.getAttribute('data-execute')
  const descript      = htmlTask.querySelector('.task-item__content').value
  const taskIndex     = todo.findIndex((task) => task.descript === descript)

  if (statusExecute === 'done') {
    todo.splice(taskIndex, 1, {
      descript: descript,
      edited: false,
      done: false,
    })
  }

  if (statusExecute === 'not done') {
    todo.splice(taskIndex, 1, {
      descript: descript,
      edited: false,
      done: true,
    })
  }

  todoToHTML(true)
}


function taskRemove(htmlTask) {
  const descript   = htmlTask.querySelector('.task-item__content').value
  const taskIndex  = todo.findIndex((task) => task.descript === descript)

  todo.splice(taskIndex, 1)

  todoToHTML(true)
}


function taskEdit(htmlTask) {
  const buttonEdit = htmlTask.querySelector('[data-action="edit"]')
  const statusEdit = buttonEdit.getAttribute('data-edit')
  const descript   = htmlTask.querySelector('.task-item__content').value
  const taskIndex  = todo.findIndex((task) => task.descript === descript)


  if (statusEdit === 'edit') {
    todo.splice(taskIndex, 1, {
      descript: descript,
      edited: true,
      done: false,
    })

    todoToHTML(false)
  }

  if (statusEdit === 'accept') {
    todo.splice(taskIndex, 1, {
      descript: descript,
      edited: false,
      done: false,
    })

    todoToHTML(true)
  }
}


todoSubmit.addEventListener('click', getUserData)
todoOutput.addEventListener('click', taskHandler)
todoForm.addEventListener('submit', getUserData)