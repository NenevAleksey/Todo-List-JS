//глобальные переменные
let todos = [];
let users = [];

//загрузка данных, когда отрисуется страница
document.addEventListener('DOMContentLoaded', initApp);

//логика события
function initApp() {
   Promise.all([getAllTodos(), getAllUser()]).then(values => {
      [todos, users] = values;
   })
}

//получение данных 
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