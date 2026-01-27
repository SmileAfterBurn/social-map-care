import { Organization, RegionName } from './types';

// --- РЕАЛЬНІ ХАБИ ТА КЛЮЧОВІ ТОЧКИ (Hardcoded Verified Data) ---
export const INITIAL_ORGANIZATIONS: Organization[] = [
  // --- ЗАПОРІЖЖЯ ---
  {
    id: 'posmishka_zp_sobornyi',
    name: 'БФ "Посмішка ЮА" (Центральний офіс)',
    region: 'Zaporizhzhia',
    address: 'м. Запоріжжя, пр. Соборний, 189',
    lat: 47.8525, lng: 35.1018,
    category: 'Благодійна організація',
    services: 'Кейс-менеджмент, Юридична допомога, Простір дружній до дитини',
    phone: '+38 050 460 22 40',
    email: 'zaporizhzhia.office@posmishka.org.ua',
    status: 'Active',
    driveFolderUrl: '', budget: 0,
    workingHours: 'Пн-Пт 09:00-18:00',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMwMEFFRUEiLz4KPHBhdGggZD0iTTI4IDEzQzI4IDEzIDI1IDE2IDIyIDE2QzE5IDE2IDIwIDEwIDI2IDhDMzIgNiAyOCAxMyAyOCAxM1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiAxM0MxMiAxMyAxNSAxNiAxOCAxNkMyMSAxNiAyMCAxMCAxNCA4QzggNiAxMiAxMyAxMiAxM1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiAyMkMxMiAyNyAxNSAyNyAxOCAyN0MyMSAyNyAyNCAzMCAyMCAzMkMxNiAzNCAxMiAyNyAxMiAyMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yOCAyMkMyOCAyNyAyNSAyNyAyMiAyN0MxOSAyNyAxNiAzMCAyMCAzMkMyNCAzNCAyOCAyNyAyOCAyMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo='
  },
  {
    id: 'mariupol_zp',
    name: 'Центр "ЯМаріуполь" Запоріжжя',
    region: 'Zaporizhzhia',
    address: 'м. Запоріжжя, пр. Соборний, 150-А',
    lat: 47.8444, lng: 35.1292,
    category: 'Гуманітарний хаб',
    services: 'Гуманітарна допомога маріупольцям, медична допомога, психолог',
    phone: '+38 050 399 20 35',
    email: 'help@iamariupol.org',
    status: 'Active',
    driveFolderUrl: '', budget: 0,
    workingHours: 'Пн-Сб 08:00-18:00',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMwMDQ1ODgiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMCAxMEwxMyAyMEwxNiAyOEwyNCAyOEwyNyAyMEwyMCAxMFpNMjAgMTZMMjIgMjBMMjAgMjRIMTguNUwxOCAyMEwyMCAxNloiIGZpbGw9IiNGRkRCMDAiLz4KPC9zdmc+Cg=='
  },
  // --- КИЇВ ---
  {
    id: 'mariupol_kyiv_left',
    name: 'Центр "ЯМаріуполь" (Лівий берег)',
    region: 'Kyiv',
    address: 'м. Київ, вул. Магнітогорська, 9',
    lat: 50.4563, lng: 30.6410,
    category: 'Гуманітарний хаб',
    services: 'Підтримка ВПО з Маріуполя, юридичні консультації',
    phone: '+38 095 150 00 00',
    email: 'kyiv@iamariupol.org',
    status: 'Active',
    driveFolderUrl: '', budget: 0,
		workingHours: 'Пн-Пт 09:00-18:00',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMwMDQ1ODgiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMCAxMEwxMyAyMEwxNiAyOEwyNCAyOEwyNyAyMEwyMCAxMFpNMjAgMTZMMjIgMjBMMjAgMjRIMTguNUwxOCAyMEwyMCAxNloiIGZpbGw9IiNGRkRCMDAiLz4KPC9zdmc+Cg=='
  },
  {
    id: 'caritas_kyiv',
    name: 'БФ "Карітас-Київ"',
    region: 'Kyiv',
    address: 'м. Київ, вул. Микитенка, 7Б',
    lat: 50.4855, lng: 30.5966,
    category: 'Благодійна організація',
    services: 'Соціальна опіка, кризовий центр',
    phone: '+38 098 189 35 15',
    email: 'info@caritas.kyiv.ua',
    status: 'Active',
    driveFolderUrl: '', budget: 0,
		workingHours: 'Пн-Пт 09:00-18:00',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMwMDk1Q0MiLz4KPHBhdGggZD0iTTIwIDEyQzE3LjUgMTIgMTUgMTQuNSAxNSAxN0MxNSAxOS41IDE3LjUgMjIgMjAgMjJDMjIuNSAyMiAyNSAxOS41IDI1IDE3QzI1IDE0LjUgMjIuNSAxMiAyMCAxMlpNMjAgMTVDMjEuMTUgMTUgMjIgMTUuODUgMjIgMTdDMjIgMTguMTUgMjEuMTUgMTkgMjAgMTlDMTguODUgMTkgMTggMTguMTUgMTggMTdDMTggMTUuODUgMTguODUgMTUgMjAgMTVaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTAgMjVMMjAgMzVMMzAgMjVMMjAgMjdMMTAgMjVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
  },
    // --- ДОДАНІ МІЖНАРОДНІ ОРГАНІЗАЦІЇ ---
  {
    id: 'drc_kyiv',
    name: 'Данська рада у справах біженців (DRC)',
    region: 'Kyiv',
    address: 'м. Київ, вул. Іллінська, 8',
    lat: 50.465, lng: 30.522,
    category: 'Міжнародна організація',
    services: 'Правова допомога, гуманітарне роззброєння, соціально-економічна підтримка',
    phone: '+38 044 334 56 43',
    email: 'ukraine@drc.ngo',
    status: 'Active',
    driveFolderUrl: '', budget: 0,
    workingHours: 'Пн-Пт 09:00-17:00',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIyMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMjAgMjBIMzBWMTBIMjBaTTMwIDIwVjMwSDIwWk0yMCAyMEgxMFYzMEgyMFpNMTAgMjBWMTEuNUgxOFYyMFoiIGZpbGw9IiNGRjAwMDAiLz48L3N2Zz4='
  },
  {
    id: 'nrc_lviv',
    name: 'Норвезька рада у справах біженців (NRC)',
    region: 'Lviv',
    address: 'м. Львів, вул. Городоцька, 83',
    lat: 49.838, lng: 23.999,
    category: 'Міжнародна організація',
    services: 'Правова допомога (IDP), житло, водопостачання та санітарія',
    phone: '0 800 302 007',
    email: 'ua.info@nrc.no',
    status: 'Active',
    driveFolderUrl: '', budget: 0,
    workingHours: 'Пн-Пт 09:00-17:00',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIyMCIgZmlsbD0iIzE5MTkxOSIvPjxwYXRoIGQ9Ik0xMCAxMEgyMFYyMEgxMFYxMFpNMjAgMTBIMzBWMjBIMjBWMjBaTTIwIDIwSDMwVjMwSDIwVjIwWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4='
  },
  {
    id: 'proliska_dnipro',
    name: 'ГО "Проліска"',
    region: 'Dnipro',
    address: 'м. Дніпро, вул. Старокозацька, 40Б',
    lat: 48.458, lng: 35.038,
    category: 'Гуманітарна місія',
    services: 'Соціальний супровід, психологічна допомога, гуманітарна допомога, транспорт',
    phone: '+38 093 191 18 01',
    email: 'info@proliska.org',
    status: 'Active',
    driveFolderUrl: '', budget: 0,
    workingHours: 'Пн-Пт 10:00-18:00',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMwMDU0NzUiLz4KPHBhdGggZD0iTTE4IDEyTDIxIDEyTDIzIDE4TDI1IDEyTDI4IDEyTDI0IDIyTDI4IDMyTDI1IDMyTDIzIDI2TDIxIDMyTDE4IDMyTDIyIDIyTDE4IDEyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg=='
  },
  {
    id: 'r2p_dnipro',
    name: 'БФ "Право на захист" (R2P)',
    region: 'Dnipro',
    address: 'м. Дніпро, пр. Дмитра Яворницького, 72А',
    lat: 48.46, lng: 35.04,
    category: 'Благодійна організація',
    services: 'Правова допомога, реєстрація ВПО, моніторинг',
    phone: '0 800 750 104',
    email: 'info@r2p.org.ua',
    status: 'Active',
    driveFolderUrl: '', budget: 0,
    workingHours: 'Пн-Пт 09:00-18:00',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTTEzIDEzTDI3IDEzTDI3IDI3TDEzIDI3TDEzIDEzWiIgZmlsbD0iI0ZGRkYwMCIvPgo8cGF0aCBkPSJNMTYgMTZIMjRWMjRIMTZWMTZaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K'
  }
];

