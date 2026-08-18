// Страны больше не нужны — загружаются из REST Countries API
// countryCca2 — ISO 3166-1 alpha-2 код страны
// predefId для городов: используем cca2-суффикс

export const seedCities = [
  // Италия (IT) — столица Рим уже из API, добавляем остальные
  { predefId: 'IT-florence', countryCca2: 'IT', name: 'Флоренция', coords: { lat: 43.7696, lng: 11.2558 } },
  { predefId: 'IT-venice', countryCca2: 'IT', name: 'Венеция', coords: { lat: 45.4408, lng: 12.3155 } },
  { predefId: 'IT-milan', countryCca2: 'IT', name: 'Милан', coords: { lat: 45.4642, lng: 9.1900 } },
  { predefId: 'IT-naples', countryCca2: 'IT', name: 'Неаполь', coords: { lat: 40.8518, lng: 14.2681 } },
  // Франция (FR) — Париж из API
  { predefId: 'FR-lyon', countryCca2: 'FR', name: 'Лион', coords: { lat: 45.7640, lng: 4.8357 } },
  { predefId: 'FR-nice', countryCca2: 'FR', name: 'Ницца', coords: { lat: 43.7102, lng: 7.2620 } },
  { predefId: 'FR-marseille', countryCca2: 'FR', name: 'Марсель', coords: { lat: 43.2965, lng: 5.3698 } },
  // Испания (ES) — Мадрид из API
  { predefId: 'ES-barcelona', countryCca2: 'ES', name: 'Барселона', coords: { lat: 41.3874, lng: 2.1686 } },
  { predefId: 'ES-seville', countryCca2: 'ES', name: 'Севилья', coords: { lat: 37.3891, lng: -5.9845 } },
  { predefId: 'ES-valencia', countryCca2: 'ES', name: 'Валенсия', coords: { lat: 39.4699, lng: -0.3763 } },
  // Германия (DE) — Берлин из API
  { predefId: 'DE-munich', countryCca2: 'DE', name: 'Мюнхен', coords: { lat: 48.1351, lng: 11.5820 } },
  { predefId: 'DE-hamburg', countryCca2: 'DE', name: 'Гамбург', coords: { lat: 53.5511, lng: 9.9937 } },
  // Великобритания (GB) — Лондон из API
  { predefId: 'GB-edinburgh', countryCca2: 'GB', name: 'Эдинбург', coords: { lat: 55.9533, lng: -3.1883 } },
  { predefId: 'GB-manchester', countryCca2: 'GB', name: 'Манчестер', coords: { lat: 53.4808, lng: -2.2426 } },
  // Япония (JP) — Токио из API
  { predefId: 'JP-kyoto', countryCca2: 'JP', name: 'Киото', coords: { lat: 35.0116, lng: 135.7681 } },
  { predefId: 'JP-osaka', countryCca2: 'JP', name: 'Осака', coords: { lat: 34.6937, lng: 135.5023 } },
  // Таиланд (TH) — Бангкок из API
  { predefId: 'TH-phuket', countryCca2: 'TH', name: 'Пхукет', coords: { lat: 7.8804, lng: 98.3923 } },
  { predefId: 'TH-chiang-mai', countryCca2: 'TH', name: 'Чиангмай', coords: { lat: 18.7883, lng: 98.9853 } },
  // Турция (TR) — Анкара из API, добавляем Стамбул и Анталью
  { predefId: 'TR-istanbul', countryCca2: 'TR', name: 'Стамбул', coords: { lat: 41.0082, lng: 28.9784 } },
  { predefId: 'TR-antalya', countryCca2: 'TR', name: 'Анталья', coords: { lat: 36.8969, lng: 30.7133 } },
  // США (US) — Washington из API
  { predefId: 'US-nyc', countryCca2: 'US', name: 'Нью-Йорк', coords: { lat: 40.7128, lng: -74.0060 } },
  { predefId: 'US-la', countryCca2: 'US', name: 'Лос-Анджелес', coords: { lat: 34.0522, lng: -118.2437 } },
  { predefId: 'US-chicago', countryCca2: 'US', name: 'Чикаго', coords: { lat: 41.8781, lng: -87.6298 } },
  // Португалия (PT) — Лиссабон из API
  { predefId: 'PT-porto', countryCca2: 'PT', name: 'Порту', coords: { lat: 41.1579, lng: -8.6291 } },
  // Греция (GR) — Афины из API
  { predefId: 'GR-santorini', countryCca2: 'GR', name: 'Санторини', coords: { lat: 36.3932, lng: 25.4615 } },
  // Египет (EG) — Каир из API
  { predefId: 'EG-hurghada', countryCca2: 'EG', name: 'Хургада', coords: { lat: 27.2579, lng: 33.8116 } },
  // ОАЭ (AE) — Абу-Даби из API
  { predefId: 'AE-dubai', countryCca2: 'AE', name: 'Дубай', coords: { lat: 25.2048, lng: 55.2708 } },
  // Китай (CN) — Пекин из API
  { predefId: 'CN-shanghai', countryCca2: 'CN', name: 'Шанхай', coords: { lat: 31.2304, lng: 121.4737 } },
  // Австралия (AU) — Канберра из API
  { predefId: 'AU-sydney', countryCca2: 'AU', name: 'Сидней', coords: { lat: -33.8688, lng: 151.2093 } },
  { predefId: 'AU-melbourne', countryCca2: 'AU', name: 'Мельбурн', coords: { lat: -37.8136, lng: 144.9631 } },
  // Бразилия (BR) — Бразилиа из API
  { predefId: 'BR-rio', countryCca2: 'BR', name: 'Рио-де-Жанейро', coords: { lat: -22.9068, lng: -43.1729 } },
  { predefId: 'BR-sao-paulo', countryCca2: 'BR', name: 'Сан-Паулу', coords: { lat: -23.5505, lng: -46.6333 } },
  // Мексика (MX) — Мехико из API
  { predefId: 'MX-cancun', countryCca2: 'MX', name: 'Канкун', coords: { lat: 21.1619, lng: -86.8515 } },
  // Индия (IN) — Нью-Дели из API
  { predefId: 'IN-mumbai', countryCca2: 'IN', name: 'Мумбаи', coords: { lat: 19.0760, lng: 72.8777 } },
  // Южная Корея (KR) — Сеул из API
  { predefId: 'KR-busan', countryCca2: 'KR', name: 'Пусан', coords: { lat: 35.1796, lng: 129.0756 } },
  // Чехия (CZ) — Прага из API
  { predefId: 'CZ-brno', countryCca2: 'CZ', name: 'Брно', coords: { lat: 49.1951, lng: 16.6068 } },
];

