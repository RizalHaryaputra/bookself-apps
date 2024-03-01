const todosKey = 'todos';
const todos = JSON.parse(localStorage.getItem(todosKey)) || [];
const RENDER_EVENT = 'render-todo';

function saveTodosToLocalStorage() {
    localStorage.setItem(todosKey, JSON.stringify(todos));
}


function generateId() {
    return +new Date();
}

function generateTodoObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year : parseInt(year),
        isComplete
    }
}

function findTodo(todoId) {
    for (todoItem of todos) {
        if (todoItem.id === todoId) {
            return todoItem;
        }
    }
    return null;
}

function findTodoIndex(todoId) {
    for (index in todos) {
        if (todos[index].id === todoId) {
            return index;
        }
    }
    return -1;
}

function makeTodo(todoObject) {
    const { id, title, author, year, isComplete } = todoObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${year}`;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTitle, textAuthor, textYear);
    container.append(buttonContainer)
    container.setAttribute('id', `todo-${id}`);

    if (isComplete) {
        const undoButton = document.createElement('button');
        undoButton.innerText = 'Belum Selesai Dibaca';
        undoButton.classList.add('green');
        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.innerText = 'Hapus Buku';
        trashButton.classList.add('red');
        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(id);
        });

        buttonContainer.append(undoButton, trashButton);

    } else {
        const checkButton = document.createElement('button');
        checkButton.innerText = 'Selesai Dibaca';
        checkButton.classList.add('green');
        checkButton.addEventListener('click', function () {
            addTaskToCompleted(id);
        });
        const trashButton = document.createElement('button');
        trashButton.innerText = 'Hapus Buku';
        trashButton.classList.add('red');
        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(id);
        });

        buttonContainer.append(checkButton, trashButton);
    }

    return container;
}

function addTodo() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    
    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, bookTitle, bookAuthor, year, isComplete);
    todos.push(todoObject);

    saveTodosToLocalStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function addTaskToCompleted(todoId) {
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;

    todoTarget.isComplete = true;

    saveTodosToLocalStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);
    if (todoTarget === -1) return;
    todos.splice(todoTarget, 1);

    saveTodosToLocalStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;

    todoTarget.isComplete = false;

    saveTodosToLocalStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addTodo();
        console.log(todos)
    });

    saveTodosToLocalStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));
});


document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById('incompleteBookshelfList');
    const listCompleted = document.getElementById('completeBookshelfList');

    // clearing list item
    uncompletedTODOList.innerHTML = '';
    listCompleted.innerHTML = '';

    for (todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (todoItem.isComplete) {
            listCompleted.append(todoElement);
        } else {
            uncompletedTODOList.append(todoElement);
        }
    }

    saveTodosToLocalStorage();
});

