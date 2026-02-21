# Dialog - Красивые модальные диалоги

Легковесная библиотека для создания красивых модальных диалогов (alert, confirm, prompt) с async/await поддержкой.

## 📋 Описание

Dialog заменяет стандартные браузерные диалоги (`alert`, `confirm`, `prompt`) на красивые кастомные модальные окна с современным дизайном и поддержкой async/await.

## ✨ Возможности

- 🎨 Красивый современный дизайн
- ⚡ Async/await поддержка
- 🎯 Три типа диалогов: alert, confirm, prompt
- 🔒 Поддержка password полей
- ⌨️ Keyboard shortcuts (Enter, Escape)
- 📱 Адаптивный дизайн
- 🎭 Backdrop с blur эффектом
- ✨ Плавные анимации

## 🚀 Установка

Скопируйте файл `scripts/dialog.js` в ваш проект и подключите его:

```html
<script src="scripts/dialog.js"></script>
```

## 📖 Использование

### Alert - Информационное сообщение

```javascript
// Простой alert
await dialog.alert('Операция выполнена успешно!');

// С заголовком
await dialog.alert('Данные сохранены', 'Успех');

// Использование в async функции
async function saveData() {
    try {
        // ... сохранение данных
        await dialog.alert('Данные успешно сохранены!', 'Успех');
    } catch (error) {
        await dialog.alert('Ошибка сохранения: ' + error.message, 'Ошибка');
    }
}
```

### Confirm - Подтверждение действия

```javascript
// Простое подтверждение
const confirmed = await dialog.confirm('Вы уверены?');
if (confirmed) {
    console.log('Пользователь подтвердил');
}

// С заголовком
const result = await dialog.confirm(
    'Вы действительно хотите удалить этот элемент?',
    'Подтверждение удаления'
);

if (result) {
    // Удаление элемента
    deleteItem();
}

// Использование в условиях
async function deleteUser(userId) {
    const confirmed = await dialog.confirm(
        'Это действие нельзя отменить. Продолжить?',
        'Удаление пользователя'
    );
    
    if (!confirmed) return;
    
    // Удаление пользователя
    await api.deleteUser(userId);
    await dialog.alert('Пользователь удален', 'Успех');
}
```

### Prompt - Ввод данных

```javascript
// Простой ввод
const name = await dialog.prompt('Введите ваше имя:');
if (name) {
    console.log('Имя:', name);
}

// С заголовком и значением по умолчанию
const email = await dialog.prompt(
    'Введите email:',
    'user@example.com',
    'Регистрация'
);

// Password поле
const password = await dialog.prompt(
    'Введите пароль:',
    '',
    'Авторизация',
    true // password mode
);

// Валидация ввода
async function createFolder() {
    const folderName = await dialog.prompt(
        'Введите название папки:',
        '',
        'Создание папки'
    );
    
    if (!folderName) {
        await dialog.alert('Название не может быть пустым', 'Ошибка');
        return;
    }
    
    if (folderName.length < 3) {
        await dialog.alert('Название должно быть не менее 3 символов', 'Ошибка');
        return;
    }
    
    // Создание папки
    await createNewFolder(folderName);
}
```

## 🎨 Кастомизация

### Изменение стилей

Dialog использует CSS переменные для легкой кастомизации. Добавьте в ваш CSS:

```css
.custom-dialog-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
}

.custom-dialog-header h3 {
    color: #ffffff;
    font-size: 1.5rem;
}

.custom-dialog-footer .btn-primary {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
```

### Изменение текста кнопок

Вы можете изменить текст кнопок, модифицировав методы в классе:

```javascript
// В методе confirm
const confirmBtn = document.createElement('button');
confirmBtn.className = 'btn-primary';
confirmBtn.textContent = 'Да'; // Изменить на нужный текст

const cancelBtn = document.createElement('button');
cancelBtn.className = 'btn-secondary';
cancelBtn.textContent = 'Нет'; // Изменить на нужный текст
```

## 📊 API

### Методы

| Метод | Описание | Параметры | Возвращает |
|-------|----------|-----------|------------|
| `alert(message, title?)` | Показать информационное сообщение | message: string, title?: string | Promise\<void\> |
| `confirm(message, title?)` | Запросить подтверждение | message: string, title?: string | Promise\<boolean\> |
| `prompt(message, defaultValue?, title?, isPassword?)` | Запросить ввод данных | message: string, defaultValue?: string, title?: string, isPassword?: boolean | Promise\<string \| null\> |