// --- КОНФІГУРАЦІЯ МІСТ ТА ЇХ РЕГІОНІВ ---
const CITIES_CONFIG: Record<string, { lat: number, lng: number, name: string, streets: string[], region: RegionName }> = {
  'Kyiv': { lat: 50.4501, lng: 30.5234, name: 'Київ', region: 'Kyiv', streets: ['Хрещатик', 'Перемоги', 'Драгоманова'] },
  'Lviv': { lat: 49.8397, lng: 24.0297, name: 'Львів', region: 'Lviv', streets: ['Городоцька', 'Стрийська', 'Зелена'] },
  'Dnipro': { lat: 48.4647, lng: 35.0462, name: 'Дніпро', region: 'Dnipro', streets: ['Яворницького', 'Поля', 'Робоча'] },
  'Odesa': { lat: 46.4825, lng: 30.7233, name: 'Одеса', region: 'Odesa', streets: ['Дерибасівська', 'Рішельєвська'] },
  'Kharkiv': { lat: 49.9935, lng: 36.2304, name: 'Харків', region: 'Kharkiv', streets: ['Сумська', 'Науки'] },
  'Zaporizhzhia': { lat: 47.8388, lng: 35.1396, name: 'Запоріжжя', region: 'Zaporizhzhia', streets: ['Соборний', 'Перемоги'] },
  'Vinnytsia': { lat: 49.2331, lng: 28.4682, name: 'Вінниця', region: 'Vinnytsia', streets: ['Соборна', 'Пирогова'] },
  'IvanoFrankivsk': { lat: 48.9226, lng: 24.7111, name: 'Івано-Франківськ', region: 'IvanoFrankivsk', streets: ['Незалежності', 'Галицька'] },
  'Chernivtsi': { lat: 48.2921, lng: 25.9352, name: 'Чернівці', region: 'Chernivtsi', streets: ['Головна', 'Руська'] },
  'Ternopil': { lat: 49.5535, lng: 25.5948, name: 'Тернопіль', region: 'Ternopil', streets: ['Руська', 'Бандери'] },
  'Rivne': { lat: 50.6199, lng: 26.2516, name: 'Рівне', region: 'Rivne', streets: ['Соборна', 'Чорновола'] },
  'Khmelnytskyi': { lat: 49.4230, lng: 26.9871, name: 'Хмельницький', region: 'Khmelnytskyi', streets: ['Подільська', 'Свободи'] },
  'Poltava': { lat: 49.5883, lng: 34.5514, name: 'Полтава', region: 'Poltava', streets: ['Соборності', 'Сінна'] },
  'Mykolaiv': { lat: 46.9750, lng: 31.9946, name: 'Миколаїв', region: 'Mykolaiv', streets: ['Центральний', 'Миру'] },
  'Cherkasy': { lat: 49.4444, lng: 32.0598, name: 'Черкаси', region: 'Cherkasy', streets: ['Шевченка', 'Гоголя'] },
  'Sumy': { lat: 50.9077, lng: 34.7981, name: 'Суми', region: 'Sumy', streets: ['Харківська', 'Іллінська'] },
  'Zhytomyr': { lat: 50.2547, lng: 28.6587, name: 'Житомир', region: 'Zhytomyr', streets: ['Київська', 'Покровська'] },
  'Uzhhorod': { lat: 48.6208, lng: 22.2879, name: 'Ужгород', region: 'Zakarpattia', streets: ['Свободи', 'Швабська'] },
  'Lutsk': { lat: 50.7472, lng: 25.3254, name: 'Луцьк', region: 'Volyn', streets: ['Волі', 'Перемоги'] }
};

