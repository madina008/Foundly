export type CategoryType = 'electronics' | 'documents' | 'clothing' | 'accessories' | 'other';

export interface CategoryInfo {
  id: CategoryType;
  label: string;
  iconName: string;
}

export interface UserProfile {
  id: string;
  name: string;
  surname: string;
  email: string;
  universityId: string;
  universityName: string;
  universityCity: string;
  faculty?: string;
  course?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export interface FoundItem {
  id: string;
  title: string;
  category: CategoryType;
  description: string;
  location: string;
  campusZone: string;
  universityId?: string;
  universityName?: string;
  date: string;
  time: string;
  status: 'Найдена' | 'Ожидает подтверждения' | 'Передано в бюро находок' | 'Возвращено владельцу';
  statusColor?: 'emerald' | 'amber' | 'blue' | 'purple';
  finderType: 'Студент' | 'Сотрудник библиотеки' | 'Охрана кампуса' | 'Преподаватель' | 'Пользователь';
  finderName: string;
  imageUrl: string;
  distinctiveFeatures: string[];
  finderNote: string;
  storagePlace: string;
  keywords: string[];
  userId?: string | null;
  authorEmail?: string;
  createdAt?: string;
}

export interface SearchQuery {
  description: string;
  category: CategoryType | 'all';
  location: string;
  hasPhoto?: boolean;
  universityFilter?: string; // 'my' | 'all' | specific universityId
}

export interface MatchResultItem {
  item: FoundItem;
  similarityScore: number; // e.g. 92%
  matchReasons: {
    visual: number; // e.g. 94%
    semantic: number; // e.g. 91%
    location: number; // e.g. 88%
  };
  highlightFeatures: string[];
}
