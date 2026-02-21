# 📚 Документация Framesearch

Добро пожаловать в документацию проекта Framesearch!

## 🔧 Переиспользуемые компоненты

Framesearch включает несколько независимых компонентов, которые можно использовать в ваших собственных проектах:

### [Logger](logger.md) - Система красивого логирования

Централизованная система логирования с красивым цветным выводом в консоль.

**Возможности:**
- 🎨 Красивый цветной вывод с эмодзи
- 🔍 Разные уровни логирования (success, error, warning, info, debug, event, data)
- 📊 История логов с возможностью просмотра
- ⏱️ Временные метки для каждого лога
- 📈 Статистика работы приложения

**Использование:**
```javascript
logger.success('Операция выполнена успешно!', data);
logger.error('Произошла ошибка', error);
logger.info('Информационное сообщение', info);
```

[Подробная документация →](logger.md)

---

### [Dialog](dialog.md) - Красивые модальные диалоги

Легковесная библиотека для создания красивых модальных диалогов с async/await поддержкой.

**Возможности:**
- 🎨 Красивый современный дизайн
- ⚡ Async/await поддержка
- 🎯 Три типа диалогов: alert, confirm, prompt
- 🔒 Поддержка password полей
- ⌨️ Keyboard shortcuts (Enter, Escape)

**Использование:**
```javascript
await dialog.alert('Сообщение', 'Заголовок');
const confirmed = await dialog.confirm('Вы уверены?');
const name = await dialog.prompt('Введите имя:');
```

[Подробная документация →](dialog.md)

---

### [i18n](i18n.md) - Интернационализация

Легковесная система многоязычности с динамической сменой языка.

**Возможности:**
- 🌍 Поддержка множества языков
- 🔄 Динамическая смена языка без перезагрузки
- 📝 Автоматическое обновление DOM элементов
- 💾 Сохранение выбранного языка в localStorage
- 🎯 Простой API для получения переводов

**Использование:**
```javascript
const greeting = i18n.t('welcome.message');
i18n.setLanguage('en');
```

```html
<h1 data-i18n="welcome.title">Заголовок</h1>
```

[Подробная документация →](i18n.md)

---

## 📖 Документация проекта

### Основные файлы

- [README.md](../README.md) - Основная документация (Русский)
- [README_EN.md](../README_EN.md) - Main documentation (English)
- [FEATURES.md](../FEATURES.md) - Список возможностей
- [USAGE.md](../USAGE.md) - Руководство пользователя
- [QUICK_START.md](../QUICK_START.md) - Быстрый старт
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Руководство по развертыванию
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Руководство для контрибьюторов
- [CHANGELOG.md](../CHANGELOG.md) - История изменений

### Технические документы

- [PRELOADER_INFO.md](../PRELOADER_INFO.md) - Документация прелоадера
- [UNICODE_FIX.md](../UNICODE_FIX.md) - Исправление проблем с Unicode

---

## 🚀 Быстрый старт

### Использование компонентов

1. **Скопируйте нужный файл** из папки `scripts/` в ваш проект
2. **Подключите скрипт** в HTML:
   ```html
   <script src="scripts/logger.js"></script>
   <script src="scripts/dialog.js"></script>
   <script src="scripts/i18n.js"></script>
   ```
3. **Используйте** в вашем коде:
   ```javascript
   logger.success('Готово!');
   await dialog.alert('Привет!');
   const text = i18n.t('key');
   ```

### Требования

- Современный браузер с поддержкой ES6+
- Для i18n: localStorage
- Для Dialog: Promise/async-await

---

## 📝 Лицензия

Все компоненты распространяются под лицензией **MIT**. Вы можете свободно использовать их в своих проектах, как коммерческих, так и некоммерческих.

---

## 👨‍💻 Автор

**SerGioPlay**

- 🌐 Сайт: [sergioplay-dev.vercel.app](https://sergioplay-dev.vercel.app/)
- 💻 GitHub: [@SerGioPlay01](https://github.com/SerGioPlay01)
- 📦 Проект: [framesearch](https://github.com/SerGioPlay01/framesearch)

---

## 🤝 Поддержка

Если у вас возникли вопросы:

- 📧 VK: [vk.com/framesearch_ru](https://vk.com/framesearch_ru)
- 💬 Telegram: [t.me/framesearch_ru](https://t.me/framesearch_ru)
- 🐛 Issues: [GitHub Issues](https://github.com/SerGioPlay01/framesearch/issues)

---

## ⭐ Благодарности

Если вам понравились компоненты, поставьте ⭐ на GitHub!

---

<div align="center">

**© 2026 Framesearch. Все права защищены.**

Made with ❤️ by SerGioPlay

</div>
