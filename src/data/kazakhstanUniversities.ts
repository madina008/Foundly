export interface University {
  id: string;
  name: string;
  shortName: string;
  city: string;
  badgeColor: string;
  campusLocations: string[];
}

export const KAZAKHSTAN_CITIES = [
  'Все города',
  'Актобе',
  'Астана',
  'Алматы',
  'Актау',
  'Шымкент',
  'Караганда',
  'Павлодар',
  'Петропавловск',
  'Кокшетау',
  'Кызылорда',
  'Семей',
  'Тараз',
  'Усть-Каменогорск',
  'Другой город'
];

export const KAZAKHSTAN_UNIVERSITIES: University[] = [
  {
    id: 'zhubanov',
    name: 'Zhubanov University (Актюбинский региональный университет им. К. Жубанова)',
    shortName: 'Zhubanov University',
    city: 'Актобе',
    badgeColor: 'from-blue-600 to-indigo-700',
    campusLocations: [
      'Главный корпус, ул. А. Молдагуловой 34',
      'Инженерно-технический факультет',
      'Факультет естествознания и математики',
      'Научная библиотека Жубанова',
      'Студенческий холл / Коворкинг',
      'Спортивный комплекс «Сункар»',
      'Общежитие №1 / №2'
    ]
  },
  {
    id: 'heriot-watt-kz',
    name: 'Heriot-Watt University Kazakhstan (Актюбинский кампус HWU)',
    shortName: 'Heriot-Watt KZ',
    city: 'Актобе',
    badgeColor: 'from-amber-600 to-red-700',
    campusLocations: [
      'HWU Campus, British Education Center',
      'Heriot-Watt Engineering Labs',
      'Library & Global Study Hub',
      'Computer & AI Science Wing',
      'Student Innovation Center'
    ]
  },
  {
    id: 'nu',
    name: 'Nazarbayev University (Назарбаев Университет)',
    shortName: 'Nazarbayev University',
    city: 'Астана',
    badgeColor: 'from-emerald-600 to-teal-800',
    campusLocations: [
      'Main Atrium (Блок С2)',
      'NU Library, 2nd & 3rd Floors',
      'SEDS Engineering Wing',
      'Student Center (Block 24)',
      'Dormitories Block 19-22',
      'Sports Center'
    ]
  },
  {
    id: 'kaznu',
    name: 'Al-Farabi Kazakh National University (КазНУ им. аль-Фараби)',
    shortName: 'КазНУ им. аль-Фараби',
    city: 'Алматы',
    badgeColor: 'from-sky-600 to-blue-800',
    campusLocations: [
      'Ректорат КазНУГрад',
      'Библиотека им. аль-Фараби',
      'Мехмат (Механико-математический факультет)',
      'Факультет информационных технологий (ФИТ)',
      'Дворец студентов им. У. Джолдасбекова',
      'Студенческий городок'
    ]
  },
  {
    id: 'enu',
    name: 'L. N. Gumilyov Eurasian National University (ЕНУ им. Л. Н. Гумилева)',
    shortName: 'ЕНУ им. Л. Н. Гумилева',
    city: 'Астана',
    badgeColor: 'from-cyan-600 to-blue-700',
    campusLocations: [
      'Главный учебно-административный корпус (УАК)',
      'Учебно-лабораторный корпус (УЛК)',
      'Научная библиотека «Отырар»',
      'Факультет информационных технологий (ФИТ)',
      'Студенческий дом №4'
    ]
  },
  {
    id: 'satbayev',
    name: 'Satbayev University (КазНИТУ им. К. И. Сатпаева)',
    shortName: 'Satbayev University',
    city: 'Алматы',
    badgeColor: 'from-violet-600 to-purple-800',
    campusLocations: [
      'Главный учебный корпус (ГУК)',
      'Горно-металлургический корпус (ГМК)',
      'Научно-техническая библиотека',
      'Технопарк Satbayev University',
      'Коворкинг Политех'
    ]
  },
  {
    id: 'aitu',
    name: 'Astana IT University (AITU)',
    shortName: 'Astana IT University',
    city: 'Астана',
    badgeColor: 'from-indigo-600 to-cyan-700',
    campusLocations: [
      'EXPO C1 Block, Central Hall',
      'AITU Tech Library',
      'Robotics & AI FabLab',
      'Student Lounge (3rd Floor)',
      'Food Court / Dining Zone'
    ]
  },
  {
    id: 'kimep',
    name: 'KIMEP University (Университет КИМЭП)',
    shortName: 'KIMEP University',
    city: 'Алматы',
    badgeColor: 'from-rose-600 to-red-800',
    campusLocations: [
      'Valikhanov Building',
      'Dostyk Building Hall',
      'Olivier Barrault Library',
      'Great Hall',
      'KIMEP Grill / Student Canteen'
    ]
  },
  {
    id: 'sdu',
    name: 'Suleyman Demirel University (SDU University)',
    shortName: 'SDU University',
    city: 'Алматы',
    badgeColor: 'from-blue-700 to-indigo-900',
    campusLocations: [
      'Central Red Block, Kaskelen',
      'SDU Central Library',
      'Faculty of Engineering & Natural Sciences',
      'Student Center & Canteen',
      'Sports Stadium & Dorms'
    ]
  },
  {
    id: 'iitu',
    name: 'International Information Technology University (IITU / МУИТ)',
    shortName: 'IITU (МУИТ)',
    city: 'Алматы',
    badgeColor: 'from-emerald-500 to-blue-700',
    campusLocations: [
      'Главный корпус, ул. Манаса 34/1',
      'Коворкинг 1 этаж',
      'Электронная библиотека IITU',
      'Лаборатория GameDev & Mobile',
      'Студенческая столовая'
    ]
  },
  {
    id: 'yessenov',
    name: 'Yessenov University (Каспийский университет технологий и инжиниринга им. Ш. Есенова)',
    shortName: 'Yessenov University',
    city: 'Актау',
    badgeColor: 'from-teal-600 to-cyan-800',
    campusLocations: [
      'Главный корпус (32 мкр)',
      'Морская академия Yessenov',
      'IT & Engineering Hub',
      'Научная библиотека Есенова',
      'Дворец спорта'
    ]
  },
  {
    id: 'kbtu',
    name: 'Kazakh-British Technical University (КБТУ)',
    shortName: 'КБТУ',
    city: 'Алматы',
    badgeColor: 'from-red-600 to-slate-800',
    campusLocations: [
      'Историческое здание Дома Правительства, ул. Толе би 59',
      'Круглый зал КБТУ',
      'Школа информационных технологий (НОЦ ИТ)',
      'Библиотека КБТУ',
      'Bloomberg Lab'
    ]
  },
  {
    id: 'karu',
    name: 'Karaganda Buketov University (КарУ им. академика Е.А. Букетова)',
    shortName: 'КарУ им. Букетова',
    city: 'Караганда',
    badgeColor: 'from-purple-600 to-indigo-800',
    campusLocations: [
      'Главный корпус, ул. Университетская 28',
      'Корпус математики и IT',
      'Библиотека Букетова',
      'Студенческий дворец'
    ]
  },
  {
    id: 'kartu',
    name: 'Karaganda Technical University (КарТУ им. А. Сагинова)',
    shortName: 'КарТУ им. Сагинова',
    city: 'Караганда',
    badgeColor: 'from-amber-600 to-stone-800',
    campusLocations: [
      'Главный корпус, пр. Назарбаева 56',
      'Горный корпус',
      'Инженерный коворкинг'
    ]
  },
  {
    id: 'tou',
    name: 'Toraighyrov University (Торайгыров университет)',
    shortName: 'Торайгыров университет',
    city: 'Павлодар',
    badgeColor: 'from-sky-600 to-indigo-800',
    campusLocations: [
      'Главный корпус, ул. Ломова 64',
      'Корпус энергетики и IT',
      'Научная библиотека Торайгырова'
    ]
  },
  {
    id: 'ku-petropavl',
    name: 'Kozybayev University (СКУ им. М. Козыбаева)',
    shortName: 'Kozybayev University',
    city: 'Петропавловск',
    badgeColor: 'from-blue-600 to-teal-800',
    campusLocations: [
      'Новый учебный корпус, ул. Жумабаева',
      'Главный корпус, ул. Пушкина 86',
      'Библиотека Козыбаева'
    ]
  },
  {
    id: 'katru',
    name: 'S. Seifullin Kazakh Agrotechnical Research University (КАТИУ им. С. Сейфуллина)',
    shortName: 'КАТИУ им. Сейфуллина',
    city: 'Астана',
    badgeColor: 'from-emerald-700 to-green-900',
    campusLocations: [
      'Главный корпус, пр. Победы 62',
      'Факультет КСиПО (IT)',
      'Научная библиотека'
    ]
  },
  {
    id: 'auezov',
    name: 'M. Auezov South Kazakhstan University (ЮКУ им. М. Ауэзова)',
    shortName: 'ЮКУ им. Ауэзова',
    city: 'Шымкент',
    badgeColor: 'from-orange-600 to-amber-800',
    campusLocations: [
      'Главный корпус, пр. Тауке хана 5',
      'Факультет информационных технологий',
      'Библиотека Ауэзова'
    ]
  },
  {
    id: 'narxoz',
    name: 'Narxoz University (Университет Нархоз)',
    shortName: 'Университет Нархоз',
    city: 'Алматы',
    badgeColor: 'from-rose-700 to-pink-900',
    campusLocations: [
      'Новый эко-кампус, ул. Жандосова 55',
      'Центральный атриум',
      'Narxoz Library Hub'
    ]
  },
  {
    id: 'other',
    name: 'Другой университет Казахстана',
    shortName: 'Другой ВУЗ',
    city: 'Другой город',
    badgeColor: 'from-slate-600 to-slate-800',
    campusLocations: [
      'Главный учебный корпус',
      'Университетская библиотека',
      'Студенческий холл / столовая',
      'Гардероб / входная группа'
    ]
  }
];

export const COURSES = [
  '1 курс (Бакалавриат)',
  '2 курс (Бакалавриат)',
  '3 курс (Бакалавриат)',
  '4 курс (Бакалавриат)',
  'Магистратура',
  'Докторантура (PhD)',
  'Сотрудник / Преподаватель',
  'Выпускник'
];
