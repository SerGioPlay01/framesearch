# Руководство по развертыванию Framesearch

## Статические хостинги

Framesearch - это PWA приложение, которое работает полностью на клиентской стороне. Вы можете развернуть его на любом статическом хостинге.

## Поддерживаемые платформы

### 1. Vercel (Рекомендуется)

**Автоматический деплой:**
1. Подключите репозиторий к Vercel
2. Vercel автоматически обнаружит `vercel.json`
3. Деплой произойдет автоматически

**Ручной деплой:**
```bash
npm i -g vercel
vercel
```

**Конфигурация:** `vercel.json` уже настроен

### 2. Netlify

**Автоматический деплой:**
1. Подключите репозиторий к Netlify
2. Netlify автоматически обнаружит `netlify.toml` или `_redirects`
3. Деплой произойдет автоматически

**Ручной деплой:**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

**Конфигурация:** 
- `netlify.toml` - основная конфигурация
- `_redirects` - альтернативная конфигурация

### 3. GitHub Pages

**Настройка:**
1. Перейдите в Settings → Pages
2. Выберите ветку для деплоя
3. Сохраните

**Примечание:** GitHub Pages не поддерживает rewrites из коробки. Используйте полные URL с `.html`:
- ✅ `/video_id.html?id=1`
- ❌ `/video_id?id=1`

### 4. Cloudflare Pages

**Автоматический деплой:**
1. Подключите репозиторий к Cloudflare Pages
2. Создайте файл `_redirects` (уже создан)
3. Деплой произойдет автоматически

**Конфигурация:** `_redirects` файл

### 5. Firebase Hosting

**Настройка:**
1. Установите Firebase CLI: `npm i -g firebase-tools`
2. Инициализируйте проект: `firebase init hosting`
3. Создайте `firebase.json`:

```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/video_id",
        "destination": "/video_id.html"
      },
      {
        "source": "/search_results",
        "destination": "/search_results.html"
      }
    ],
    "headers": [
      {
        "source": "/sw.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  }
}
```

4. Деплой: `firebase deploy`

## Важные замечания

### URL без расширений

Приложение поддерживает URL без расширения `.html` на следующих платформах:
- ✅ Vercel
- ✅ Netlify
- ✅ Cloudflare Pages
- ✅ Firebase Hosting
- ❌ GitHub Pages (требуется `.html`)

### Service Worker

Service Worker (`sw.js`) должен обслуживаться с заголовком `Cache-Control: no-cache`. Это уже настроено во всех конфигурационных файлах.

### HTTPS

PWA требует HTTPS для работы Service Worker. Все перечисленные платформы предоставляют бесплатный SSL сертификат.

## Локальная разработка

### Рекомендуемый способ (с поддержкой rewrites)

Используйте `serve` с конфигурацией:

```bash
# Установите serve глобально
npm install -g serve

# Запустите с конфигурацией
serve -c serve.json
```

Теперь URL без `.html` будут работать локально!

### Альтернативные способы

**Live Server (VS Code):**
```bash
# Используйте полные URL с .html
http://localhost:5500/video_id.html?id=1
```

**Python:**
```bash
python -m http.server 8000
# Используйте полные URL с .html
```

**Node.js http-server:**
```bash
npx http-server
# Используйте полные URL с .html
```

**Важно:** При использовании Live Server, Python или http-server используйте полные URL с `.html`:
- `http://localhost:5500/video_id.html?id=1`

## Проверка деплоя

После деплоя проверьте:
1. ✅ Главная страница загружается
2. ✅ Service Worker регистрируется
3. ✅ Приложение работает оффлайн
4. ✅ URL без `.html` работают (кроме GitHub Pages)
5. ✅ PWA можно установить

## Troubleshooting

### "Cannot GET /video_id"

**Причина:** Хостинг не поддерживает rewrites или конфигурация не применена.

**Решение:**
1. Проверьте наличие конфигурационного файла для вашего хостинга
2. Используйте полные URL с `.html`
3. Для GitHub Pages всегда используйте `.html`

### Service Worker не регистрируется

**Причина:** Отсутствует HTTPS или неправильные заголовки.

**Решение:**
1. Убедитесь, что сайт работает по HTTPS
2. Проверьте заголовки `sw.js` в DevTools → Network

### PWA не устанавливается

**Причина:** Не выполнены требования PWA.

**Решение:**
1. Проверьте `manifest.json`
2. Убедитесь, что Service Worker зарегистрирован
3. Проверьте в DevTools → Application → Manifest

## Рекомендации

1. **Используйте Vercel или Netlify** - они предоставляют лучшую поддержку для PWA
2. **Включите аналитику** - добавьте Google Analytics или аналоги
3. **Настройте CDN** - для ускорения загрузки статических файлов
4. **Мониторинг** - используйте Lighthouse для проверки производительности

## Поддержка

Если у вас возникли проблемы с деплоем:
1. Проверьте документацию вашего хостинга
2. Убедитесь, что конфигурационный файл находится в корне проекта
3. Проверьте логи деплоя на наличие ошибок
