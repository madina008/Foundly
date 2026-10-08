import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { FoundItem, UserProfile } from '../types';
import { KAZAKHSTAN_UNIVERSITIES } from '../data/kazakhstanUniversities';

export interface UserRecord extends UserProfile {
  passwordHash: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  items: FoundItem[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DB_DIR, 'foundly-database.json');

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initial seed data with Kazakhstan university campus items
const INITIAL_SEED_ITEMS: FoundItem[] = [
  {
    id: 'item-zhubanov-1',
    title: 'Белые беспроводные наушники в зарядном кейсе',
    category: 'electronics',
    description: 'Белые наушники типа TWS в глянцевом футляре. На обратной стороне кейса микроцарапина. Заряжены на 60%.',
    location: 'Научная библиотека Жубанова, 2-й этаж, стол №14',
    campusZone: 'Zhubanov University, Главный корпус',
    universityId: 'zhubanov',
    universityName: 'Zhubanov University',
    date: '8 октября 2026 г.',
    time: '14:20',
    status: 'Найдена',
    statusColor: 'emerald',
    finderType: 'Сотрудник библиотеки',
    finderName: 'Айгуль К. (библиотекарь)',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    distinctiveFeatures: [
      'Белый глянцевый кейс с разъемом Type-C',
      'Один амбушюр размера M, второй L',
      'Оставлены на столе №14 возле секции естественных наук'
    ],
    finderNote: 'Переданы на стойку выдачи книг в библиотеке Жубанова. Владелец может подтвердить подключение со своего смартфона.',
    storagePlace: 'Стойка дежурного библиотекаря (окно №3, Главный корпус)',
    keywords: ['наушники', 'airpods', 'белые', 'кейс', 'беспроводные', 'tws', 'электроника', 'библиотека', 'зарядный', 'жубанов'],
    userId: null,
    authorEmail: 'library@zhubanov.edu.kz',
    createdAt: new Date('2026-10-08T14:20:00Z').toISOString()
  },
  {
    id: 'item-zhubanov-2',
    title: 'Беспроводные наушники в белом кейсе',
    category: 'electronics',
    description: 'Кейс белого матового цвета со светодиодным индикатором спереди. Внутри оба наушника.',
    location: 'Студенческий холл / Коворкинг Жубанова',
    campusZone: 'Zhubanov University, Студенческий центр',
    universityId: 'zhubanov',
    universityName: 'Zhubanov University',
    date: '7 октября 2026 г.',
    time: '18:45',
    status: 'Ожидает подтверждения',
    statusColor: 'amber',
    finderType: 'Студент',
    finderName: 'Данияр (3 курс IT, Zhubanov)',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    distinctiveFeatures: [
      'Матовый белый корпус',
      'На шнурке синий мини-карабин',
      'Найдены между подушками дивана в коворкинге'
    ],
    finderNote: 'Нашёл после лекции по машинному обучению. Готов встретиться возле столовой или передать на охрану.',
    storagePlace: 'У нашедшего (Кампус Жубанова, общежитие №2)',
    keywords: ['наушники', 'беспроводные', 'белом', 'холл', 'студенческий', 'кейс', 'электроника', 'жубанов'],
    userId: null,
    authorEmail: 'daniyar@zhubanov.edu.kz',
    createdAt: new Date('2026-10-07T18:45:00Z').toISOString()
  },
  {
    id: 'item-hw-1',
    title: 'Студенческий ID-бейдж Heriot-Watt University',
    category: 'documents',
    description: 'Пластиковая карта студента с синей лентой Heriot-Watt University Edinburgh / Kazakhstan.',
    location: 'Computer & AI Science Wing, 3 этаж',
    campusZone: 'Heriot-Watt University Kazakhstan',
    universityId: 'heriot-watt-kz',
    universityName: 'Heriot-Watt University Kazakhstan',
    date: '8 октября 2026 г.',
    time: '11:30',
    status: 'Передано в бюро находок',
    statusColor: 'blue',
    finderType: 'Преподаватель',
    finderName: 'Dr. Almas S.',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    distinctiveFeatures: [
      'Синий брендированный ремешок Heriot-Watt',
      'Студенческий билет факультета компьютерных наук',
      'Прозрачный пластиковый чехол с чипом'
    ],
    finderNote: 'Оставлен на клавиатуре в лаборатории робототехники. Передан администратору кампуса HWU.',
    storagePlace: 'Front Desk, British Education Center HWU',
    keywords: ['студенческий', 'билет', 'пропуск', 'документы', 'heriot-watt', 'hwu', 'карта'],
    userId: null,
    authorEmail: 'admin@hw.ac.uk',
    createdAt: new Date('2026-10-08T11:30:00Z').toISOString()
  },
  {
    id: 'item-nu-1',
    title: 'Ультрабук в графитовом чехле на молнии',
    category: 'electronics',
    description: 'Тонкий металлический ультрабук 14 дюймов в фетровом чехле графитового цвета с зарядным устройством.',
    location: 'NU Library, 2nd Floor Silent Zone',
    campusZone: 'Nazarbayev University, Block C2',
    universityId: 'nu',
    universityName: 'Nazarbayev University',
    date: '8 октября 2026 г.',
    time: '16:15',
    status: 'Передано в бюро находок',
    statusColor: 'blue',
    finderType: 'Охрана кампуса',
    finderName: 'NU Campus Security',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    distinctiveFeatures: [
      'Серый алюминиевый корпус',
      'Наклейка с логотипом Python и HackNU',
      'Мышь Logitech в боковом кармане'
    ],
    finderNote: 'Забыт на круглом столе у панорамного окна. Передан в Lost & Found службу безопасности NU.',
    storagePlace: 'NU Security Desk (Block 24, Entrance 1)',
    keywords: ['ноутбук', 'компьютер', 'чехол', 'библиотека', 'электроника', 'nu', 'nazarbayev'],
    userId: null,
    authorEmail: 'security@nu.edu.kz',
    createdAt: new Date('2026-10-08T16:15:00Z').toISOString()
  },
  {
    id: 'item-satbayev-1',
    title: 'Чёрное оверсайз худи Satbayev Tech',
    category: 'clothing',
    description: 'Хлопковое черное худи свободного кроя с капюшоном. В кармане кенгуру ручка и стикеры.',
    location: 'Технопарк Satbayev University, коворкинг',
    campusZone: 'Satbayev University, Главный учебный корпус',
    universityId: 'satbayev',
    universityName: 'Satbayev University',
    date: '7 октября 2026 г.',
    time: '17:00',
    status: 'Найдена',
    statusColor: 'emerald',
    finderType: 'Студент',
    finderName: 'Бауыржан (Политех)',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    distinctiveFeatures: [
      'Размер L, плотный футер',
      'Принт на спине «Satbayev Engineering»',
      'Оставлено на кресле-мешке'
    ],
    finderNote: 'Оставлено после хакатона. Находится у администратора коворкинга.',
    storagePlace: 'Стойка администратора коворкинга ГУК',
    keywords: ['худи', 'толстовка', 'одежда', 'черное', 'satbayev', 'политех'],
    userId: null,
    authorEmail: 'b.satbayev@satbayev.university',
    createdAt: new Date('2026-10-07T17:00:00Z').toISOString()
  },
  {
    id: 'item-kaznu-1',
    title: 'Связка ключей с брелоком КазНУ и магнитным чипом',
    category: 'accessories',
    description: 'Три металлических ключа на серебристом кольце, домофонный чип и вязаный брелок.',
    location: 'Столовая мехмата, КазНУГрад',
    campusZone: 'Al-Farabi Kazakh National University',
    universityId: 'kaznu',
    universityName: 'Al-Farabi Kazakh National University',
    date: '8 октября 2026 г.',
    time: '13:10',
    status: 'Найдена',
    statusColor: 'emerald',
    finderType: 'Студент',
    finderName: 'Мадина Е.',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
    distinctiveFeatures: [
      'Ключ с желтой пластиковой насадкой',
      'Синий бесконтактный чип общежития №9',
      'Брелок в виде совы'
    ],
    finderNote: 'Забыты во время обеда на столике у окна. Переданы кассиру столовой.',
    storagePlace: 'Касса столовой мехмата КазНУ',
    keywords: ['ключи', 'связка', 'брелок', 'аксессуары', 'казну', 'чип'],
    userId: null,
    authorEmail: 'madina@kaznu.edu.kz',
    createdAt: new Date('2026-10-08T13:10:00Z').toISOString()
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.items) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read existing database file, initializing fresh:', e);
    }

