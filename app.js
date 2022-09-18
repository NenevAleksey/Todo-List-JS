(function () {
   //переменные
   const todoList = document.getElementById('todo-list');
   const userSelect = document.getElementById('user-todo');
   const form = document.querySelector('form')
   let todos = [];
   let users = [];

   //загрузка данных, когда отрисуется страница
   document.addEventListener('DOMContentLoaded', initApp);
   form.addEventListener('submit', handleSubmit)

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
      status.addEventListener('change', handleTodoChange);

      const close = document.createElement('span');
      close.innerHTML = '&times;';
      close.className = 'close';
      close.addEventListener('click', handleClose);

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

   //удаление todo из DOM
   function removeTodo(todoId) {
      todos = todos.filter(todo => todo.id !== todoId);

      const todo = todoList.querySelector(`[data-id="${todoId}"]`);
      todo.querySelector('input').removeEventListener('change', handleTodoChange);
      todo.querySelector('.close').removeEventListener('click', handleClose);
      todo.remove();
   }
   //оповещение от ошибке
   function alertError(error) {
      alert(error.message);
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
   function handleSubmit(event) {
      event.preventDefault();

      createTodo({
         userId: Number(form.user.value),
         title: form.todo.value,
         completed: false,
      })
   }
   function handleTodoChange() {
      const todoId = this.parentElement.dataset.id;
      const completed = this.checked;

      toggleStatusTodo(todoId, completed)
   }
   function handleClose() {
      const todoId = this.parentElement.dataset.id;

      deleteTodo(todoId);
   }



   //получение задач и пользователей с сервера
   async function getAllUser() {
      try {
         const response = await fetch('https://jsonplaceholder.typicode.com/users');
         const data = await response.json();

         return data;
      } catch (error) {
         alertError(error);
      }
   }
   async function getAllTodos() {
      try {
         const response = await fetch('https://jsonplaceholder.typicode.com/todos');
         const data = await response.json();

         return data;
      } catch (error) {
         alertError(error);
      }
   }
   async function createTodo(todo) {
      try {
         const response = await fetch('https://jsonplaceholder.typicode.com/todos',
            {
               method: 'POST',
               body: JSON.stringify(todo),
               headers: {
                  'Content-Type': 'application/json'
               }
            }
         );
         const newTodo = await response.json();

         printTodo(newTodo);
      } catch (error) {
         alertError(error);
      }
   }
   async function toggleStatusTodo(todoId, completed) {
      try {
         const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,
            {
               method: 'PATCH',
               body: JSON.stringify({ completed: completed }),
               headers: {
                  'Content-Type': 'application/json'
               }
            }
         );

         if (!response.ok) {
            throw new Error('Проблема с сервиром. Посетите страницу позднее!');
         }
      } catch (error) {
         alertError(error);
      }
   }
   async function deleteTodo(todoId) {
      try {
         const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,
            {
               method: 'DELETE',
               headers: {
                  'Content-Type': 'application/json'
               }
            }
         );

         if (response.ok) {
            removeTodo(todoId);
         } else {
            throw new Error('Проблема с сервиром. Посетите страницу позднее!');
         }
      } catch (error) {
         alertError(error);
      }
   }
})()

