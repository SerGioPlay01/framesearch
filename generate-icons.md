# Генерация иконок для PWA

## Автоматическая генерация

Используйте онлайн-сервис для генерации иконок из `favicon.svg`:

### Рекомендуемые сервисы:

1. **PWA Asset Generator**
   - URL: https://www.pwabuilder.com/imageGenerator
   - Загрузите `favicon.svg`
   - Скачайте сгенерированные иконки
   - Поместите в папку `icons/`

2. **RealFaviconGenerator**
   - URL: https://realfavicongenerator.net/
   - Загрузите `favicon.svg`
   - Выберите настройки для PWA
   - Скачайте архив с иконками

3. **Favicon.io**
   - URL: https://favicon.io/favicon-converter/
   - Загрузите `favicon.svg`
   - Скачайте PNG иконки разных размеров

## Ручная генерация (с помощью ImageMagick)

Если у вас установлен ImageMagick:

```bash
# Конвертация SVG в PNG разных размеров
convert -background none favicon.svg -resize 72x72 icons/icon-72x72.png
convert -background none favicon.svg -resize 96x96 icons/icon-96x96.png
convert -background none favicon.svg -resize 128x128 icons/icon-128x128.png
convert -background none favicon.svg -resize 144x144.png
convert -background none favicon.svg -resize 152x152 icons/icon-152x152.png
convert -background none favicon.svg -resize 192x192 icons/icon-192x192.png
convert -background none favicon.svg -resize 384x384 icons/icon-384x384.png
convert -background none favicon.svg -resize 512x512 icons/icon-512x512.png
```

## Временное решение

Пока иконки не созданы, можно использовать favicon.svg напрямую:

1. Скопируйте `favicon.svg` в папку `icons/`
2. Переименуйте копии для каждого размера
3. Или обновите `manifest.json` чтобы использовать SVG

## Требуемые размеры

- 72x72 - Android малый
- 96x96 - Android средний
- 128x128 - Chrome Web Store
- 144x144 - Windows малый
- 152x152 - iOS
- 192x192 - Android большой (maskable)
- 384x384 - Android очень большой
- 512x512 - Splash screen (maskable)

## Примечание

После генерации иконок убедитесь, что они находятся в папке `icons/` и соответствуют путям в `manifest.json`.
