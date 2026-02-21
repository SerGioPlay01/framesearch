# Logger - Система красивого логирования

Централизованная система логирования с красивым выводом в консоль для JavaScript приложений.

## 📋 Описание

Logger - это легковесная библиотека для красивого и структурированного логирования в браузере. Автоматически определяет режим разработки и показывает логи только в development окружении.

## ✨ Возможности

- 🎨 Красивый цветной вывод с эмодзи
- 🔍 Разные уровни логирования (success, error, warning, info, debug, event, data)
- 📊 История логов с возможностью просмотра
- ⏱️ Временные метки для каждого лога
- 📈 Статистика работы приложения
- 🎯 Специальные методы для разных модулей
- 🚀 Автоматическое определение development/production режима
- 💾 Хранение последних 100 логов

## 🚀 Установка

Просто скопируйте файл `scripts/logger.js` в ваш проект и подключите его:

```html
<script src="scripts/logger.js"></script>
```

## 📖 Использование

### Базовые методы

```javascript
// Успешная операция
logger.success('Данные сохранены успешно', data);

// Ошибка
logger.error('Произошла ошибка', error);

// Предупреждение
logger.warning('Внимание! Низкий заряд батареи', { battery: 15 });

// Информация
logger.info('Пользователь вошел в систему', userData);

// Отладка
logger.debug('Значение переменной', { value: 42 });

// События
logger.event('userLogin', { userId: 123, timestamp: Date.now() });

// Данные (с таблицей)
logger.data('Список пользователей', usersArray);
```

### Специальные методы для модулей

```javascript
// База данных
logger.database('Подключение установлено', connectionInfo);

// Видео
logger.video('Видео загружено', videoData);

// Поиск
logger.search('Найдено 10 результатов', results);

// Тема
logger.theme('Тема изменена на темную', themeSettings);

// Импорт
logger.importData('Импортировано 50 записей', importStats);

// Экспорт
logger.exportData('Экспорт завершен', exportData);

// Коллекции
logger.collection('Коллекция создана', collectionData);

// Настройки
logger.settings('Настройки обновлены', settings);
```

### Группировка логов

```javascript
logger.group('Инициализация приложения', () => {
    logger.info('Загрузка конфигурации');
    logger.info('Подключение к базе данных');
    logger.success('Приложение готово');
});
```

### Измерение производительности

```javascript
// Старт таймера
logger.time('Загрузка данных');

// ... ваш код ...

// Остановка таймера
logger.timeEnd('Загрузка данных');

// Или вручную
const startTime = performance.now();
// ... ваш код ...
const duration = performance.now() - startTime;
logger.performance('Обработка данных', duration);
```

### Таблицы

```javascript
const users = [
    { id: 1, name: 'Иван', role: 'admin' },
    { id: 2, name: 'Мария', role: 'user' }
];

logger.table('Пользователи системы', users);
```

### Консольные команды

В консоли браузера доступны глобальные команды:

```javascript
// Показать историю логов
logHistory();

// Показать статистику
logStats();

// Очистить историю
logClear();
```

## ⚙️ Конфигурация

Logger автоматически определяет режим разработки по hostname:

```javascript
this.isDevelopment = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.includes('192.168');
```

Вы можете изменить эту логику в конструкторе класса.

## 🎨 Кастомизация

### Изменение стилей

Вы можете изменить стили логов в объекте `this.styles`:

```javascript
this.styles = {
    success: 'background: #10b981; color: white; padding: 4px 12px; border-radius: 6px;',
    error: 'background: #ef4444; color: white; padding: 4px 12px; border-radius: 6px;',
    // ... другие стили
};
```

### Добавление своих эмодзи

```javascript
this.emoji = {
    success: '✅',
    error: '❌',
    custom: '🎯',
    // ... добавьте свои
};
```

## 📊 API

### Методы логирования

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `success(message, data?)` | Успешная операция | message: string, data?: any |
| `error(message, error?)` | Ошибка | message: string, error?: Error |
| `warning(message, data?)` | Предупреждение | message: string, data?: any |
| `info(message, data?)` | Информация | message: string, data?: any |
| `debug(message, data?)` | Отладка | message: string, data?: any |
| `event(name, data?)` | События | name: string, data?: any |
| `data(label, data)` | Данные с таблицей | label: string, data: any |

### Специальные методы

| Метод | Описание |
|-------|----------|
| `database(action, data?)` | Логи базы данных |
| `video(action, data?)` | Логи видео |
| `search(query, results?)` | Логи поиска |
| `theme(action, data?)` | Логи темы |
| `importData(action, data?)` | Логи импорта |
| `exportData(action, data?)` | Логи экспорта |
| `collection(action, data?)` | Логи коллекций |
| `settings(action, data?)` | Логи настроек |

### Утилиты

| Метод | Описание |
|-------|----------|
| `group(title, callback?)` | Группировка логов |
| `time(label)` | Старт таймера |
| `timeEnd(label)` | Остановка таймера |
| `performance(label, duration)` | Лог производительности |
| `table(title, data)` | Таблица данных |
| `showHistory()` | Показать историю |
| `showStats()` | Показать статистику |
| `clearHistory()` | Очистить историю |

## 💡 Примеры использования

### Логирование AJAX запросов

```javascript
async function fetchData(url) {
    logger.time('API Request');
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        logger.timeEnd('API Request');
        logger.success('Данные получены', { count: data.length });
        
        return data;
    } catch (error) {
        logger.error('Ошибка загрузки данных', error);
        throw error;
    }
}
```

### Логирование жизненного цикла компонента

```javascript
class MyComponent {
    constructor() {
        logger.info('Компонент создан', { name: 'MyComponent' });
    }
    
    init() {
        logger.group('Инициализация MyComponent', () => {
            logger.debug('Загрузка конфигурации');
            logger.debug('Привязка событий');
            logger.success('Компонент инициализирован');
        });
    }
    
    destroy() {
        logger.warning('Компонент уничтожен', { name: 'MyComponent' });
    }
}
```

### Отслеживание пользовательских действий

```javascript
document.addEventListener('click', (e) => {
    if (e.target.matches('button')) {
        logger.event('buttonClick', {
            button: e.target.textContent,
            timestamp: Date.now()
        });
    }
});
```

## 🔧 Требования

- Современный браузер с поддержкой ES6+
- Console API

## 📝 Лицензия

MIT License - свободно используйте в своих проектах!

## 👨‍💻 Автор

SerGioPlay - [GitHub](https://github.com/SerGioPlay01)

## 🤝 Вклад

Если вы хотите улучшить Logger:
1. Форкните репозиторий
2. Создайте ветку для ваших изменений
3. Отправьте Pull Request

## 📚 Связанные проекты

- [Framesearch](https://github.com/SerGioPlay01/framesearch) - Персональное видеохранилище
