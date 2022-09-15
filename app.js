//глобальные переменные
const todoList = document.getElementById('todo-list');
const userSelect = document.getElementById('user-todo');
let todos = [];
let users = [];

//загрузка данных, когда отрисуется страница
document.addEventListener('DOMContentLoaded', initApp);

//поиск user по userId 
function getUserName(userId) {
   const user = users.find(user => user.id === userId);
   return user.name;
}

//отрисовка задачи на странице
function printTodo({ userId, id, title, completed }) {
   const li = document.createElement('li');
   li.dataset.id = id;
   li.className = 'todo-item';
   li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(userId)}</b></span>`;

   const status = document.createElement('input');
   status.type = 'checkbox';
   status.checked = completed;

   const close = document.createElement('span');
   close.innerHTML = '&times;';
   close.className = 'close';

   li.prepend(status);
   li.append(close);
   todoList.prepend(li);
}

//добавить пользователей в выпадающий список.
function createUserOption(user) {
   const option = document.createElement('option');
   option.value = user.id;
   option.innerText = user.name;

   userSelect.append(option)
}

//логика события
function initApp() {
   Promise.all([getAllTodos(), getAllUser()]).then(values => {
      [todos, users] = values;

      //отправка в разметку
      todos.forEach(todo => printTodo(todo));
      users.forEach(user => createUserOption(user))
   })
}

//получение задач и пользователей с сервера
async function getAllUser() {
   const response = await fetch('https://jsonplaceholder.typicode.com/users');
   const data = await response.json();

   return data;
}

async function getAllTodos() {
   const response = await fetch('https://jsonplaceholder.typicode.com/todos');
   const data = await response.json();

   return data;
}