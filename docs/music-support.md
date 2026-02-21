# Поддержка музыки / Music Support

## Обзор / Overview

Framesearch теперь поддерживает добавление музыкальных треков, альбомов и плейлистов из популярных стриминговых сервисов, а также прямые ссылки на аудиофайлы.

Framesearch now supports adding music tracks, albums, and playlists from popular streaming services, as well as direct links to audio files.

---

## Поддерживаемые платформы / Supported Platforms

### 1. Spotify
- **Треки** (Tracks): `https://open.spotify.com/track/...`
- **Альбомы** (Albums): `https://open.spotify.com/album/...`
- **Плейлисты** (Playlists): `https://open.spotify.com/playlist/...`
- **Исполнители** (Artists): `https://open.spotify.com/artist/...`

### 2. Яндекс.Музыка / Yandex.Music
- **Треки** (Tracks): `https://music.yandex.ru/album/123/track/456`
- **Альбомы** (Albums): `https://music.yandex.ru/album/123`
- **Плейлисты** (Playlists): `https://music.yandex.ru/users/username/playlists/123`
- **Исполнители** (Artists): `https://music.yandex.ru/artist/123`

### 3. SoundCloud
- **Треки** (Tracks): `https://soundcloud.com/artist/track-name`
- **Плейлисты** (Playlists): `https://soundcloud.com/artist/sets/playlist-name`

### 4. VK Музыка / VK Music
- **Аудио** (Audio): `https://vk.com/audio123_456`
- **Плейлисты** (Playlists): `https://vk.com/music/playlist/123_456`

### 5. Apple Music
- **Песни** (Songs): `https://music.apple.com/us/album/album-name/123?i=456`
- **Альбомы** (Albums): `https://music.apple.com/us/album/album-name/123`
- **Плейлисты** (Playlists): `https://music.apple.com/us/playlist/playlist-name/pl.abc123`

### 6. Deezer
- **Треки** (Tracks): `https://deezer.com/track/123`
- **Альбомы** (Albums): `https://deezer.com/album/123`
- **Плейлисты** (Playlists): `https://deezer.com/playlist/123`

### 7. Прямые ссылки / Direct Links
- **Форматы** (Formats): MP3, WAV, OGG, FLAC
- **Пример** (Example): `https://example.com/audio.mp3`

---

## Как добавить музыку / How to Add Music

### Шаг 1: Откройте модальное окно / Step 1: Open Modal
Нажмите кнопку "+" или используйте горячую клавишу `Ctrl+N`

Click the "+" button or use hotkey `Ctrl+N`

### Шаг 2: Заполните информацию / Step 2: Fill Information
- **Название** (Title): Название трека, альбома или плейлиста
- **Описание** (Description): Исполнитель, жанр, дополнительная информация
- **Год** (Year): Год выпуска
- **Рейтинг** (Rating): Ваша оценка (0-10)
- **Длительность** (Duration): Например, "3:45" или "45мин"
- **Постер** (Poster): Обложка альбома

### Шаг 3: Выберите источник / Step 3: Select Source
1. Перейдите на вкладку **"Музыка"** / Go to **"Music"** tab
2. Выберите платформу / Select platform
3. Вставьте ссылку / Paste link
4. Проверьте превью / Check preview

### Шаг 4: Сохраните / Step 4: Save
Нажмите "Сохранить" / Click "Save"

---

## Примеры использования / Usage Examples

### Пример 1: Spotify Плейлист / Example 1: Spotify Playlist
```
Название: Мой любимый плейлист
Описание: Подборка лучших треков 2026
Источник: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
```

### Пример 2: Яндекс.Музыка Альбом / Example 2: Yandex.Music Album
```
Название: Альбом исполнителя
Описание: Новый альбом 2026
Источник: https://music.yandex.ru/album/12345678
```

### Пример 3: SoundCloud Трек / Example 3: SoundCloud Track
```
Название: Название трека
Описание: Исполнитель - Название
Источник: https://soundcloud.com/artist/track-name
```

### Пример 4: Прямая ссылка / Example 4: Direct Link
```
Название: Аудиофайл
Описание: Локальный MP3 файл
Платформа: Прямая ссылка на аудио
Формат: MP3
Источник: https://example.com/audio.mp3
```

---

## Технические детали / Technical Details

### Music Sources Manager
Класс `MusicSourcesManager` автоматически:
- Определяет платформу по URL / Detects platform from URL
- Извлекает ID контента / Extracts content ID
- Генерирует embed URL / Generates embed URL
- Создает iframe с правильными параметрами / Creates iframe with correct parameters

