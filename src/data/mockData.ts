import { CategoryInfo, FoundItem } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  { id: 'electronics', label: 'Электроника', iconName: 'Laptop' },
  { id: 'documents', label: 'Документы', iconName: 'FileText' },
  { id: 'clothing', label: 'Одежда', iconName: 'Shirt' },
  { id: 'accessories', label: 'Аксессуары', iconName: 'Watch' },
  { id: 'other', label: 'Другое', iconName: 'Package' },
];

export const MOCK_FOUND_ITEMS: FoundItem[] = [
  {
    id: 'item-earphones-1',
    title: 'Белые беспроводные наушники в зарядном кейсе',
    category: 'electronics',
    description: 'Белые наушники типа TWS в глянцевом футляре. На обратной стороне кейса есть едва заметная микроцарапина. Заряжены на 60%.',
    location: 'Библиотека университета, 2-й этаж',
    campusZone: 'Библиотечный корпус',
    date: '8 октября 2026 г.',
    time: '14:20',
    status: 'Найдена',
    statusColor: 'emerald',
    finderType: 'Сотрудник библиотеки',
    finderName: 'Анна М. (библиотекарь)',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    distinctiveFeatures: [
      'Белый глянцевый кейс с разъемом Lightning/USB-C',
      'Один амбушюр размера M, второй L',
      'Оставлены на столе №14 возле секции естественных наук'
    ],
    finderNote: 'Переданы на стойку выдачи книг в библиотеке. Владельцу нужно будет разблокировать или подтвердить подключение к своему смартфону.',
    storagePlace: 'Стойка дежурного библиотекаря (окно №3)',
    keywords: ['наушники', 'airpods', 'белые', 'кейс', 'беспроводные', 'tws', 'электроника', 'библиотека', 'зарядный']
  },
  {
    id: 'item-earphones-2',
    title: 'Беспроводные наушники в белом кейсе',
    category: 'electronics',
    description: 'Кейс белого матового цвета со светодиодным индикатором спереди. Внутри оба наушника.',
    location: 'Студенческий холл, зона диванов',
    campusZone: 'Главный корпус',
    date: '7 октября 2026 г.',
    time: '18:45',
    status: 'Ожидает подтверждения',
    statusColor: 'amber',
    finderType: 'Студент',
    finderName: 'Максим (3 курс ИТ)',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    distinctiveFeatures: [
      'Матовый белый корпус',
      'На шнурке для переноски синий мини-карабин',
      'Найдены между подушками дивана'
    ],
    finderNote: 'Нашёл после лекции по дискретной математике. Пока храню у себя в кампусе, готов встретиться у столовой или передать на охрану.',
    storagePlace: 'У нашедшего (Кампус, общежитие №2)',
    keywords: ['наушники', 'беспроводные', 'белом', 'холл', 'студенческий', 'кейс', 'электроника', 'airpods']
  },
  {
    id: 'item-earphones-3',
    title: 'Кейс от наушников белый с защитным чехлом',
    category: 'electronics',
    description: 'Зарядный футляр в полупрозрачном силиконовом бампере. Внутри был только правый наушник.',
    location: 'Коворкинг 3 этаж, зона тихого кодинга',
    campusZone: 'Инженерный корпус',
    date: '6 октября 2026 г.',
    time: '11:15',
    status: 'Найдена',
    statusColor: 'emerald',
    finderType: 'Студент',
    finderName: 'Дарья К.',
    imageUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80',
    distinctiveFeatures: [
      'Полупрозрачный силиконовый чехол',
      'Только правый наушник внутри',
      'Небольшая гравировка или наклейка со звездочкой'
    ],
    finderNote: 'Лежали на подоконнике рядом с розеткой.',
    storagePlace: 'Бюро находок коворкинга',
    keywords: ['наушники', 'кейс', 'белый', 'чехол', 'коворкинг', 'электроника']
  },
  {
    id: 'item-doc-1',
    title: 'Студенческий билет и пропуск в кампус',
    category: 'documents',
    description: 'Синяя пластиковая карта-пропуск и студенческий билет в прозрачной обложке.',
    location: 'Центральный вход, турникеты',
    campusZone: 'Главный корпус',
    date: '8 октября 2026 г.',
    time: '09:10',
    status: 'Передано в бюро находок',
    statusColor: 'blue',
    finderType: 'Охрана кампуса',
    finderName: 'Пост охраны №1',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    distinctiveFeatures: [
      'Студенческий билет факультета компьютерных наук',
      'Синий ремешок с логотипом университета',
      'Внутри вложен проездной билет'
    ],
    finderNote: 'Выпал из кармана возле турникета №3 при утреннем проходе. Находится у старшего смены охраны.',
    storagePlace: 'Пост охраны главного входа',
    keywords: ['студенческий', 'билет', 'пропуск', 'документы', 'карта', 'вход', 'турникет']
  },
  {
    id: 'item-clothes-1',
    title: 'Чёрное оверсайз худи с капюшоном',
    category: 'clothing',
    description: 'Хлопковое черное худи свободного кроя. В кармане «кенгуру» лежали жевательная резинка и ручка.',
    location: 'Гардероб 1 этажа',
    campusZone: 'Главный корпус',
    date: '7 октября 2026 г.',
    time: '16:30',
    status: 'Найдена',
    statusColor: 'emerald',
    finderType: 'Сотрудник библиотеки',
    finderName: 'Работник гардероба',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    distinctiveFeatures: [
      'Размер L/XL, плотный футер',
      'Белая вышивка на левом манжете',
      'Оставлено на скамье ожидания гардероба'
    ],
    finderNote: 'Оставлено после 5-й пары. При обращении назовите марку или что было в правом рукаве.',
    storagePlace: 'Кабинет администратора гардероба',
    keywords: ['худи', 'толстовка', 'одежда', 'черное', 'гардероб', 'капюшон']
  },
  {
    id: 'item-acc-1',
    title: 'Связка ключей с брелоком-котиком и чипом',
    category: 'accessories',
    description: 'Три металлических ключа на серебристом кольце, круглый домофонный чип и вязаный аниме-брелок.',
    location: 'Столовая кампуса, дальний столик у окна',
    campusZone: 'Студенческий центр',
    date: '8 октября 2026 г.',
    time: '13:05',
    status: 'Найдена',
    statusColor: 'emerald',
    finderType: 'Студент',
    finderName: 'Артем С.',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
    distinctiveFeatures: [
      'Ключ с желтой пластиковой насадкой',
      'Серый бесконтактный магнитный чип',
      'Силиконовый ремешок с металлическим карабином'
    ],
    finderNote: 'Забыли во время обеда. Передал кассиру столовой.',
    storagePlace: 'Касса №2 столовой кампуса',
    keywords: ['ключи', 'связка', 'брелок', 'аксессуары', 'столовая', 'чип']
  },
  {
    id: 'item-laptop-1',
    title: 'Ультрабук в графитовом чехле на молнии',
    category: 'electronics',
    description: 'Тонкий металлический ноутбук 14 дюймов в фетровом чехле графитового цвета с зарядным блоком.',
    location: 'Аудитория 408 (поточная аудитория)',
    campusZone: 'Новый учебный корпус',
    date: '8 октября 2026 г.',
    time: '17:10',
    status: 'Передано в бюро находок',
    statusColor: 'blue',
    finderType: 'Преподаватель',
    finderName: 'Проф. Соколов Д.В.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    distinctiveFeatures: [
      'Серый алюминиевый корпус',
      'На крышке наклейка с формулой Эйлера и логотип Python',
      'Мышь Logitech Pebble в боковом кармашке чехла'
    ],
    finderNote: 'Оставлен на третьем ряду после семинара по алгоритмам. Передан в деканат.',
    storagePlace: 'Деканат ФКН, каб. 412',
    keywords: ['ноутбук', 'макбук', 'ультрабук', 'компьютер', 'аудитория', 'электроника', 'чехол']
  }
];

export const POPULAR_SEARCH_PRESETS = [
  {
    label: 'Белые AirPods в кейсе',
    description: 'Белые беспроводные наушники в кейсе',
    category: 'electronics' as const,
    location: 'Университет, библиотека'
  },
  {
    label: 'Студенческий билет ВШЭ',
    description: 'Студенческий билет и пластиковый пропуск',
    category: 'documents' as const,
    location: 'Главный корпус, турникеты'
  },
  {
    label: 'Черное худи оверсайз',
    description: 'Черное хлопковое худи с капюшоном',
    category: 'clothing' as const,
    location: 'Гардероб'
  },
  {
    label: 'Связка ключей с брелоком',
    description: 'Ключи с брелоком и домофонным чипом',
    category: 'accessories' as const,
    location: 'Столовая'
  }
];

export const CAMPUS_LOCATIONS = [
  'Университет, библиотека',
  'Главный корпус, турникеты',
  'Студенческий холл, зона отдыха',
  'Коворкинг 3 этаж',
  'Столовая кампуса',
  'Гардероб 1 этажа',
  'Спортивный комплекс',
  'Аудитории 3-4 этажа'
];