    // Default seed
    const initialData: DatabaseSchema = {
      users: this.createSeedUsers(),
      items: INITIAL_SEED_ITEMS,
    };
    this.saveDatabase(initialData);
    return initialData;
  }

  private createSeedUsers(): UserRecord[] {
    const salt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('student123', salt);

    return [
      {
        id: 'user-demo-zhubanov',
        name: 'Мадина',
        surname: 'Базарбаева',
        email: 'madina@zhubanov.edu.kz',
        passwordHash: demoPasswordHash,
        universityId: 'zhubanov',
        universityName: 'Zhubanov University',
        universityCity: 'Актобе',
        faculty: 'Факультет информационных технологий',
        course: '3 курс (Бакалавриат)',
        createdAt: '2026-09-01T09:00:00Z'
      },
      {
        id: 'user-demo-madina-personal',
        name: 'Мадина',
        surname: 'Базарбаева',
        email: 'bazarbaevamadina08@gmail.com',
        passwordHash: demoPasswordHash,
        universityId: 'zhubanov',
        universityName: 'Zhubanov University',
        universityCity: 'Актобе',
        faculty: 'Факультет информационных технологий',
        course: '3 курс (Бакалавриат)',
        createdAt: '2026-09-01T09:00:00Z'
      },
      {
        id: 'user-demo-hwu',
        name: 'Динара',
        surname: 'Нурланова',
        email: 'dinara@hw.ac.uk',
        passwordHash: demoPasswordHash,
        universityId: 'heriot-watt-kz',
        universityName: 'Heriot-Watt University Kazakhstan',
        universityCity: 'Актобе',
        faculty: 'School of Mathematical & Computer Sciences',
        course: '2 курс (Бакалавриат)',
        createdAt: '2026-09-05T10:00:00Z'
      },
      {
        id: 'user-demo-nu',
        name: 'Нурсултан',
        surname: 'Аскаров',
        email: 'nursultan@nu.edu.kz',
        passwordHash: demoPasswordHash,
        universityId: 'nu',
        universityName: 'Nazarbayev University',
        universityCity: 'Астана',
        faculty: 'School of Engineering and Digital Sciences (SEDS)',
        course: '4 курс (Бакалавриат)',
        createdAt: '2026-08-28T11:00:00Z'
      }
    ];
  }

  private saveDatabase(dataToSave = this.data) {
    try {
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  // --- USER OPERATIONS ---
  public findUserByEmail(email: string): UserRecord | undefined {
    const normalized = email.trim().toLowerCase();
    return this.data.users.find(u => u.email.toLowerCase() === normalized);
  }

  public findUserById(id: string): UserRecord | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public createUser(params: {
    name: string;
    surname: string;
    email: string;
    password: string;
    universityId: string;
    universityName?: string;
    faculty?: string;
    course?: string;
  }): UserProfile {
    const normalizedEmail = params.email.trim().toLowerCase();
    if (this.findUserByEmail(normalizedEmail)) {
      throw new Error('Пользователь с такой электронной почтой уже зарегистрирован');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(params.password, salt);

    // Resolve university metadata
    const uniMeta = KAZAKHSTAN_UNIVERSITIES.find(u => u.id === params.universityId);
    const resolvedName = params.universityName || uniMeta?.shortName || uniMeta?.name || 'Другой университет';
    const resolvedCity = uniMeta?.city || 'Казахстан';

    const newUser: UserRecord = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: params.name.trim(),
      surname: params.surname.trim(),
      email: normalizedEmail,
      passwordHash,
      universityId: params.universityId,
      universityName: resolvedName,
      universityCity: resolvedCity,
      faculty: params.faculty?.trim() || '',
      course: params.course?.trim() || '',
      createdAt: new Date().toISOString()
    };

    this.data.users.push(newUser);
    this.saveDatabase();

    const { passwordHash: _, ...publicProfile } = newUser;
    return publicProfile;
  }

  public updateUserProfile(userId: string, updates: {
    name?: string;
    surname?: string;
    universityId?: string;
    universityName?: string;
    faculty?: string;
    course?: string;
  }): UserProfile {
    const user = this.findUserById(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    if (updates.name !== undefined) user.name = updates.name.trim();
    if (updates.surname !== undefined) user.surname = updates.surname.trim();
    if (updates.universityId !== undefined) {
      user.universityId = updates.universityId;
      const uniMeta = KAZAKHSTAN_UNIVERSITIES.find(u => u.id === updates.universityId);
      user.universityName = updates.universityName || uniMeta?.shortName || uniMeta?.name || user.universityName;
      user.universityCity = uniMeta?.city || user.universityCity;
    }
    if (updates.faculty !== undefined) user.faculty = updates.faculty.trim();
    if (updates.course !== undefined) user.course = updates.course.trim();

    this.saveDatabase();

    const { passwordHash: _, ...publicProfile } = user;
    return publicProfile;
  }

  // --- ITEM OPERATIONS ---
  public getItems(filters?: { universityId?: string; userId?: string }): FoundItem[] {
    let items = [...this.data.items];

    if (filters?.universityId && filters.universityId !== 'all') {
      items = items.filter(it => it.universityId === filters.universityId);
    }

    if (filters?.userId) {
      items = items.filter(it => it.userId === filters.userId);
    }

    // Sort by createdAt descending
    items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return items;
  }

  public getItemById(id: string): FoundItem | undefined {
    return this.data.items.find(it => it.id === id);
  }

  public createItem(itemData: Omit<FoundItem, 'id' | 'createdAt'>): FoundItem {
    const newItem: FoundItem = {
      ...itemData,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };

    this.data.items.unshift(newItem);
    this.saveDatabase();
    return newItem;
  }

  public updateItem(id: string, userId: string, updates: Partial<FoundItem>): FoundItem {
    const itemIndex = this.data.items.findIndex(it => it.id === id);
    if (itemIndex === -1) {
      throw new Error('Объявление не найдено');
    }

    const item = this.data.items[itemIndex];
    // Check ownership: only author can edit
    if (item.userId && item.userId !== userId) {
      throw new Error('У вас нет прав на редактирование этого объявления');
    }

    const updatedItem = {
      ...item,
      ...updates,
      id: item.id, // prevent changing ID
      userId: item.userId // maintain original owner
    };

    this.data.items[itemIndex] = updatedItem;
    this.saveDatabase();
    return updatedItem;
  }

  public deleteItem(id: string, userId: string): boolean {
    const item = this.data.items.find(it => it.id === id);
    if (!item) {
      throw new Error('Объявление не найдено');
    }

    // Check ownership: only author can delete
    if (item.userId && item.userId !== userId) {
      throw new Error('У вас нет прав на удаление этого объявления');
    }

    this.data.items = this.data.items.filter(it => it.id !== id);
    this.saveDatabase();
    return true;
  }
}

export const db = new Database();
