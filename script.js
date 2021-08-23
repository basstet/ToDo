/* eslint-disable strict */
'use strict';

class Todo {
  constructor(form, input, todoList, todoCompleted) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    this.todoButtons,
    this.count = 0;
  }

  addToStorage() {
    localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
  }

  render() {
    this.input.value = '';
    this.todoList.textContent = '';
    this.todoCompleted.textContent = '';
    this.todoData.forEach(this.createElem, this);
    this.addToStorage();
    this.todoButtons = document.querySelectorAll('.todo-buttons');
  }

  createElem(todo) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = todo.key;
    li.insertAdjacentHTML('beforeend', `
      <span class="text-todo">${todo.value}</span>
			<div class="todo-buttons">
        <button class="todo-edit"></button>
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
			</div>
    `);

    if (todo.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }

  addTodo(e) {
    e.preventDefault();
    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey()
      };
      this.todoData.set(newTodo.key, newTodo);
      this.render();
      this.init();
    } else {
      this.input.value = '';
    }
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  animateElem() {
    const animation = requestAnimationFrame(this.animateElem.bind(this)),
          animatedLi = document.querySelector('.animated-li');

    this.count++;

    if (this.count <= 20) {
      animatedLi.style.transform = `translateX(${0 - this.count * 6}%)`;
    } else {
      cancelAnimationFrame(animation);
      this.count = 0;
    }
  }

  deleteItem(e) {
    const parentLi = e.target.parentElement.parentElement,
          todoKey = parentLi.key;

    this.todoData.delete(todoKey);

    parentLi.classList.add('animated-li');
    this.animateElem();

    setTimeout(() => {
      this.render();
      this.init();
    }, 600);
  }

  completedItem(e) {
    const parentLi = e.target.parentElement.parentElement,
          todoKey = parentLi.key;

    this.todoData.forEach((value, key) => {
      if (key === todoKey) {
        if (!value.completed) {
          value.completed = true;
        } else {
          value.completed = false;
        }
      }
    });

    parentLi.classList.add('animated-li');
    this.animateElem();

    setTimeout(() => {
      this.render();
      this.init();
    }, 600);
  }

  editItem(e) {
    const parentLi = e.target.parentElement.parentElement,
          todoKey = parentLi.key;

    parentLi.setAttribute('contenteditable', 'true');
    parentLi.focus();

    parentLi.addEventListener('blur', () => {
      const newValue = parentLi.textContent;

      parentLi.setAttribute('contenteditable', 'false');
      this.todoData.forEach((value, key) => {
        if (key === todoKey) {
          value.value = newValue;
        }
      });

      this.render();
      this.init();
    });
  }

  handler(e) {
    if (e.target.className === 'todo-remove') {
      this.deleteItem(e);
    } else if (e.target.className === 'todo-complete') {
      this.completedItem(e);
    } else if (e.target.className === 'todo-edit') {
      this.editItem(e);
    }
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.render();
    this.todoButtons.forEach(item => {
      item.addEventListener('click', this.handler.bind(this));
    });
  }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
