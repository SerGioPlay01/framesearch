/**
 * Framesearch - Система управления видеоконтентом
 * Internationalization (i18n) Module
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 */

class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'ru';
        this.translations = {
            ru: {
                // Navigation
                'nav.home': 'Главная',
                'nav.back': 'На главную',
                'nav.search': 'Поиск',
                'nav.collections': 'Коллекции',
                'nav.import': 'Импорт',
                
                // Welcome screen
                'welcome.title': 'Добро пожаловать в Framesearch',
                'welcome.subtitle': 'Организуйте и управляйте видеоконтентом из различных источников',
                'welcome.add': 'Добавить первое видео',
                'welcome.or': 'или',
                'welcome.import': 'импортировать коллекцию',
                
                // Buttons
                'btn.add': 'Добавить контент',
                'btn.edit': 'Редактировать',
                'btn.delete': 'Удалить',
                'btn.save': 'Сохранить',
                'btn.cancel': 'Отмена',
                'btn.close': 'Закрыть',
                'btn.next': 'Далее',
                'btn.back': 'Назад',
                'btn.search': 'Поиск',
                'btn.filter': 'Фильтр',
                'btn.export': 'Экспорт',
                'btn.import': 'Импорт',
                'btn.share': 'Поделиться',
                'btn.play': 'Смотреть',
                
                // Filters
                'filter.all': 'Все',
                'filter.balancer': 'Балансеры',
                'filter.direct': 'Прямые ссылки',
                'filter.social': 'Соцсети',
                'filter.custom': 'Custom',
                'filter.favorites': 'Избранное',
                
                // Search
                'search.placeholder': 'Поиск видео...',
                'search.results': 'Результаты поиска',
                'search.noResults': 'Ничего не найдено',
                'search.found': 'Найдено',
                'search.videos': 'видео',
                
                // Modal - Steps
                'modal.step1': 'Информация',
                'modal.step2': 'Источник',
                
                // Modal - Information
                'modal.title.add': 'Добавить контент',
                'modal.title.edit': 'Редактировать контент',
                'modal.name': 'Название',
                'modal.name.placeholder': 'Введите название',
                'modal.name.required': 'Название *',
                'modal.description': 'Описание',
                'modal.description.placeholder': 'Краткое описание',
                'modal.year': 'Год выпуска',
                'modal.year.placeholder': '2026',
                'modal.rating': 'Рейтинг (0-10)',
                'modal.rating.placeholder': '8.5',
                'modal.duration': 'Длительность',
                'modal.duration.placeholder': '2ч 14мин',
                'modal.collection': 'Коллекция',
                'modal.collection.none': 'Без коллекции',
                'modal.poster': 'Постер',
                'modal.poster.url': 'Или вставьте URL изображения',
                'modal.poster.url.placeholder': 'https://example.com/poster.jpg',
                'modal.poster.upload': 'Выбрать файл',
                'modal.poster.drag': 'Перетащите изображение сюда',
                'modal.poster.or': 'или нажмите для выбора файла',
                
                // Modal - Source
                'modal.source': 'Источник видео',
                'modal.source.balancer': 'Балансер',
                'modal.source.balancer.desc': 'Видеобалансеры (Collaps, Kodik, Alloha и др.)',
                'modal.source.direct': 'Прямая ссылка',
                'modal.source.direct.desc': 'Прямые ссылки на видеофайлы',
                'modal.source.social': 'Соцсети',
                'modal.source.social.desc': 'YouTube, Vimeo, Rutube и др.',
                'modal.source.custom': 'Custom',
                'modal.source.custom.desc': 'Пользовательские источники',
                'modal.url': 'URL видео',
                'modal.url.placeholder': 'Вставьте ссылку на видео',
                
                // Video card
                'card.favorite': 'В избранное',
                'card.unfavorite': 'Убрать из избранного',
                'card.edit': 'Редактировать',
                'card.delete': 'Удалить',
                'card.share': 'Поделиться',
                'card.noDescription': 'Описание отсутствует',
                
                // Collections
                'collections.title': 'Коллекции',
                'collections.create': 'Создать коллекцию',
                'collections.empty': 'У вас пока нет коллекций',
                'collections.name': 'Название коллекции',
                'collections.videos': 'видео',
                'collections.back': 'Назад',
                'collections.empty.content': 'Коллекция пуста',
                
                // Import/Export
                'import.title': 'Импорт данных',
                'import.desc': 'Импортируйте вашу коллекцию из JSON файла',
                'import.select': 'Выбрать файл',
                'import.success': 'Данные успешно импортированы',
                'export.title': 'Экспорт данных',
                'export.desc': 'Экспортируйте вашу коллекцию в JSON файл',
                'export.button': 'Экспортировать',
                
                // Footer
                'footer.title': 'Framesearch',
                'footer.tagline': 'Локальное хранилище для вашей видеоколлекции',
                'footer.author': 'Разработчик',
                'footer.links': 'Ссылки',
                'footer.legal': 'Правовая информация',
                'footer.terms': 'Условия использования',
                'footer.privacy': 'Политика конфиденциальности',
                'footer.cookies': 'Cookies',
                'footer.disclaimer': 'Отказ от ответственности',
                'footer.license': 'Лицензии',
                'footer.copyright': '© 2026 Framesearch. Все права защищены.',
                
                // Messages
                'msg.deleteConfirm': 'Вы уверены, что хотите удалить это видео?',
                'msg.saved': 'Сохранено',
                'msg.deleted': 'Удалено',
                'msg.error': 'Произошла ошибка',
                'msg.required': 'Это поле обязательно',
                
                // Guide
                'guide.title': 'Полное руководство по Framesearch',
                'guide.welcome': 'Добро пожаловать!',
                'guide.close': 'Закрыть',
                
                // Welcome features
                'welcome.feature.storage': 'Локальное хранение',
                'welcome.feature.storage.desc': 'IndexedDB для быстрого доступа без серверов',
                'welcome.feature.pwa': 'PWA приложение',
                'welcome.feature.pwa.desc': 'Установите и работайте оффлайн',
                'welcome.feature.sources': '4 типа источников',
                'welcome.feature.sources.desc': 'Балансеры, прямые ссылки, соцсети, кастомный iframe',
                'welcome.feature.search': 'Умный поиск',
                'welcome.feature.search.desc': 'Мгновенный поиск по всей коллекции',
                'welcome.feature.collections': 'Коллекции',
                'welcome.feature.collections.desc': 'Организуйте видео в тематические папки',
                'welcome.feature.themes': 'Темы оформления',
                'welcome.feature.themes.desc': '6 готовых тем + полная кастомизация',
                'welcome.feature.share': 'Обмен данными',
                'welcome.feature.share.desc': 'Делитесь коллекциями по коду',
                'welcome.feature.privacy': 'Приватность',
                'welcome.feature.privacy.desc': 'Без серверов, без отслеживания',
                'welcome.feature.hotkeys': 'Горячие клавиши',
                'welcome.feature.hotkeys.desc': 'Ctrl+K для поиска, Ctrl+N для добавления',
                
                // Video player
                'player.loading': 'Загрузка видео...',
                'player.error': 'Ошибка загрузки видео',
                'player.back': 'Назад к коллекции',
                
                // Theme
                'theme.title': 'Темы оформления',
                'theme.settings': 'Настройка темы',
                'theme.description': 'Выберите готовую тему или создайте свою уникальную',
                'theme.tabs.presets': 'Готовые темы',
                'theme.tabs.custom': 'Кастомизация',
                'theme.default.name': 'Темная элегантность',
                'theme.default.desc': 'Классический темный стиль с синими акцентами',
                'theme.midnight': 'Фиолетовая ночь',
                'theme.midnight.desc': 'Мягкие фиолетовые тона для вечернего просмотра',
                'theme.ocean': 'Океанская свежесть',
                'theme.ocean.desc': 'Освежающие голубые и бирюзовые оттенки',
                'theme.forest': 'Лесная тишина',
                'theme.forest.desc': 'Успокаивающие зеленые тона природы',
                'theme.sunset': 'Закатное сияние',
                'theme.sunset.desc': 'Теплые оранжевые и розовые оттенки заката',
                'theme.rose': 'Розовая мечта',
                'theme.rose.desc': 'Нежные розовые оттенки для романтического настроения',
                'theme.mono': 'Monochrome',
                'theme.mono.desc': 'Минималистичный черно-белый стиль',
                'theme.custom': 'Пользовательская',
                'theme.custom.title': 'Создайте свою тему',
                'theme.custom.subtitle': 'Настройте цвета и параметры интерфейса',
                'theme.custom.bg.primary': 'Основной фон',
                'theme.custom.bg.secondary': 'Вторичный фон',
                'theme.custom.bg.tertiary': 'Третичный фон',
                'theme.custom.text.primary': 'Основной текст',
                'theme.custom.text.secondary': 'Вторичный текст',
                'theme.custom.accent.primary': 'Основной акцент',
                'theme.custom.accent.secondary': 'Вторичный акцент',
                'theme.custom.border.radius': 'Скругление углов',
                'theme.custom.hover.scale': 'Масштаб при наведении',
                'theme.custom.reset': 'Сбросить',
                'theme.custom.apply': 'Применить',
                'theme.custom.preview': 'Предпросмотр',
                'theme.custom.preview.card': 'Пример карточки',
                'theme.custom.preview.badge': 'HD',
                'theme.custom.preview.text': 'Текст описания с вторичным цветом',
                'theme.custom.preview.button': 'Кнопка',
                
                // Cookie consent
                'cookie.title': 'Мы используем cookies',
                'cookie.message': 'Этот сайт использует cookies для улучшения пользовательского опыта.',
                'cookie.accept': 'Принять все',
                'cookie.decline': 'Отклонить все',
                'cookie.settings': 'Настроить',
                'cookie.save': 'Сохранить настройки',
                'cookie.required': 'Обязательно',
                'cookie.settings.title': 'Настройки конфиденциальности',
                'cookie.settings.intro': 'Управляйте тем, какие данные может использовать приложение. Все данные хранятся локально и не передаются на серверы.',
                'cookie.category.necessary': 'Необходимые',
                'cookie.category.necessary.desc': 'Требуются для работы приложения',
                'cookie.category.functional': 'Функциональные',
                'cookie.category.functional.desc': 'Улучшают функциональность (темы, настройки)',
                'cookie.category.analytics': 'Аналитика',
                'cookie.category.analytics.desc': 'Помогают понять использование приложения',
                'cookie.category.external': 'Внешние сервисы',
                'cookie.category.external.desc': 'Видеобалансеры и сторонние iframe',
                'cookie.info.local.title': 'Локальное хранение',
                'cookie.info.local.desc': 'Все ваши данные хранятся только на этом устройстве',
                'cookie.info.tracking.title': 'Без отслеживания',
                'cookie.info.tracking.desc': 'Мы не используем аналитику или рекламные сети',
                'cookie.info.control.title': 'Ваш контроль',
                'cookie.info.control.desc': 'Вы можете удалить все данные в любой момент',
                'cookie.action.clear': 'Удалить все данные',
                'cookie.action.export': 'Экспорт данных',
                'cookie.notif.saved': 'Настройки сохранены',
                'cookie.notif.minimal': 'Только необходимые cookies',
                'cookie.notif.cleared': 'Все данные удалены',
                'cookie.notif.exported': 'Данные экспортированы',
                'cookie.confirm.clear': 'Вы уверены? Это удалит все ваши данные, включая видео, коллекции и настройки.',
                'cookie.confirm.title': 'Удалить все данные',
                'cookie.blocked': 'Внешний контент заблокирован',
                'cookie.blocked.action': 'Изменить настройки',
                
                // Legal pages
                'legal.terms': 'Условия использования',
                'legal.privacy': 'Политика конфиденциальности',
                'legal.cookies': 'Политика cookies',
                'legal.disclaimer': 'Отказ от ответственности',
                'legal.license': 'Лицензия',
                
                // Validation
                'validation.required': 'Обязательное поле',
                'validation.url': 'Введите корректный URL',
                'validation.minLength': 'Минимум {0} символов',
                'validation.maxLength': 'Максимум {0} символов',
                
                // Notifications
                'notif.saved': 'Изменения сохранены',
                'notif.deleted': 'Видео удалено',
                'notif.added': 'Видео добавлено',
                'notif.updated': 'Видео обновлено',
                'notif.exported': 'Данные экспортированы',
                'notif.imported': 'Данные импортированы',
                'notif.error': 'Произошла ошибка',
                'notif.copied': 'Скопировано в буфер обмена',
                
                // Shortcuts
                'shortcuts.title': 'Горячие клавиши',
                'shortcuts.search': 'Открыть поиск',
                'shortcuts.add': 'Добавить контент',
                'shortcuts.export': 'Экспорт данных',
                'shortcuts.import': 'Импорт данных',
                'shortcuts.close': 'Закрыть',
                'shortcuts.help': 'Показать справку',
                
                // Use cases
                'usecase.title': 'Примеры использования',
                'usecase.intro': 'Framesearch идеально подходит для различных сценариев организации видеоконтента',
                'usecase.library.title': 'Личная медиатека',
                'usecase.library.desc': 'Создайте каталог всех фильмов и сериалов, которые вы хотите посмотреть. Добавляйте ссылки на видеобалансеры, сохраняйте постеры и описания.',
                'usecase.library.example': 'Пример: Коллекция "К просмотру" с фильмами из списка IMDb Top 250',
                'usecase.family.title': 'Семейная коллекция',
                'usecase.family.desc': 'Организуйте семейные фильмы по категориям: детские мультфильмы, семейные комедии, образовательные видео. Делитесь коллекциями между устройствами.',
                'usecase.family.example': 'Пример: Папки "Для детей", "Семейный вечер", "Образовательное"',
                'usecase.thematic.title': 'Тематические подборки',
                'usecase.thematic.desc': 'Создавайте коллекции по жанрам, режиссерам или настроению. Отмечайте избранное, добавляйте рейтинги и заметки.',
                'usecase.thematic.example': 'Пример: "Классика кино", "Для вечера пятницы", "Документальное"',
                'usecase.education.title': 'Образовательный контент',
                'usecase.education.desc': 'Собирайте обучающие видео, лекции, курсы. Организуйте по темам и отслеживайте прогресс просмотра.',
                'usecase.education.example': 'Пример: Курсы программирования, языковые уроки, научные лекции',
                
                // Guide content
                'guide.getting_started': 'Начало работы',
                'guide.step1': 'Шаг 1: Добавьте первое видео',
                'guide.step1.desc': 'Нажмите кнопку "Добавить контент" и заполните информацию о видео',
                'guide.step2': 'Шаг 2: Выберите тип источника',
                'guide.step2.desc': 'Балансер, прямая ссылка, соцсети или custom iframe',
                'guide.step3': 'Шаг 3: Вставьте URL видео',
                'guide.step3.desc': 'Скопируйте ссылку на видео из вашего источника',
                'guide.step4': 'Шаг 4: Сохраните и наслаждайтесь',
                'guide.step4.desc': 'Видео появится в вашей коллекции',
                'guide.sources': 'Типы источников видео',
                'guide.sources.desc': 'Framesearch поддерживает 4 типа источников для максимальной гибкости',
                'guide.filters': 'Фильтры и поиск',
                'guide.filters.desc': 'Используйте фильтры для быстрого доступа к нужному контенту',
                'guide.tips': 'Полезные советы',
                'guide.tip1': 'Используйте Drag & Drop для загрузки постеров',
                'guide.tip2': 'Нажмите Ctrl+K для быстрого поиска',
                'guide.tip3': 'Создавайте коллекции для организации контента',
                'guide.tip4': 'Экспортируйте данные для резервного копирования',
                'guide.tip5': 'Делитесь коллекциями с друзьями по коду',
                'guide.pwa': 'Установка PWA приложения',
                'guide.pwa.benefits': 'Преимущества установки:',
                'guide.pwa.benefit1': 'Работа в оффлайн режиме',
                'guide.pwa.benefit2': 'Быстрый запуск с рабочего стола',
                'guide.pwa.benefit3': 'Полноэкранный режим без браузерных элементов',
                'guide.pwa.benefit4': 'Автоматические обновления',
                'guide.pwa.install': 'Как установить:',
                'guide.pwa.install1': 'Нажмите кнопку "Установить приложение" в футере',
                'guide.pwa.install2': 'Или используйте меню браузера: "Установить приложение"',
                'guide.pwa.install3': 'На Android: меню → "Добавить на главный экран"',
                'guide.pwa.install4': 'На iOS: "Поделиться" → "На экран Домой"',
                'guide.privacy': 'Конфиденциальность и безопасность',
                'guide.privacy.storage': 'Локальное хранение:',
                'guide.privacy.storage1': 'Все данные хранятся только на вашем устройстве',
                'guide.privacy.storage2': 'Используется IndexedDB браузера',
                'guide.privacy.storage3': 'Никакие данные не отправляются на серверы',
                'guide.privacy.manage': 'Управление данными:',
                'guide.privacy.manage1': 'Нажмите кнопку с иконкой щита (справа внизу)',
                'guide.privacy.manage2': 'Настройте разрешения для cookies и скриптов',
                'guide.privacy.manage3': 'Экспортируйте данные для резервного копирования',
                'guide.privacy.manage4': 'Удалите все данные при необходимости',
                'guide.tips.advanced': 'Полезные советы',
                'guide.tips.favorites': 'Используйте избранное',
                'guide.tips.favorites.desc': 'Отмечайте лучшие видео звездочкой для быстрого доступа',
                'guide.tips.organize': 'Организуйте коллекции',
                'guide.tips.organize.desc': 'Создавайте тематические папки по источникам или темам',
                'guide.tips.export': 'Регулярный экспорт',
                'guide.tips.export.desc': 'Создавайте резервные копии коллекции раз в месяц',
                'guide.tips.dragdrop': 'Drag & Drop постеров',
                'guide.tips.dragdrop.desc': 'Перетаскивайте изображения прямо в зону загрузки',
                'guide.tips.descriptions': 'Подробные описания',
                'guide.tips.descriptions.desc': 'Добавляйте заметки и впечатления в описание видео',
                'guide.tips.hotkeys': 'Горячие клавиши',
                'guide.tips.hotkeys.desc': 'Используйте Ctrl+K и Ctrl+N для быстрой работы',
                'guide.shortcuts': 'Горячие клавиши',
                'guide.shortcuts.search': 'Открыть поиск',
                'guide.shortcuts.add': 'Добавить новое видео',
                'guide.shortcuts.close': 'Закрыть модальное окно',
                
                // Quick start
                'quickstart.title': 'Быстрый старт',
                'quickstart.step1.title': 'Добавьте видео',
                'quickstart.step1.desc': 'Нажмите кнопку "+" и заполните информацию о фильме или сериале',
                'quickstart.step2.title': 'Выберите источник',
                'quickstart.step2.desc': '4 варианта: балансеры (Kodik, Vibix и др.), прямые ссылки, соцсети (YouTube, VK, RuTube) или кастомный iframe',
                'quickstart.step3.title': 'Создайте коллекции',
                'quickstart.step3.desc': 'Организуйте видео в тематические папки для удобной навигации',
                'quickstart.step4.title': 'Настройте под себя',
                'quickstart.step4.desc': 'Выберите тему оформления и установите приложение для оффлайн доступа',
                'quickstart.features': '💡 Полезные возможности',
                'quickstart.pwa.title': 'Установка PWA',
                'quickstart.pwa.desc': 'Установите приложение на устройство для быстрого доступа',
                'quickstart.encryption.title': 'Шифрование',
                'quickstart.encryption.desc': 'Экспортируйте данные с паролем для безопасного обмена',
                'quickstart.search.title': 'Быстрый поиск',
                'quickstart.search.desc': 'Используйте поиск по названию, жанру или году',
                'quickstart.favorites.title': 'Избранное',
                'quickstart.favorites.desc': 'Отмечайте любимые фильмы для быстрого доступа',
                'quickstart.hotkeys.title': 'Горячие клавиши',
                'quickstart.hotkeys.desc': 'Ctrl+K для поиска, Ctrl+N для добавления, Esc для закрытия'
            },
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.back': 'Back to Home',
                'nav.search': 'Search',
                'nav.collections': 'Collections',
                'nav.import': 'Import',
                
                // Welcome screen
                'welcome.title': 'Welcome to Framesearch',
                'welcome.subtitle': 'Organize and manage video content from various sources',
                'welcome.add': 'Add first video',
                'welcome.or': 'or',
                'welcome.import': 'import collection',
                
                // Buttons
                'btn.add': 'Add Content',
                'btn.edit': 'Edit',
                'btn.delete': 'Delete',
                'btn.save': 'Save',
                'btn.cancel': 'Cancel',
                'btn.close': 'Close',
                'btn.next': 'Next',
                'btn.back': 'Back',
                'btn.search': 'Search',
                'btn.filter': 'Filter',
                'btn.export': 'Export',
                'btn.import': 'Import',
                'btn.share': 'Share',
                'btn.play': 'Watch',
                
                // Filters
                'filter.all': 'All',
                'filter.balancer': 'Balancers',
                'filter.direct': 'Direct Links',
                'filter.social': 'Social Media',
                'filter.custom': 'Custom',
                'filter.favorites': 'Favorites',
                
                // Search
                'search.placeholder': 'Search videos...',
                'search.results': 'Search Results',
                'search.noResults': 'No results found',
                'search.found': 'Found',
                'search.videos': 'videos',
                
                // Modal - Steps
                'modal.step1': 'Information',
                'modal.step2': 'Source',
                
                // Modal - Information
                'modal.title.add': 'Add Content',
                'modal.title.edit': 'Edit Content',
                'modal.name': 'Title',
                'modal.name.placeholder': 'Enter title',
                'modal.name.required': 'Title *',
                'modal.description': 'Description',
                'modal.description.placeholder': 'Brief description',
                'modal.year': 'Release Year',
                'modal.year.placeholder': '2026',
                'modal.rating': 'Rating (0-10)',
                'modal.rating.placeholder': '8.5',
                'modal.duration': 'Duration',
                'modal.duration.placeholder': '2h 14min',
                'modal.collection': 'Collection',
                'modal.collection.none': 'No Collection',
                'modal.poster': 'Poster',
                'modal.poster.url': 'Or paste image URL',
                'modal.poster.url.placeholder': 'https://example.com/poster.jpg',
                'modal.poster.upload': 'Choose File',
                'modal.poster.drag': 'Drag image here',
                'modal.poster.or': 'or click to select file',
                
                // Modal - Source
                'modal.source': 'Video Source',
                'modal.source.balancer': 'Balancer',
                'modal.source.balancer.desc': 'Video balancers (Collaps, Kodik, Alloha, etc.)',
                'modal.source.direct': 'Direct Link',
                'modal.source.direct.desc': 'Direct links to video files',
                'modal.source.social': 'Social Media',
                'modal.source.social.desc': 'YouTube, Vimeo, Rutube, etc.',
                'modal.source.custom': 'Custom',
                'modal.source.custom.desc': 'Custom sources',
                'modal.url': 'Video URL',
                'modal.url.placeholder': 'Paste video link',
                
                // Video card
                'card.favorite': 'Add to favorites',
                'card.unfavorite': 'Remove from favorites',
                'card.edit': 'Edit',
                'card.delete': 'Delete',
                'card.share': 'Share',
                'card.noDescription': 'No description',
                
                // Collections
                'collections.title': 'Collections',
                'collections.create': 'Create Collection',
                'collections.empty': 'You don\'t have any collections yet',
                'collections.name': 'Collection Name',
                'collections.videos': 'videos',
                'collections.back': 'Back',
                'collections.empty.content': 'Collection is empty',
                
                // Import/Export
                'import.title': 'Import Data',
                'import.desc': 'Import your collection from JSON file',
                'import.select': 'Select File',
                'import.success': 'Data imported successfully',
                'export.title': 'Export Data',
                'export.desc': 'Export your collection to JSON file',
                'export.button': 'Export',
                
                // Footer
                'footer.title': 'Framesearch',
                'footer.tagline': 'Local storage for your video collection',
                'footer.author': 'Developer',
                'footer.links': 'Links',
                'footer.legal': 'Legal',
                'footer.terms': 'Terms of Service',
                'footer.privacy': 'Privacy Policy',
                'footer.cookies': 'Cookies',
                'footer.disclaimer': 'Disclaimer',
                'footer.license': 'Licenses',
                'footer.copyright': '© 2026 Framesearch. All rights reserved.',
                
                // Messages
                'msg.deleteConfirm': 'Are you sure you want to delete this video?',
                'msg.saved': 'Saved',
                'msg.deleted': 'Deleted',
                'msg.error': 'An error occurred',
                'msg.required': 'This field is required',
                
                // Guide
                'guide.title': 'Complete Framesearch Guide',
                'guide.welcome': 'Welcome!',
                'guide.close': 'Close',
                
                // Welcome features
                'welcome.feature.storage': 'Local Storage',
                'welcome.feature.storage.desc': 'IndexedDB for fast access without servers',
                'welcome.feature.pwa': 'PWA Application',
                'welcome.feature.pwa.desc': 'Install and work offline',
                'welcome.feature.sources': '4 Source Types',
                'welcome.feature.sources.desc': 'Balancers, direct links, social media, custom iframe',
                'welcome.feature.search': 'Smart Search',
                'welcome.feature.search.desc': 'Instant search across entire collection',
                'welcome.feature.collections': 'Collections',
                'welcome.feature.collections.desc': 'Organize videos into thematic folders',
                'welcome.feature.themes': 'Themes',
                'welcome.feature.themes.desc': '6 ready-made themes + full customization',
                'welcome.feature.share': 'Data Sharing',
                'welcome.feature.share.desc': 'Share collections via code',
                'welcome.feature.privacy': 'Privacy',
                'welcome.feature.privacy.desc': 'No servers, no tracking',
                'welcome.feature.hotkeys': 'Keyboard Shortcuts',
                'welcome.feature.hotkeys.desc': 'Ctrl+K for search, Ctrl+N to add',
                
                // Video player
                'player.loading': 'Loading video...',
                'player.error': 'Error loading video',
                'player.back': 'Back to collection',
                
                // Theme
                'theme.title': 'Themes',
                'theme.settings': 'Theme Settings',
                'theme.description': 'Choose a ready-made theme or create your own unique one',
                'theme.tabs.presets': 'Ready Themes',
                'theme.tabs.custom': 'Customization',
                'theme.default.name': 'Dark Elegance',
                'theme.default.desc': 'Classic dark style with blue accents',
                'theme.midnight': 'Purple Night',
                'theme.midnight.desc': 'Soft purple tones for evening viewing',
                'theme.ocean': 'Ocean Freshness',
                'theme.ocean.desc': 'Refreshing blue and turquoise shades',
                'theme.forest': 'Forest Silence',
                'theme.forest.desc': 'Calming green tones of nature',
                'theme.sunset': 'Sunset Glow',
                'theme.sunset.desc': 'Warm orange and pink sunset shades',
                'theme.rose': 'Pink Dream',
                'theme.rose.desc': 'Delicate pink shades for romantic mood',
                'theme.mono': 'Monochrome',
                'theme.mono.desc': 'Minimalist black and white style',
                'theme.custom': 'Custom',
                'theme.custom.title': 'Create Your Theme',
                'theme.custom.subtitle': 'Customize colors and interface parameters',
                'theme.custom.bg.primary': 'Primary Background',
                'theme.custom.bg.secondary': 'Secondary Background',
                'theme.custom.bg.tertiary': 'Tertiary Background',
                'theme.custom.text.primary': 'Primary Text',
                'theme.custom.text.secondary': 'Secondary Text',
                'theme.custom.accent.primary': 'Primary Accent',
                'theme.custom.accent.secondary': 'Secondary Accent',
                'theme.custom.border.radius': 'Border Radius',
                'theme.custom.hover.scale': 'Hover Scale',
                'theme.custom.reset': 'Reset',
                'theme.custom.apply': 'Apply',
                'theme.custom.preview': 'Preview',
                'theme.custom.preview.card': 'Example Card',
                'theme.custom.preview.badge': 'HD',
                'theme.custom.preview.text': 'Description text with secondary color',
                'theme.custom.preview.button': 'Button',
                
                // Cookie consent
                'cookie.title': 'We use cookies',
                'cookie.message': 'This site uses cookies to improve user experience.',
                'cookie.accept': 'Accept All',
                'cookie.decline': 'Reject All',
                'cookie.settings': 'Customize',
                'cookie.save': 'Save Settings',
                'cookie.required': 'Required',
                'cookie.settings.title': 'Privacy Settings',
                'cookie.settings.intro': 'Manage what data the application can use. All data is stored locally and not transmitted to servers.',
                'cookie.category.necessary': 'Necessary',
                'cookie.category.necessary.desc': 'Required for application functionality',
                'cookie.category.functional': 'Functional',
                'cookie.category.functional.desc': 'Enhance functionality (themes, settings)',
                'cookie.category.analytics': 'Analytics',
                'cookie.category.analytics.desc': 'Help understand application usage',
                'cookie.category.external': 'External Services',
                'cookie.category.external.desc': 'Video balancers and third-party iframes',
                'cookie.info.local.title': 'Local Storage',
                'cookie.info.local.desc': 'All your data is stored only on this device',
                'cookie.info.tracking.title': 'No Tracking',
                'cookie.info.tracking.desc': 'We don\'t use analytics or advertising networks',
                'cookie.info.control.title': 'Your Control',
                'cookie.info.control.desc': 'You can delete all data at any time',
                'cookie.action.clear': 'Delete All Data',
                'cookie.action.export': 'Export Data',
                'cookie.notif.saved': 'Settings saved',
                'cookie.notif.minimal': 'Only necessary cookies',
                'cookie.notif.cleared': 'All data deleted',
                'cookie.notif.exported': 'Data exported',
                'cookie.confirm.clear': 'Are you sure? This will delete all your data, including videos, collections, and settings.',
                'cookie.confirm.title': 'Delete All Data',
                'cookie.blocked': 'External content blocked',
                'cookie.blocked.action': 'Change Settings',
                
                // Legal pages
                'legal.terms': 'Terms of Service',
                'legal.privacy': 'Privacy Policy',
                'legal.cookies': 'Cookie Policy',
                'legal.disclaimer': 'Disclaimer',
                'legal.license': 'License',
                
                // Validation
                'validation.required': 'Required field',
                'validation.url': 'Enter valid URL',
                'validation.minLength': 'Minimum {0} characters',
                'validation.maxLength': 'Maximum {0} characters',
                
                // Notifications
                'notif.saved': 'Changes saved',
                'notif.deleted': 'Video deleted',
                'notif.added': 'Video added',
                'notif.updated': 'Video updated',
                'notif.exported': 'Data exported',
                'notif.imported': 'Data imported',
                'notif.error': 'An error occurred',
                'notif.copied': 'Copied to clipboard',
                
                // Shortcuts
                'shortcuts.title': 'Keyboard Shortcuts',
                'shortcuts.search': 'Open search',
                'shortcuts.add': 'Add content',
                'shortcuts.export': 'Export data',
                'shortcuts.import': 'Import data',
                'shortcuts.close': 'Close',
                'shortcuts.help': 'Show help',
                
                // Use cases
                'usecase.title': 'Use Cases',
                'usecase.intro': 'Framesearch is perfect for various video content organization scenarios',
                'usecase.library.title': 'Personal Media Library',
                'usecase.library.desc': 'Create a catalog of all movies and series you want to watch. Add links to video balancers, save posters and descriptions.',
                'usecase.library.example': 'Example: "To Watch" collection with movies from IMDb Top 250',
                'usecase.family.title': 'Family Collection',
                'usecase.family.desc': 'Organize family movies by categories: kids cartoons, family comedies, educational videos. Share collections between devices.',
                'usecase.family.example': 'Example: Folders "For Kids", "Family Night", "Educational"',
                'usecase.thematic.title': 'Thematic Collections',
                'usecase.thematic.desc': 'Create collections by genres, directors, or mood. Mark favorites, add ratings and notes.',
                'usecase.thematic.example': 'Example: "Cinema Classics", "Friday Night", "Documentary"',
                'usecase.education.title': 'Educational Content',
                'usecase.education.desc': 'Collect educational videos, lectures, courses. Organize by topics and track viewing progress.',
                'usecase.education.example': 'Example: Programming courses, language lessons, scientific lectures',
                
                // Guide content
                'guide.getting_started': 'Getting Started',
                'guide.step1': 'Step 1: Add your first video',
                'guide.step1.desc': 'Click "Add Content" button and fill in video information',
                'guide.step2': 'Step 2: Choose source type',
                'guide.step2.desc': 'Balancer, direct link, social media, or custom iframe',
                'guide.step3': 'Step 3: Paste video URL',
                'guide.step3.desc': 'Copy the video link from your source',
                'guide.step4': 'Step 4: Save and enjoy',
                'guide.step4.desc': 'Video will appear in your collection',
                'guide.sources': 'Video Source Types',
                'guide.sources.desc': 'Framesearch supports 4 source types for maximum flexibility',
                'guide.filters': 'Filters and Search',
                'guide.filters.desc': 'Use filters for quick access to needed content',
                'guide.tips': 'Useful Tips',
                'guide.tip1': 'Use Drag & Drop to upload posters',
                'guide.tip2': 'Press Ctrl+K for quick search',
                'guide.tip3': 'Create collections to organize content',
                'guide.tip4': 'Export data for backup',
                'guide.tip5': 'Share collections with friends via code',
                'guide.pwa': 'Installing PWA Application',
                'guide.pwa.benefits': 'Installation Benefits:',
                'guide.pwa.benefit1': 'Works offline',
                'guide.pwa.benefit2': 'Quick launch from desktop',
                'guide.pwa.benefit3': 'Full-screen mode without browser elements',
                'guide.pwa.benefit4': 'Automatic updates',
                'guide.pwa.install': 'How to Install:',
                'guide.pwa.install1': 'Click "Install App" button in footer',
                'guide.pwa.install2': 'Or use browser menu: "Install App"',
                'guide.pwa.install3': 'On Android: menu → "Add to Home Screen"',
                'guide.pwa.install4': 'On iOS: "Share" → "Add to Home Screen"',
                'guide.privacy': 'Privacy and Security',
                'guide.privacy.storage': 'Local Storage:',
                'guide.privacy.storage1': 'All data is stored only on your device',
                'guide.privacy.storage2': 'Uses browser IndexedDB',
                'guide.privacy.storage3': 'No data is sent to servers',
                'guide.privacy.manage': 'Data Management:',
                'guide.privacy.manage1': 'Click shield icon button (bottom right)',
                'guide.privacy.manage2': 'Configure permissions for cookies and scripts',
                'guide.privacy.manage3': 'Export data for backup',
                'guide.privacy.manage4': 'Delete all data if needed',
                'guide.tips.advanced': 'Useful Tips',
                'guide.tips.favorites': 'Use Favorites',
                'guide.tips.favorites.desc': 'Mark best videos with star for quick access',
                'guide.tips.organize': 'Organize Collections',
                'guide.tips.organize.desc': 'Create thematic folders by sources or topics',
                'guide.tips.export': 'Regular Export',
                'guide.tips.export.desc': 'Create collection backups monthly',
                'guide.tips.dragdrop': 'Drag & Drop Posters',
                'guide.tips.dragdrop.desc': 'Drag images directly to upload zone',
                'guide.tips.descriptions': 'Detailed Descriptions',
                'guide.tips.descriptions.desc': 'Add notes and impressions to video description',
                'guide.tips.hotkeys': 'Keyboard Shortcuts',
                'guide.tips.hotkeys.desc': 'Use Ctrl+K and Ctrl+N for quick work',
                'guide.shortcuts': 'Keyboard Shortcuts',
                'guide.shortcuts.search': 'Open search',
                'guide.shortcuts.add': 'Add new video',
                'guide.shortcuts.close': 'Close modal',
                
                // Quick start
                'quickstart.title': 'Quick Start',
                'quickstart.step1.title': 'Add Video',
                'quickstart.step1.desc': 'Click "+" button and fill in movie or series information',
                'quickstart.step2.title': 'Choose Source',
                'quickstart.step2.desc': '4 options: balancers (Kodik, Vibix, etc.), direct links, social media (YouTube, VK, RuTube) or custom iframe',
                'quickstart.step3.title': 'Create Collections',
                'quickstart.step3.desc': 'Organize videos into thematic folders for easy navigation',
                'quickstart.step4.title': 'Customize',
                'quickstart.step4.desc': 'Choose theme and install app for offline access',
                'quickstart.features': '💡 Useful Features',
                'quickstart.pwa.title': 'PWA Installation',
                'quickstart.pwa.desc': 'Install app on device for quick access',
                'quickstart.encryption.title': 'Encryption',
                'quickstart.encryption.desc': 'Export data with password for secure sharing',
                'quickstart.search.title': 'Quick Search',
                'quickstart.search.desc': 'Search by title, genre, or year',
                'quickstart.favorites.title': 'Favorites',
                'quickstart.favorites.desc': 'Mark favorite movies for quick access',
                'quickstart.hotkeys.title': 'Keyboard Shortcuts',
                'quickstart.hotkeys.desc': 'Ctrl+K for search, Ctrl+N to add, Esc to close'
            }
        };
    }

    t(key) {
        return this.translations[this.currentLang][key] || key;
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('language', lang);
            this.updatePageContent();
            document.documentElement.lang = lang;
        }
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    updatePageContent() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update all elements with data-i18n-html attribute (for HTML content)
        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            element.innerHTML = this.t(key);
        });

        // Trigger custom event for components that need to update
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
    }

    init() {
        document.documentElement.lang = this.currentLang;
        // Don't call updatePageContent immediately to avoid triggering loadVideos before DB is ready
        // Just update static elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
    }
}

// Initialize i18n
const i18n = new I18n();
window.i18n = i18n; // Make it globally accessible

// Auto-initialize when DOM is ready (but don't trigger events yet)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}