export const seedAttractions = [
  // Рим (IT-capital)
  { predefId: 'IT-colosseum', cityPredefId: 'IT-capital', name: 'Колизей' },
  { predefId: 'IT-vatican', cityPredefId: 'IT-capital', name: 'Ватикан' },
  { predefId: 'IT-trevi', cityPredefId: 'IT-capital', name: 'Фонтан Треви' },
  { predefId: 'IT-pantheon', cityPredefId: 'IT-capital', name: 'Пантеон' },
  { predefId: 'IT-forum', cityPredefId: 'IT-capital', name: 'Римский форум' },
  // Флоренция
  { predefId: 'IT-uffizi', cityPredefId: 'IT-florence', name: 'Галерея Уффици' },
  { predefId: 'IT-duomo', cityPredefId: 'IT-florence', name: 'Собор Дуомо' },
  { predefId: 'IT-ponte-vecchio', cityPredefId: 'IT-florence', name: 'Понте Веккьо' },
  // Венеция
  { predefId: 'IT-san-marco', cityPredefId: 'IT-venice', name: 'Площадь Сан-Марко' },
  { predefId: 'IT-grand-canal', cityPredefId: 'IT-venice', name: 'Гранд-канал' },
  { predefId: 'IT-rialto', cityPredefId: 'IT-venice', name: 'Мост Риальто' },
  // Милан
  { predefId: 'IT-duomo-milan', cityPredefId: 'IT-milan', name: 'Дуомо Милана' },
  { predefId: 'IT-last-supper', cityPredefId: 'IT-milan', name: 'Тайная вечеря' },
  // Неаполь
  { predefId: 'IT-pompeii', cityPredefId: 'IT-naples', name: 'Помпеи' },
  { predefId: 'IT-vesuvius', cityPredefId: 'IT-naples', name: 'Везувий' },
  // Париж (FR-capital)
  { predefId: 'FR-eiffel', cityPredefId: 'FR-capital', name: 'Эйфелева башня' },
  { predefId: 'FR-louvre', cityPredefId: 'FR-capital', name: 'Лувр' },
  { predefId: 'FR-notre-dame', cityPredefId: 'FR-capital', name: 'Нотр-Дам' },
  { predefId: 'FR-sacre-coeur', cityPredefId: 'FR-capital', name: 'Сакре-Кёр' },
  // Лион
  { predefId: 'FR-basilique', cityPredefId: 'FR-lyon', name: 'Базилика Нотр-Дам' },
  { predefId: 'FR-vieux-lyon', cityPredefId: 'FR-lyon', name: 'Старый Лион' },
  // Ницца
  { predefId: 'FR-promenade', cityPredefId: 'FR-nice', name: 'Английская набережная' },
  // Марсель
  { predefId: 'FR-notre-dame-garde', cityPredefId: 'FR-marseille', name: 'Нотр-Дам-де-ла-Гард' },
  // Мадрид (ES-capital)
  { predefId: 'ES-prado', cityPredefId: 'ES-capital', name: 'Музей Прадо' },
  { predefId: 'ES-royal-palace', cityPredefId: 'ES-capital', name: 'Королевский дворец' },
  { predefId: 'ES-retiro', cityPredefId: 'ES-capital', name: 'Парк Ретиро' },
  // Барселона
  { predefId: 'ES-sagrada', cityPredefId: 'ES-barcelona', name: 'Саграда Фамилия' },
  { predefId: 'ES-park-guell', cityPredefId: 'ES-barcelona', name: 'Парк Гуэль' },
  { predefId: 'ES-rambla', cityPredefId: 'ES-barcelona', name: 'Рамбла' },
  // Севилья
  { predefId: 'ES-alcazar', cityPredefId: 'ES-seville', name: 'Алькасар' },
  { predefId: 'ES-giralda', cityPredefId: 'ES-seville', name: 'Хиральда' },
  // Валенсия
  { predefId: 'ES-arts-sciences', cityPredefId: 'ES-valencia', name: 'Город искусств и наук' },
  // Берлин (DE-capital)
  { predefId: 'DE-gate', cityPredefId: 'DE-capital', name: 'Бранденбургские ворота' },
  { predefId: 'DE-reichstag', cityPredefId: 'DE-capital', name: 'Рейхстаг' },
  { predefId: 'DE-wall', cityPredefId: 'DE-capital', name: 'Берлинская стена' },
  // Мюнхен
  { predefId: 'DE-marienplatz', cityPredefId: 'DE-munich', name: 'Мариенплац' },
  { predefId: 'DE-neuschwanstein', cityPredefId: 'DE-munich', name: 'Замок Нойшванштайн' },
  // Гамбург
  { predefId: 'DE-elbphilharmonie', cityPredefId: 'DE-hamburg', name: 'Эльбская филармония' },
  // Лондон (GB-capital)
  { predefId: 'GB-big-ben', cityPredefId: 'GB-capital', name: 'Биг-Бен' },
  { predefId: 'GB-tower', cityPredefId: 'GB-capital', name: 'Тауэр' },
  { predefId: 'GB-eye', cityPredefId: 'GB-capital', name: 'Лондонский глаз' },
  { predefId: 'GB-buckingham', cityPredefId: 'GB-capital', name: 'Букингемский дворец' },
  // Эдинбург
  { predefId: 'GB-edinburgh-castle', cityPredefId: 'GB-edinburgh', name: 'Эдинбургский замок' },
  // Манчестер
  { predefId: 'GB-old-trafford', cityPredefId: 'GB-manchester', name: 'Олд Траффорд' },
  // Токио (JP-capital)
  { predefId: 'JP-shibuya', cityPredefId: 'JP-capital', name: 'Сибуя' },
  { predefId: 'JP-sensoji', cityPredefId: 'JP-capital', name: 'Храм Сэнсодзи' },
  { predefId: 'JP-akihabara', cityPredefId: 'JP-capital', name: 'Акихабара' },
  { predefId: 'JP-skytree', cityPredefId: 'JP-capital', name: 'Tokyo Skytree' },
  // Киото
  { predefId: 'JP-fushimi', cityPredefId: 'JP-kyoto', name: 'Фусими Инари' },
  { predefId: 'JP-kinkakuji', cityPredefId: 'JP-kyoto', name: 'Золотой павильон' },
  // Осака
  { predefId: 'JP-osaka-castle', cityPredefId: 'JP-osaka', name: 'Осакский замок' },
  { predefId: 'JP-dotonbori', cityPredefId: 'JP-osaka', name: 'Дотонбори' },
  // Бангкок (TH-capital)
  { predefId: 'TH-grand-palace', cityPredefId: 'TH-capital', name: 'Большой дворец' },
  { predefId: 'TH-wat-arun', cityPredefId: 'TH-capital', name: 'Храм Ват Арун' },
  // Пхукет
  { predefId: 'TH-patong', cityPredefId: 'TH-phuket', name: 'Пляж Патонг' },
  // Чиангмай
  { predefId: 'TH-doi-suthep', cityPredefId: 'TH-chiang-mai', name: 'Храм Дой Сутеп' },
  // Стамбул
  { predefId: 'TR-hagia-sophia', cityPredefId: 'TR-istanbul', name: 'Айя-София' },
  { predefId: 'TR-blue-mosque', cityPredefId: 'TR-istanbul', name: 'Голубая мечеть' },
  { predefId: 'TR-grand-bazaar', cityPredefId: 'TR-istanbul', name: 'Гранд-базар' },
  // Анкара (TR-capital)
  { predefId: 'TR-anitkabir', cityPredefId: 'TR-capital', name: 'Аныткабир' },
  // Анталья
  { predefId: 'TR-kaleici', cityPredefId: 'TR-antalya', name: 'Калеичи' },
  // Нью-Йорк
  { predefId: 'US-statue', cityPredefId: 'US-nyc', name: 'Статуя Свободы' },
  { predefId: 'US-central-park', cityPredefId: 'US-nyc', name: 'Центральный парк' },
  { predefId: 'US-times-square', cityPredefId: 'US-nyc', name: 'Таймс-сквер' },
  // Лос-Анджелес
  { predefId: 'US-hollywood', cityPredefId: 'US-la', name: 'Голливуд' },
  // Чикаго
  { predefId: 'US-cloud-gate', cityPredefId: 'US-chicago', name: 'Cloud Gate' },
  // Лиссабон (PT-capital)
  { predefId: 'PT-belem', cityPredefId: 'PT-capital', name: 'Башня Белен' },
  { predefId: 'PT-alfama', cityPredefId: 'PT-capital', name: 'Алфама' },
  // Порту
  { predefId: 'PT-ribeira', cityPredefId: 'PT-porto', name: 'Рибейра' },
  // Афины (GR-capital)
  { predefId: 'GR-acropolis', cityPredefId: 'GR-capital', name: 'Акрополь' },
  { predefId: 'GR-plaka', cityPredefId: 'GR-capital', name: 'Плака' },
  // Санторини
  { predefId: 'GR-oia', cityPredefId: 'GR-santorini', name: 'Ия (закат)' },
  // Каир (EG-capital)
  { predefId: 'EG-pyramids', cityPredefId: 'EG-capital', name: 'Пирамиды Гизы' },
  { predefId: 'EG-sphinx', cityPredefId: 'EG-capital', name: 'Сфинкс' },
  // Хургада
  { predefId: 'EG-red-sea', cityPredefId: 'EG-hurghada', name: 'Красное море' },
  // Дубай
  { predefId: 'AE-burj', cityPredefId: 'AE-dubai', name: 'Бурдж-Халифа' },
  { predefId: 'AE-palm', cityPredefId: 'AE-dubai', name: 'Пальма Джумейра' },
  // Абу-Даби (AE-capital)
  { predefId: 'AE-sheikh-zayed', cityPredefId: 'AE-capital', name: 'Мечеть шейха Зайда' },
  // Пекин (CN-capital)
  { predefId: 'CN-great-wall', cityPredefId: 'CN-capital', name: 'Великая Китайская стена' },
  { predefId: 'CN-forbidden-city', cityPredefId: 'CN-capital', name: 'Запретный город' },
  // Шанхай
  { predefId: 'CN-bund', cityPredefId: 'CN-shanghai', name: 'Набережная Вайтань' },
  // Сидней
  { predefId: 'AU-opera-house', cityPredefId: 'AU-sydney', name: 'Оперный театр' },
  { predefId: 'AU-harbour-bridge', cityPredefId: 'AU-sydney', name: 'Мост Харбор-Бридж' },
  // Мельбурн
  { predefId: 'AU-great-ocean', cityPredefId: 'AU-melbourne', name: 'Великая океанская дорога' },
  // Рио
  { predefId: 'BR-christ', cityPredefId: 'BR-rio', name: 'Статуя Христа' },
  { predefId: 'BR-copacabana', cityPredefId: 'BR-rio', name: 'Копакабана' },
  // Сан-Паулу
  { predefId: 'BR-paulista', cityPredefId: 'BR-sao-paulo', name: 'Авенида Паулиста' },
  // Мехико (MX-capital)
  { predefId: 'MX-teotihuacan', cityPredefId: 'MX-capital', name: 'Теотиуакан' },
  // Канкун
  { predefId: 'MX-chichen-itza', cityPredefId: 'MX-cancun', name: 'Чичен-Ица' },
  // Дели (IN-capital)
  { predefId: 'IN-taj-mahal', cityPredefId: 'IN-capital', name: 'Тадж-Махал' },
  { predefId: 'IN-red-fort', cityPredefId: 'IN-capital', name: 'Красный форт' },
  // Мумбаи
  { predefId: 'IN-gateway-india', cityPredefId: 'IN-mumbai', name: 'Ворота Индии' },
  // Сеул (KR-capital)
  { predefId: 'KR-gyeongbokgung', cityPredefId: 'KR-capital', name: 'Дворец Кёнбоккун' },
  { predefId: 'KR-myeongdong', cityPredefId: 'KR-capital', name: 'Мёндон' },
  // Пусан
  { predefId: 'KR-haeundae', cityPredefId: 'KR-busan', name: 'Пляж Хэундэ' },
  // Прага (CZ-capital)
  { predefId: 'CZ-charles-bridge', cityPredefId: 'CZ-capital', name: 'Карлов мост' },
  { predefId: 'CZ-prague-castle', cityPredefId: 'CZ-capital', name: 'Пражский град' },
  { predefId: 'CZ-old-town-square', cityPredefId: 'CZ-capital', name: 'Староместская площадь' },
  // Брно
  { predefId: 'CZ-spilberk', cityPredefId: 'CZ-brno', name: 'Замок Шпильберк' },
];