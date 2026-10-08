import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { authMiddleware, optionalAuthMiddleware, generateToken, AuthenticatedRequest } from './auth';
import { KAZAKHSTAN_UNIVERSITIES } from '../data/kazakhstanUniversities';

export const apiRouter = Router();

// --- 1. AUTH ROUTES ---

// Registration
apiRouter.post('/auth/register', (req, res: Response) => {
  try {
    const { name, surname, email, password, universityId, universityName, faculty, course } = req.body;

    if (!name || !surname || !email || !password || !universityId) {
      res.status(400).json({ error: 'Пожалуйста, заполните обязательные поля: имя, фамилия, email, пароль и университет' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Пароль должен содержать не менее 6 символов' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Введите корректный адрес электронной почты' });
      return;
    }

    const user = db.createUser({
      name,
      surname,
      email,
      password,
      universityId,
      universityName,
      faculty,
      course
    });

    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка при регистрации';
    res.status(400).json({ error: message });
  }
});

// Login
apiRouter.post('/auth/login', (req, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Введите адрес электронной почты и пароль' });
      return;
    }

    const userRecord = db.findUserByEmail(email);
    if (!userRecord) {
      res.status(401).json({ error: 'Неверный адрес электронной почты или пароль' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, userRecord.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Неверный адрес электронной почты или пароль' });
      return;
    }

    const { passwordHash: _, ...publicProfile } = userRecord;
    const token = generateToken(publicProfile);

    res.json({ user: publicProfile, token });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка при входе';
    res.status(500).json({ error: message });
  }
});

// Get current user profile
apiRouter.get('/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

// Update profile
apiRouter.put('/auth/profile', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, surname, universityId, universityName, faculty, course } = req.body;

    const updatedUser = db.updateUserProfile(userId, {
      name,
      surname,
      universityId,
      universityName,
      faculty,
      course
    });

    res.json({ user: updatedUser });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка обновления профиля';
    res.status(400).json({ error: message });
  }
});

// --- 2. UNIVERSITIES CATALOG ---
apiRouter.get('/universities', (_req, res: Response) => {
  res.json({ universities: KAZAKHSTAN_UNIVERSITIES });
});

// --- 3. ITEMS / ANNOUNCEMENTS ROUTES ---

// Get items with optional university or user filter
apiRouter.get('/items', (req, res: Response) => {
  try {
    const universityId = req.query.universityId as string | undefined;
    const userId = req.query.userId as string | undefined;

    const items = db.getItems({ universityId, userId });
    res.json({ items });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка получения объявлений';
    res.status(500).json({ error: message });
  }
});

// Create item
apiRouter.post('/items', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      category,
      description,
      location,
      campusZone,
      universityId,
      universityName,
      date,
      time,
      status,
      finderType,
      finderName,
      imageUrl,
      distinctiveFeatures,
      finderNote,
      storagePlace,
      keywords
    } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: 'Название и описание обязательны для заполнения' });
      return;
    }

    // Default to author's university if logged in and not specified
    const resolvedUniId = universityId || req.user?.universityId || 'zhubanov';
    const uniMeta = KAZAKHSTAN_UNIVERSITIES.find(u => u.id === resolvedUniId);
    const resolvedUniName = universityName || uniMeta?.shortName || req.user?.universityName || 'Zhubanov University';

    const newItem = db.createItem({
      title: title.trim(),
      category: category || 'electronics',
      description: description.trim(),
      location: location || 'Кампус университета',
      campusZone: campusZone || `${resolvedUniName}, Главный корпус`,
      universityId: resolvedUniId,
      universityName: resolvedUniName,
      date: date || new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      time: time || new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      status: status || 'Найдена',
      statusColor: status === 'Передано в бюро находок' ? 'blue' : (status === 'Ожидает подтверждения' ? 'amber' : 'emerald'),
      finderType: finderType || (req.user ? 'Студент' : 'Пользователь'),
      finderName: finderName || (req.user ? `${req.user.name} ${req.user.surname}` : 'Анонимный студент'),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80',
      distinctiveFeatures: Array.isArray(distinctiveFeatures) ? distinctiveFeatures : [],
      finderNote: finderNote || 'Оставлено на проверку в Foundly',
      storagePlace: storagePlace || 'У нашедшего / стойка охраны',
      keywords: Array.isArray(keywords) ? keywords : [title.toLowerCase()],
      userId: req.user ? req.user.id : null,
      authorEmail: req.user ? req.user.email : undefined,
    });

    res.status(201).json({ item: newItem });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка создания объявления';
    res.status(400).json({ error: message });
  }
});

// Update item (ownership enforced!)
apiRouter.put('/items/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const itemId = req.params.id;
    const userId = req.user!.id;
    const updates = req.body;

    const updated = db.updateItem(itemId, userId, updates);
    res.json({ item: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка обновления объявления';
    res.status(403).json({ error: message });
  }
});

// Delete item (ownership enforced!)
apiRouter.delete('/items/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const itemId = req.params.id;
    const userId = req.user!.id;

    db.deleteItem(itemId, userId);
    res.json({ success: true, message: 'Объявление успешно удалено' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка удаления объявления';
    res.status(403).json({ error: message });
  }
});
