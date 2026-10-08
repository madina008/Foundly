import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserProfile } from '../types';
import { api, getStoredToken, setStoredToken } from '../services/api';
import { KAZAKHSTAN_UNIVERSITIES, University } from '../data/kazakhstanUniversities';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (params: { email: string; password: string }) => Promise<void>;
  register: (params: {
    name: string;
    surname: string;
    email: string;
    password: string;
    universityId: string;
    universityName?: string;
    faculty?: string;
    course?: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  
  // University & Community Filters
  activeFilter: 'my' | 'all';
  setActiveFilter: (filter: 'my' | 'all') => void;
  selectedUniversityId: string;
  setSelectedUniversityId: (id: string) => void;
  currentUniversity: University | undefined;
  
  // Modals state
  authModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  profileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  uniSelectorOpen: boolean;
  openUniSelector: () => void;
  closeUniSelector: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // University filter: 'my' or 'all'
  const [activeFilter, setActiveFilter] = useState<'my' | 'all'>('my');
  // Selected campus ID (default to Zhubanov University as Kazakhstan anchor)
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>('zhubanov');

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [uniSelectorOpen, setUniSelectorOpen] = useState(false);

  // Check stored JWT token on startup
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    api.getMe()
      .then((res) => {
        if (res.user) {
          setUser(res.user);
          // Set user's university as selected
          setSelectedUniversityId(res.user.universityId);
        }
      })
      .catch((err) => {
        console.warn('Session expired or invalid:', err);
        setStoredToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (params: { email: string; password: string }) => {
    const res = await api.login(params);
    setUser(res.user);
    setSelectedUniversityId(res.user.universityId);
    setActiveFilter('my');
    setAuthModalOpen(false);
  };

  const register = async (params: {
    name: string;
    surname: string;
    email: string;
    password: string;
    universityId: string;
    universityName?: string;
    faculty?: string;
    course?: string;
  }) => {
    const res = await api.register(params);
    setUser(res.user);
    setSelectedUniversityId(res.user.universityId);
    setActiveFilter('my');
    setAuthModalOpen(false);
  };

  const logout = () => {
    setStoredToken(null);
    setUser(null);
    setProfileModalOpen(false);
    setActiveFilter('all');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const res = await api.updateProfile(updates);
    setUser(res.user);
    if (updates.universityId) {
      setSelectedUniversityId(updates.universityId);
    }
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => setAuthModalOpen(false);
  const openProfileModal = () => setProfileModalOpen(true);
  const closeProfileModal = () => setProfileModalOpen(false);
  const openUniSelector = () => setUniSelectorOpen(true);
  const closeUniSelector = () => setUniSelectorOpen(false);

  // Active university details
  const effectiveUniId = activeFilter === 'my' && user ? user.universityId : selectedUniversityId;
  const currentUniversity = KAZAKHSTAN_UNIVERSITIES.find(u => u.id === effectiveUniId) || KAZAKHSTAN_UNIVERSITIES[0];

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        updateProfile,
        activeFilter,
        setActiveFilter,
        selectedUniversityId,
        setSelectedUniversityId,
        currentUniversity,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        profileModalOpen,
        openProfileModal,
        closeProfileModal,
        uniSelectorOpen,
        openUniSelector,
        closeUniSelector,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
