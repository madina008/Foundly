export type CategoryType = 'electronics' | 'documents' | 'clothing' | 'accessories' | 'other';

export interface CategoryInfo {
  id: CategoryType;
  label: string;
  iconName: string;
}

export interface FoundItem {
  id: string;
  title: string;
  category: CategoryType;
  description: string;
  location: string;
  campusZone: string;
  date: string;
  time: string;
  status: 'Найдена' | 'Ожидает подтверждения' | 'Передано в бюро находок';
  statusColor: 'emerald' | 'amber' | 'blue';
  finderType: 'Студент' | 'Сотрудник библиотеки' | 'Охрана кампуса' | 'Преподаватель';
  finderName: string;
  imageUrl: string;
  distinctiveFeatures: string[];
  finderNote: string;
  storagePlace: string;
  // Demo matching attributes
  keywords: string[];
}

export interface SearchQuery {
  description: string;
  category: CategoryType | 'all';
  location: string;
  hasPhoto?: boolean;
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

