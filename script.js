// 全域變數
let todos = [];
let currentFilter = 'all';
let editingId = null;

// 初始化應用程式
document.addEventListener('DOMContentLoaded', function() {
    loadTodos();
    updateDisplay();
    
    // 綁定 Enter 鍵事件
    document.getElementById('todoInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
});

// 從 localStorage 載入待辦事項
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
}

// 儲存待辦事項到 localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 生成唯一 ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 新增待辦事項
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (text === '') {
        alert('請輸入待辦事項內容！');
        return;
    }
    
    if (text.length > 100) {
        alert('待辦事項內容不能超過 100 個字元！');
        return;
    }
    
    // 檢查是否為編輯模式
    if (editingId) {
        updateTodo(editingId, text);
        editingId = null;
        document.getElementById('addBtn').innerHTML = '<span>➕</span>新增';
    } else {
        const newTodo = {
            id: generateId(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        
        todos.unshift(newTodo); // 新項目加到最前面
    }
    
    input.value = '';
    saveTodos();
    updateDisplay();
    
    // 添加成功動畫效果
    const todoList = document.getElementById('todoList');
    if (todoList.children.length > 0) {
        todoList.children[0].style.animation = 'none';
        setTimeout(() => {
            todoList.children[0].style.animation = 'slideIn 0.3s ease';
        }, 10);
    }
}

// 更新待辦事項
function updateTodo(id, newText) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.text = newText;
    }
}

// 切換完成狀態
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        todo.completedAt = todo.completed ? new Date().toISOString() : null;
        saveTodos();
        updateDisplay();
    }
}

// 編輯待辦事項
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        document.getElementById('todoInput').value = todo.text;
        document.getElementById('todoInput').focus();
        editingId = id;
        document.getElementById('addBtn').innerHTML = '<span>✏️</span>更新';
    }
}

// 刪除待辦事項
function deleteTodo(id) {
    if (confirm('確定要刪除這個待辦事項嗎？')) {
        const todoElement = document.querySelector(`[data-id="${id}"]`);
        if (todoElement) {
            todoElement.classList.add('removing');
            setTimeout(() => {
                todos = todos.filter(t => t.id !== id);
                saveTodos();
                updateDisplay();
            }, 300);
        }
    }
}

// 清除已完成的待辦事項
function clearCompleted() {
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount === 0) {
        alert('沒有已完成的待辦事項可以清除！');
        return;
    }
    
    if (confirm(`確定要清除 ${completedCount} 個已完成的待辦事項嗎？`)) {
        todos = todos.filter(t => !t.completed);
        saveTodos();
        updateDisplay();
    }
}

// 篩選待辦事項
function filterTodos(filter) {
    currentFilter = filter;
    
    // 更新篩選按鈕狀態
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    updateDisplay();
}

// 取得篩選後的待辦事項
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
}

// 更新顯示
function updateDisplay() {
    const todoList = document.getElementById('todoList');
    const emptyState = document.getElementById('emptyState');
    const filteredTodos = getFilteredTodos();
    
    // 清空列表
    todoList.innerHTML = '';
    
    // 顯示待辦事項或空狀態
    if (filteredTodos.length === 0) {
        emptyState.classList.remove('hidden');
        if (todos.length === 0) {
            emptyState.querySelector('p').textContent = '還沒有待辦事項';
            emptyState.querySelector('.empty-subtitle').textContent = '開始添加您的第一個任務吧！';
        } else {
            emptyState.querySelector('p').textContent = '沒有符合條件的待辦事項';
            emptyState.querySelector('.empty-subtitle').textContent = '試試切換不同的篩選條件';
        }
    } else {
        emptyState.classList.add('hidden');
        
        filteredTodos.forEach(todo => {
            const li = createTodoElement(todo);
            todoList.appendChild(li);
        });
    }
    
    // 更新統計
    updateStats();
}

// 建立待辦事項元素
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.setAttribute('data-id', todo.id);
    
    const createdDate = new Date(todo.createdAt).toLocaleDateString('zh-TW');
    const completedDate = todo.completedAt ? new Date(todo.completedAt).toLocaleDateString('zh-TW') : '';
    
    li.innerHTML = `
        <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" 
             onclick="toggleTodo('${todo.id}')" 
             title="${todo.completed ? `完成於: ${completedDate}` : '點擊標記為完成'}">
        </div>
        <div class="todo-text" title="建立於: ${createdDate}">
            ${escapeHtml(todo.text)}
        </div>
        <div class="todo-actions">
            <button class="edit-btn" onclick="editTodo('${todo.id}')" title="編輯">
                ✏️
            </button>
            <button class="delete-btn" onclick="deleteTodo('${todo.id}')" title="刪除">
                🗑️
            </button>
        </div>
    `;
    
    return li;
}

// HTML 轉義函數
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 更新統計資訊
function updateStats() {
    const totalCount = todos.length;
    const activeCount = todos.filter(t => !t.completed).length;
    const completedCount = todos.filter(t => t.completed).length;
    
    document.getElementById('totalCount').textContent = `總計: ${totalCount}`;
    document.getElementById('activeCount').textContent = `進行中: ${activeCount}`;
    document.getElementById('completedCount').textContent = `已完成: ${completedCount}`;
    
    // 更新清除按鈕狀態
    const clearBtn = document.getElementById('clearCompleted');
    clearBtn.disabled = completedCount === 0;
}

// 匯出功能（額外功能）
function exportTodos() {
    if (todos.length === 0) {
        alert('沒有待辦事項可以匯出！');
        return;
    }
    
    const exportData = {
        exportDate: new Date().toISOString(),
        totalTodos: todos.length,
        todos: todos
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `todos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// 匯入功能（額外功能）
function importTodos(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            if (importData.todos && Array.isArray(importData.todos)) {
                if (confirm(`確定要匯入 ${importData.todos.length} 個待辦事項嗎？這將覆蓋現有的資料。`)) {
                    todos = importData.todos;
                    saveTodos();
                    updateDisplay();
                    alert('匯入成功！');
                }
            } else {
                alert('無效的檔案格式！');
            }
        } catch (error) {
            alert('檔案讀取失敗！請確認檔案格式正確。');
        }
    };
    reader.readAsText(file);
}

// 鍵盤快捷鍵
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter: 快速新增
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        addTodo();
    }
    
    // Escape: 取消編輯
    if (e.key === 'Escape' && editingId) {
        editingId = null;
        document.getElementById('todoInput').value = '';
        document.getElementById('addBtn').innerHTML = '<span>➕</span>新增';
    }
});