### Параметры

#### alert(message, title?)
- `message` (string) - Текст сообщения
- `title` (string, optional) - Заголовок диалога

#### confirm(message, title?)
- `message` (string) - Текст вопроса
- `title` (string, optional) - Заголовок диалога
- **Возвращает**: `true` если пользователь нажал OK, `false` если Cancel

#### prompt(message, defaultValue?, title?, isPassword?)
- `message` (string) - Текст запроса
- `defaultValue` (string, optional) - Значение по умолчанию
- `title` (string, optional) - Заголовок диалога
- `isPassword` (boolean, optional) - Использовать password поле
- **Возвращает**: Введенное значение или `null` если отменено

## 💡 Примеры использования

### Форма регистрации

```javascript
async function registerUser() {
    const username = await dialog.prompt('Введите имя пользователя:', '', 'Регистрация');
    if (!username) return;
    
    const email = await dialog.prompt('Введите email:', '', 'Регистрация');
    if (!email) return;
    
    const password = await dialog.prompt('Введите пароль:', '', 'Регистрация', true);
    if (!password) return;
    
    try {
        await api.register({ username, email, password });
        await dialog.alert('Регистрация успешна!', 'Успех');
    } catch (error) {
        await dialog.alert('Ошибка регистрации: ' + error.message, 'Ошибка');
    }
}
```

### Удаление с подтверждением

```javascript
async function deleteItem(itemId) {
    const confirmed = await dialog.confirm(
        'Вы действительно хотите удалить этот элемент? Это действие нельзя отменить.',
        'Подтверждение удаления'
    );
    
    if (!confirmed) return;
    
    try {
        await api.deleteItem(itemId);
        await dialog.alert('Элемент успешно удален', 'Успех');
        refreshList();
    } catch (error) {
        await dialog.alert('Ошибка удаления: ' + error.message, 'Ошибка');
    }
}
```

### Переименование файла

```javascript
async function renameFile(fileId, currentName) {
    const newName = await dialog.prompt(
        'Введите новое имя файла:',
        currentName,
        'Переименование'
    );
    
    if (!newName || newName === currentName) return;
    
    try {
        await api.renameFile(fileId, newName);
        await dialog.alert('Файл переименован', 'Успех');
    } catch (error) {
        await dialog.alert('Ошибка переименования: ' + error.message, 'Ошибка');
    }
}
```

### Цепочка диалогов

```javascript
async function setupWizard() {
    await dialog.alert('Добро пожаловать в мастер настройки!', 'Приветствие');
    
    const name = await dialog.prompt('Как вас зовут?', '', 'Шаг 1 из 3');
    if (!name) return;
    
    const age = await dialog.prompt('Сколько вам лет?', '', 'Шаг 2 из 3');
    if (!age) return;
    
    const confirmed = await dialog.confirm(
        `Ваше имя: ${name}, возраст: ${age}. Все верно?`,
        'Шаг 3 из 3'
    );
    
    if (confirmed) {
        await saveUserData({ name, age });
        await dialog.alert('Настройка завершена!', 'Успех');
    }
}
```

## ⌨️ Keyboard Shortcuts

- **Enter** - Подтвердить (OK)
- **Escape** - Отменить (Cancel)

## 🎭 Анимации

Dialog использует плавные CSS анимации:
- Fade in для backdrop
- Slide up для контента
- Smooth transitions для всех элементов

## 🔧 Требования

- Современный браузер с поддержкой ES6+
- Promise/async-await поддержка

## 📱 Адаптивность

Dialog полностью адаптивен и отлично работает на:
- 📱 Мобильных устройствах
- 📱 Планшетах
- 💻 Десктопах

## 📝 Лицензия

MIT License - свободно используйте в своих проектах!

## 👨‍💻 Автор

SerGioPlay - [GitHub](https://github.com/SerGioPlay01)

## 🤝 Вклад

Если вы хотите улучшить Dialog:
1. Форкните репозиторий
2. Создайте ветку для ваших изменений
3. Отправьте Pull Request

## 📚 Связанные проекты

- [Framesearch](https://github.com/SerGioPlay01/framesearch) - Персональное видеохранилище
