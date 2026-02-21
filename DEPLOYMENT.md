# 🚀 Руководство по развертыванию Framesearch

## Варианты развертывания

### 1. GitHub Pages (Рекомендуется)

#### Автоматическое развертывание

1. **Форкните или загрузите репозиторий на GitHub**

2. **Перейдите в Settings → Pages**

3. **Выберите источник:**
   - Source: Deploy from a branch
   - Branch: `main` (или `master`)
   - Folder: `/ (root)`

4. **Сохраните настройки**

Сайт будет доступен по адресу: `https://ваш-username.github.io/framesearch/`

#### Настройка базового пути

Если приложение находится в подпапке, обновите пути в файлах:

```javascript
// В manifest.json
"start_url": "/framesearch/index.html",
"scope": "/framesearch/",

// В sw.js
const CACHE_NAME = 'framesearch-v1';
const BASE_PATH = '/framesearch';
```

### 2. Vercel

1. **Установите Vercel CLI:**
```bash
npm install -g vercel
```

2. **Разверните проект:**
```bash
cd framesearch
vercel
```

3. **Следуйте инструкциям в терминале**

Или используйте веб-интерфейс:
- Перейдите на [vercel.com](https://vercel.com)
- Импортируйте репозиторий с GitHub
- Vercel автоматически определит настройки

### 3. Netlify

#### Через веб-интерфейс:

1. Перейдите на [netlify.com](https://netlify.com)
2. Нажмите "Add new site" → "Import an existing project"
3. Выберите репозиторий GitHub
4. Настройки сборки оставьте пустыми (статический сайт)
5. Нажмите "Deploy"

#### Через Netlify CLI:

```bash
npm install -g netlify-cli
cd framesearch
netlify deploy
```

### 4. Cloudflare Pages

1. Перейдите на [pages.cloudflare.com](https://pages.cloudflare.com)
2. Подключите GitHub аккаунт
3. Выберите репозиторий
4. Настройки сборки:
   - Build command: (оставьте пустым)
   - Build output directory: `/`
5. Нажмите "Save and Deploy"

### 5. Локальный сервер

#### Python:
```bash
cd framesearch
python -m http.server 8000
```

#### Node.js (http-server):
```bash
npm install -g http-server
cd framesearch
http-server -p 8000
```

#### PHP:
```bash
cd framesearch
php -S localhost:8000
```

## Настройка HTTPS

### Для локальной разработки

#### mkcert (рекомендуется):

```bash
# Установка mkcert
brew install mkcert  # macOS
# или
choco install mkcert  # Windows

# Создание сертификата
mkcert -install
mkcert localhost 127.0.0.1 ::1

# Запуск с HTTPS
http-server -S -C localhost+2.pem -K localhost+2-key.pem
```

### Для продакшена

Все перечисленные хостинги (GitHub Pages, Vercel, Netlify, Cloudflare) автоматически предоставляют HTTPS.

## Настройка Custom Domain

### GitHub Pages:

1. Settings → Pages → Custom domain
2. Введите ваш домен (example.com)
3. Настройте DNS записи у регистратора:
   ```
   A    @    185.199.108.153
   A    @    185.199.109.153
   A    @    185.199.110.153
   A    @    185.199.111.153
   ```

### Vercel/Netlify/Cloudflare:

1. Перейдите в настройки проекта
2. Добавьте custom domain
3. Следуйте инструкциям по настройке DNS

## Оптимизация для продакшена

### 1. Минификация (опционально)

Для уменьшения размера файлов:

```bash
# Установка инструментов
npm install -g terser clean-css-cli html-minifier

# Минификация JS
terser scripts/main.js -o scripts/main.min.js -c -m

# Минификация CSS
cleancss -o styles/main.min.css styles/main.css

# Минификация HTML
html-minifier --collapse-whitespace --remove-comments index.html -o index.min.html
```

### 2. Генерация иконок

Следуйте инструкциям в `generate-icons.md`

### 3. Настройка Service Worker

Убедитесь, что в `sw.js` указаны правильные пути и версия кэша.

### 4. Проверка PWA

Используйте Lighthouse в Chrome DevTools:
1. Откройте DevTools (F12)
2. Вкладка "Lighthouse"
3. Выберите "Progressive Web App"
4. Нажмите "Generate report"

## Переменные окружения

Framesearch не требует переменных окружения, так как работает полностью на клиенте.

## Мониторинг

### Google Analytics (опционально)

Если хотите добавить аналитику:

```html
<!-- В index.html перед </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Обновления

### Автоматические обновления через Service Worker

Service Worker автоматически обновляет кэш при изменении версии:

```javascript
// В sw.js измените версию
const CACHE_NAME = 'framesearch-v2'; // было v1
```

### Ручное обновление

Пользователи могут обновить приложение:
1. Закрыть все вкладки с приложением
2. Открыть заново
3. Или: DevTools → Application → Service Workers → Update

## Troubleshooting

### Проблема: PWA не устанавливается

**Решение:**
- Проверьте HTTPS (обязательно для PWA)
- Проверьте manifest.json на ошибки
- Убедитесь, что Service Worker зарегистрирован
- Проверьте консоль браузера на ошибки

### Проблема: Иконки не отображаются

**Решение:**
- Сгенерируйте PNG иконки (см. generate-icons.md)
- Проверьте пути в manifest.json
- Убедитесь, что файлы существуют

### Проблема: Старая версия кэшируется

**Решение:**
- Измените CACHE_NAME в sw.js
- Очистите кэш в DevTools
- Используйте hard refresh (Ctrl+Shift+R)

## Поддержка

Если возникли проблемы с развертыванием:
- 📧 VK: [vk.com/framesearch_ru](https://vk.com/framesearch_ru)
- 💬 Telegram: [t.me/framesearch_ru](https://t.me/framesearch_ru)
- 🐛 GitHub Issues: [github.com/SerGioPlay01/framesearch/issues](https://github.com/SerGioPlay01/framesearch/issues)
