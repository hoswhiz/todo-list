$(document).ready(function () {
  // متغیرهای全局 با var
  var todos = [];
  var currentFilter = "all";

  // ذخیره در Local Storage
  function saveToLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  // بارگذاری از Local Storage
  function loadFromLocalStorage() {
    var savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      todos = JSON.parse(savedTodos);
      renderTodos();
      updateStats();
    }
  }

  // نمایش todos
  function renderTodos() {
    var $todoList = $("#todoList");
    $todoList.empty();

    var filteredTodos = todos.filter(function (todo) {
      if (currentFilter === "all") return true;
      if (currentFilter === "completed") return todo.completed;
      if (currentFilter === "pending") return !todo.completed;
    });

    if (filteredTodos.length === 0) {
      $todoList.html('<div class="empty-state">📝 هیچ کاری وجود ندارد</div>');
      return;
    }

    filteredTodos.forEach(function (todo, index) {
      var todoItem = `
                <li class="todo-item ${
                  todo.completed ? "completed" : ""
                }" data-id="${todo.id}">
                    <span class="todo-text">${todo.text}</span>
                    <div class="todo-actions">
                        <button class="complete-btn">
                            ${todo.completed ? "❌ بازگشت" : "✅ انجام شد"}
                        </button>
                        <button class="delete-btn">🗑️ حذف</button>
                    </div>
                </li>
            `;
      $todoList.append(todoItem);
    });
  }

  // آپدیت آمار
  function updateStats() {
    var total = todos.length;
    var completed = todos.filter(function (todo) {
      return todo.completed;
    }).length;

    $("#totalTasks").text("تعداد کل: " + total);
    $("#completedTasks").text("انجام شده: " + completed);
  }

  // اضافه کردن todo جدید
  function addTodo() {
    var $input = $("#todoInput");
    var text = $input.val().trim();

    if (text === "") {
      $input.focus();
      return;
    }

    var newTodo = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date().toLocaleDateString("fa-IR"),
    };

    todos.push(newTodo);
    $input.val("");
    renderTodos();
    updateStats();
    saveToLocalStorage();
  }

  // علامت زدن به عنوان انجام شده
  function toggleComplete(id) {
    todos = todos.map(function (todo) {
      if (todo.id === id) {
        return {
          id: todo.id,
          text: todo.text,
          completed: !todo.completed,
          createdAt: todo.createdAt,
        };
      }
      return todo;
    });
    renderTodos();
    updateStats();
    saveToLocalStorage();
  }

  // حذف todo
  function deleteTodo(id) {
    if (!confirm("آیا مطمئن هستید می‌خواهید این کار را حذف کنید؟")) {
      return;
    }

    todos = todos.filter(function (todo) {
      return todo.id !== id;
    });
    renderTodos();
    updateStats();
    saveToLocalStorage();
  }

  // تغییر فیلتر
  function changeFilter(filter) {
    currentFilter = filter;
    $(".filter-btn").removeClass("active");
    $('.filter-btn[data-filter="' + filter + '"]').addClass("active");
    renderTodos();
  }

  // Event Listeners با jQuery
  $("#addBtn").click(addTodo);

  $("#todoInput").keypress(function (e) {
    if (e.which === 13) {
      // کلید Enter
      addTodo();
    }
  });

  // Event Delegation برای آیتم‌های داینامیک
  $("#todoList").on("click", ".complete-btn", function () {
    var todoId = parseInt($(this).closest(".todo-item").data("id"));
    toggleComplete(todoId);
  });

  $("#todoList").on("click", ".delete-btn", function () {
    var todoId = parseInt($(this).closest(".todo-item").data("id"));
    deleteTodo(todoId);
  });

  $(".filter-btn").click(function () {
    var filter = $(this).data("filter");
    changeFilter(filter);
  });

  // مقداردهی اولیه
  loadFromLocalStorage();
});