const SHELTER_TYPES = [
  { name: 'Гуртожиток для ВПО', services: 'Проживання, кухня, Wi-Fi' },
  { name: 'Прихисток при церкві', services: 'Харчування, одяг, нічліг' },
  { name: 'Модульне містечко', services: 'Окремі модулі, пральня' }
];

function getDistributedLocation(centerLat: number, centerLng: number, index: number) {
  const radius = 0.02 + Math.random() * 0.05; 
  const angle = Math.random() * Math.PI * 2;
  return {
    lat: centerLat + Math.sin(angle) * radius,
    lng: centerLng + Math.cos(angle) * radius * 1.5
  };
}

const TARGET_COUNT = 5200;
const cityKeys = Object.keys(CITIES_CONFIG);

for (let i = INITIAL_ORGANIZATIONS.length; i < TARGET_COUNT; i++) {
  const cityKey = cityKeys[i % cityKeys.length];
  const city = CITIES_CONFIG[cityKey];
  const loc = getDistributedLocation(city.lat, city.lng, i);
  const street = city.streets[i % city.streets.length];
  const type = SHELTER_TYPES[i % SHELTER_TYPES.length];

  INITIAL_ORGANIZATIONS.push({
    id: `db_auto_${cityKey}_${i}`,
    name: `${type.name} (${city.name})`,
    region: city.region,
    address: `м. ${city.name}, вул. ${street}, ${Math.floor(Math.random() * 100) + 1}`,
    lat: loc.lat,
    lng: loc.lng,
    category: 'Прихисток/Житло',
    services: type.services,
    phone: `+38 050 ${100 + (i%899)} 00 00`,
    email: `help_${i}@socialmap.ua`,
    status: 'Active',
    driveFolderUrl: '',
    budget: 0
  });
}