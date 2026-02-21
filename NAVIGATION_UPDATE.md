# Обновление навигации / Navigation Update

## Изменения / Changes

Все ссылки на главную страницу в приложении теперь ведут на `/app` вместо `/` (лендинг).

All links to the home page in the application now lead to `/app` instead of `/` (landing).

---

## Обновленные файлы / Updated Files

### HTML страницы / HTML Pages:
- ✅ `video_id.html` - лого и кнопка "Назад" → `/app`
- ✅ `search_results.html` - лого и кнопка "Домой" → `/app`
- ✅ `terms.html` - лого и кнопка "На главную" → `/app`
- ✅ `privacy.html` - лого и кнопка "На главную" → `/app`
- ✅ `cookies.html` - лого и кнопка "На главную" → `/app`
- ✅ `disclaimer.html` - лого и кнопка "На главную" → `/app`
- ✅ `license.html` - лого и кнопка "На главную" → `/app`

### JavaScript файлы / JavaScript Files:
- ✅ `scripts/video-player.js` - все редиректы → `/app`

---

## Структура навигации / Navigation Structure

```
/ (index.html)           → Лендинг / Landing Page
/app (landing.html)      → Главная приложения / App Home
/video_id?id=X           → Страница видео / Video Page
/search_results          → Поиск / Search
/terms                   → Условия / Terms
/privacy                 → Приватность / Privacy
/cookies                 → Cookies
/disclaimer              → Disclaimer
/license                 → Лицензии / Licenses
```

---

## Логика редиректов / Redirect Logic

- **Лого в приложении** → `/app` (главная приложения)
- **Лого на лендинге** → `/` (остается на лендинге)
- **Кнопки "Назад"/"На главную"** → `/app`
- **После удаления видео** → `/app`
- **При отсутствии ID видео** → `/app`
- **Кнопка "Импорт"** → `/app` + открытие модального окна

---

## Проверка / Testing

После обновления проверьте:
1. Клик на лого со страницы видео → должен вести на `/app`
2. Клик на лого со страницы поиска → должен вести на `/app`
3. Клик на лого с юридических страниц → должен вести на `/app`
4. Кнопка "Назад" на странице видео → должна вести на `/app`
5. После удаления видео → должен редиректить на `/app`

After updating, check:
1. Click logo from video page → should go to `/app`
2. Click logo from search page → should go to `/app`
3. Click logo from legal pages → should go to `/app`
4. "Back" button on video page → should go to `/app`
5. After deleting video → should redirect to `/app`