### Поддерживаемые типы / Supported Types
- `track` / `song` - Отдельный трек
- `album` - Альбом
- `playlist` - Плейлист
- `artist` - Страница исполнителя
- `audio` - Прямой аудиофайл

### Хранение данных / Data Storage
Музыкальные данные сохраняются в IndexedDB со следующими полями:
- `sourceType`: `'music'`
- `sourceCategory`: `'music'`
- `musicPlatform`: Название платформы
- `musicType`: Тип контента (track, album, playlist)
- `sourceUrl`: Embed URL
- `originalMusicUrl`: Оригинальная ссылка
- `audioType`: Тип аудио (для прямых ссылок)

---

## Воспроизведение / Playback

### Стриминговые сервисы / Streaming Services
Музыка воспроизводится через встроенные плееры платформ в iframe.

Music plays through platform's embedded players in iframe.

### Прямые аудиофайлы / Direct Audio Files
Используется нативный HTML5 `<audio>` элемент с контролами.

Uses native HTML5 `<audio>` element with controls.

---

## Ограничения / Limitations

1. **Доступность контента** / Content Availability
   - Контент должен быть доступен на платформе
   - Content must be available on the platform

2. **Региональные ограничения** / Regional Restrictions
   - Некоторые треки могут быть недоступны в вашем регионе
   - Some tracks may be unavailable in your region

3. **Требуется подписка** / Subscription Required
   - Spotify, Apple Music, Deezer могут требовать подписку для полного доступа
   - Spotify, Apple Music, Deezer may require subscription for full access

4. **Прямые ссылки** / Direct Links
   - Файл должен быть доступен по прямой ссылке
   - File must be accessible via direct link
   - CORS политика сервера должна разрешать воспроизведение
   - Server CORS policy must allow playback

---

## Советы / Tips

1. **Используйте постеры** / Use Posters
   - Добавляйте обложки альбомов для лучшего визуального представления
   - Add album covers for better visual representation

2. **Организуйте в коллекции** / Organize in Collections
   - Создавайте коллекции по жанрам или настроению
   - Create collections by genre or mood

3. **Добавляйте описания** / Add Descriptions
   - Указывайте исполнителя, жанр, год
   - Specify artist, genre, year

4. **Проверяйте превью** / Check Preview
   - Всегда проверяйте превью перед сохранением
   - Always check preview before saving

---

## Примеры коллекций / Collection Examples

### Музыкальные коллекции / Music Collections
- 🎵 Любимые треки / Favorite Tracks
- 🎸 Рок музыка / Rock Music
- 🎹 Классическая музыка / Classical Music
- 🎧 Для работы / Work Music
- 🎤 Плейлисты / Playlists
- 💿 Альбомы 2026 / Albums 2026

---

## API Reference

### MusicSourcesManager

```javascript
// Определить источник
const source = musicSourcesManager.detectSource(url);

// Сгенерировать embed
const embedData = musicSourcesManager.generateEmbed(url);

// Создать iframe
const iframe = musicSourcesManager.createIframe(embedData);

// Проверить, является ли URL музыкальным
const isMusic = musicSourcesManager.isMusicSource(url);

// Получить список платформ
const platforms = musicSourcesManager.getSupportedPlatforms();
```

### Embed Data Structure
```javascript
{
    platform: 'spotify',           // ID платформы
    type: 'track',                 // Тип контента
    embedUrl: 'https://...',       // URL для embed
    originalUrl: 'https://...',    // Оригинальная ссылка
    platformName: 'Spotify'        // Название платформы
}
```

---

## Troubleshooting

### Проблема: Превью не загружается
**Решение**: Проверьте формат URL, убедитесь что ссылка корректная

### Проблема: Плеер не воспроизводит
**Решение**: 
- Проверьте доступность контента на платформе
- Убедитесь что у вас есть подписка (если требуется)
- Проверьте региональные ограничения

### Проблема: Прямая ссылка не работает
**Решение**:
- Убедитесь что файл доступен по прямой ссылке
- Проверьте CORS политику сервера
- Попробуйте открыть ссылку в браузере напрямую

---

## Будущие улучшения / Future Improvements

- [ ] Поддержка YouTube Music
- [ ] Поддержка Bandcamp
- [ ] Поддержка Mixcloud
- [ ] Автоматическое получение метаданных
- [ ] Синхронизация с музыкальными сервисами
- [ ] Создание плейлистов внутри приложения
- [ ] Экспорт плейлистов

---

**Версия**: 1.0.0  
**Дата**: 2026-02-21  
**Автор**: SerGioPlay
