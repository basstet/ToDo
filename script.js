'use strict';

const todoControl = document.querySelector('.todo-control'),
      headerInput = document.querySelector('.header-input'),
      todoList = document.querySelector('.todo-list'),
      todoCompleted = document.querySelector('.todo-completed');

let todoData = [];

const sendToLocalStorage = function() {
  localStorage.setItem('storedTodoData', JSON.stringify(todoData));
};

const render = function() {
  // достать данные из local storage, если они есть:
  const storedTodoData = JSON.parse(localStorage.getItem('storedTodoData'));
  if (storedTodoData) {
    todoData = storedTodoData;
  }

  // обновить DOM:
  todoList.textContent = '';
  todoCompleted.textContent = '';

  todoData.forEach(function(item) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.innerHTML = 
      `<span class="text-todo">${item.value}</span>
			<div class="todo-buttons">
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
			</div>`;

    if (item.completed) {
      todoCompleted.append(li);
    } else {
      todoList.append(li);
    }

    const btnTodoRemove = li.querySelector('.todo-remove'),
          btnTodoComplete = li.querySelector('.todo-complete');

    // удалить дело:
    btnTodoRemove.addEventListener('click', function() {
      const itemIndex = todoData.indexOf(item);
      todoData.splice(itemIndex, 1);
      sendToLocalStorage();
      render();
    });

    // дело выполнено/не выполнено:
    btnTodoComplete.addEventListener('click', function() {
      item.completed = !item.completed;
      sendToLocalStorage();
      render();
    });
  });
  headerInput.value = '';
};

todoControl.addEventListener('submit', function(event) {
  event.preventDefault();

  // добавить дело:
  if (headerInput.value.trim() !== '') {
    const newTodo = {
      value: headerInput.value.trim(),
      completed: false
    };

    todoData.push(newTodo);
    sendToLocalStorage();
    render();
  }
});

render();