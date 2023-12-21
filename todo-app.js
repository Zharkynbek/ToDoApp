(function () {
  // Функция для создания заголовка приложения
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  // Функция для создания формы добавления задачи
  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.setAttribute("placeholder", "Введите название новой задачи");
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить задачу";
    button.disabled = true; // Добавляем деактивацию кнопки по умолчанию

    // Деактивация кнопки, если поле ввода пустое
    input.addEventListener("input", function () {
      button.disabled = !input.value;
    });

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  // Функция для создания списка задач
  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoItem(todo) {
    let item = document.createElement("li");
    // Кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    // Устанавливаем стили для элемента списка и для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = todo.name; // Используем todo.name вместо просто name

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    // Вставляем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // Приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    doneButton.addEventListener("click", function () {
      todo.done = !todo.done;
      item.classList.toggle("list-group-item-success");
      saveTodoListToLocalStorage();
    });

    deleteButton.addEventListener("click", function () {
      if (!todoItems.some((item) => item.id === todo.id)) return; // Проверка наличия элемента в списке перед удалением

      let confirmed = confirm("Вы уверены?"); // Запрос подтверждения перед удалением элемента

      // Если удаление подтверждено, удалить элемент из списка и обновить отображение
      if (confirmed) {
        todoItems = todoItems.filter((item) => item.id !== todo.id);
        saveTodoListToLocalStorage();
        renderTodo();
      }
    });


    item.dataset.todoId = todo.id;

    return {
      item,
      doneButton,
      deleteButton,
      todo, // Сохраняем объект todo
    };
  }

  // Добавим генерацию уникального id
  let currentId = 1;

  function generateUniqueId() {
    return currentId++;
  }

  function createTodoApp(container, title = "Список задач", listName) {
    // Создание элементов интерфейса для приложения Todo
    let todoAppTitle = createAppTitle(title);
    container.appendChild(todoAppTitle);

    let todoItemForm = createTodoItemForm();
    container.appendChild(todoItemForm.form);

    let todoList = createTodoList();
    container.appendChild(todoList);

    let todoItems = getTodoItemsFromLocalStorage(listName) || [];

    // Функция отрисовки дел на странице
    function renderTodo() {
      todoList.innerHTML = "";
      todoItems.forEach((todo) => {
        let todoItem = createTodoItem(todo);
        todoList.appendChild(todoItem.item);
      });
    }

    // Функция удаления дела
    function deleteTodoItem(todoId) {
      todoItems = todoItems.filter((item) => item.id !== todoId);
      saveTodoListToLocalStorage();
      renderTodo();
    }

    todoList.addEventListener("click", function (event) {
      const deleteButton = event.target.closest("button.btn-danger");
      if (deleteButton) {
        const todoId = +deleteButton.closest("li").dataset.todoId;
        if (confirm("Вы уверены?")) {
          deleteTodoItem(todoId);
        }
      }
    });

    // Обработка события отправки формы для добавления новой задачи
    todoItemForm.form.addEventListener("submit", function (e) {
      e.preventDefault();
      // Проверка наличия текста в поле ввода
      if (!todoItemForm.input.value) {
        return;
      }
      // Создание объекта задачи
      let todo = {
        name: todoItemForm.input.value,
        done: false,
        id: generateUniqueId(),
      };

      // Создание элемента списка задач и добавление его в DOM
      let todoItem = createTodoItem(todo);
      todoList.appendChild(todoItem.item);

      // Добавление задачи в список и сохранение в localStorage
      todoItems.push(todo);
      saveTodoListToLocalStorage();

      // Сброс поля ввода и деактивация кнопки после добавления задачи
      todoItemForm.input.value = "";
      todoItemForm.button.disabled = true;
    });

    // Функция сохранения списка дел в LocalStorage
    function saveTodoListToLocalStorage() {
      localStorage.setItem(listName, JSON.stringify(todoItems));
    }

    // Функция получения списка дел из LocalStorage по ключу listName
    function getTodoItemsFromLocalStorage(listName) {
      let data = localStorage.getItem(listName);
      return data ? JSON.parse(data) : null;
    }

    renderTodo(); // Вызов функции отрисовки дел
  }

  window.createTodoApp = createTodoApp;
})();


