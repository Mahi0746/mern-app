import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type Priority = 'low' | 'medium' | 'high';

type Todo = {
  _id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  pointsEarned: number;
  isCompleted: boolean;
};

type Profile = {
  xp: number;
  level: number;
  streakCount: number;
  completedCount: number;
};

type BadgeCatalog = {
  code: string;
  title: string;
  description: string;
  icon?: string;
};

type EarnedBadge = BadgeCatalog & {
  awardedAt: string;
};

type NewBadgePayload = {
  badge: BadgeCatalog;
  userBadge: {
    awardedAt: string;
  };
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

const PRIORITY_RULES: Record<
  Priority,
  { label: string; points: number; accent: string }
> = {
  low: { label: 'Chill', points: 10, accent: '#38bdf8' },
  medium: { label: 'Focus', points: 20, accent: '#f97316' },
  high: { label: 'Boss', points: 35, accent: '#ef4444' },
};

const initialFormState = {
  title: '',
  description: '',
  priority: 'medium' as Priority,
  dueDate: '',
};

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString() : 'Anytime';

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
  const [allBadges, setAllBadges] = useState<BadgeCatalog[]>([]);
  const [formState, setFormState] = useState(initialFormState);
  const [editState, setEditState] = useState(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const xpProgress = useMemo(() => {
    if (!profile) return 0;
    const currentLevelBase = (profile.level - 1) * 100;
    const progress = profile.xp - currentLevelBase;
    return Math.min(100, (progress / 100) * 100);
  }, [profile]);

  const fetchProfile = useCallback(async () => {
    const [{ data: profileData }, { data: badgeData }, { data: catalog }] =
      await Promise.all([
        axios.get<Profile>(`${API_BASE_URL}/api/profile`),
        axios.get<EarnedBadge[]>(`${API_BASE_URL}/api/profile/badges`),
        axios.get<BadgeCatalog[]>(`${API_BASE_URL}/api/badges`),
      ]);
    setProfile(profileData);
    setEarnedBadges(badgeData);
    setAllBadges(catalog);
  }, [API_BASE_URL]);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [{ data: todoData }] = await Promise.all([
        axios.get<Todo[]>(`${API_BASE_URL}/api/todos`),
        fetchProfile(),
      ]);
      setTodos(todoData);
    } catch (err) {
      setError('Unable to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, fetchProfile]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.title.trim()) return;

    try {
      const payload = {
        ...formState,
        pointsEarned: PRIORITY_RULES[formState.priority].points,
      };
      const { data } = await axios.post<Todo>(
        `${API_BASE_URL}/api/todos`,
        payload
      );
      setTodos((prev) => [data, ...prev]);
      setFormState(initialFormState);
    } catch {
      setError('Failed to create todo');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const { data } = await axios.patch<{
        todo: Todo;
        progress: { profile: Profile; newBadges: NewBadgePayload[] };
      }>(`${API_BASE_URL}/api/todos/${id}/toggle`);

      setTodos((prev) => prev.map((todo) => (todo._id === id ? data.todo : todo)));
      setProfile(data.progress.profile);

      if (data.progress.newBadges.length > 0) {
        const newlyEarned = data.progress.newBadges.map((entry) => ({
          code: entry.badge.code,
          title: entry.badge.title,
          description: entry.badge.description,
          icon: entry.badge.icon,
          awardedAt: entry.userBadge.awardedAt,
        }));
        setEarnedBadges((prev) => [...prev, ...newlyEarned]);
        setToast(`Unlocked ${newlyEarned.length} badge${newlyEarned.length > 1 ? 's' : ''}!`);
      }
    } catch {
      setError('Failed to update todo');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/todos/${id}`);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch {
      setError('Failed to delete todo');
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo._id);
    setEditState({
      title: todo.title,
      description: todo.description ?? '',
      priority: todo.priority,
      dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
    });
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingId) return;

    try {
      const payload = {
        ...editState,
        pointsEarned: PRIORITY_RULES[editState.priority].points,
      };
      const { data } = await axios.put<Todo>(
        `${API_BASE_URL}/api/todos/${editingId}`,
        payload
      );
      setTodos((prev) => prev.map((todo) => (todo._id === editingId ? data : todo)));
      setEditingId(null);
    } catch {
      setError('Unable to save changes');
    }
  };

  const badgeGrid = useMemo(() => {
    return allBadges.map((badge) => {
      const unlocked = earnedBadges.some((earned) => earned.code === badge.code);
      return { ...badge, unlocked };
    });
  }, [allBadges, earnedBadges]);

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Atlas gamified</p>
          <h1>Questboard</h1>
          <p className="subtitle">
            Complete tasks, earn XP, and unlock badges stored in MongoDB Atlas.
          </p>
        </div>
        {profile && (
          <div className="level-card">
            <div className="level-row">
              <span className="level-label">Level</span>
              <span className="level-value">{profile.level}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${xpProgress}%` }} />
            </div>
            <div className="progress-meta">
              <span>{profile.xp} XP</span>
              <span>Streak {profile.streakCount}🔥</span>
            </div>
          </div>
        )}
      </header>

      <section className="grid">
        <form className="card create-card" onSubmit={handleCreate}>
          <h2>Create quest</h2>
          <p>Add richer context so Atlas can track rewards.</p>
          <label>
            <span>Title</span>
            <input
              type="text"
              value={formState.title}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Build Atlas demo"
              required
            />
          </label>
          <label>
            <span>Description</span>
            <textarea
              value={formState.description}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              placeholder="Describe what success looks like"
              rows={3}
            />
          </label>
          <div className="form-row">
            <label>
              <span>Priority</span>
              <select
                value={formState.priority}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    priority: event.target.value as Priority,
                  }))
                }
              >
                {Object.entries(PRIORITY_RULES).map(([value, rule]) => (
                  <option key={value} value={value}>
                    {rule.label} (+{rule.points} XP)
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Due date</span>
              <input
                type="date"
                value={formState.dueDate}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, dueDate: event.target.value }))
                }
              />
            </label>
          </div>
          <button type="submit">Add quest</button>
        </form>

        <div className="card stats-card">
          <h2>Momentum</h2>
          <div className="stats-row">
            <div>
              <p className="stat-label">Completed</p>
              <p className="stat-value">{profile?.completedCount ?? 0}</p>
            </div>
            <div>
              <p className="stat-label">Active quests</p>
              <p className="stat-value">{todos.filter((t) => !t.isCompleted).length}</p>
            </div>
          </div>
          <h3>Badges</h3>
          <div className="badge-grid">
            {badgeGrid.map((badge) => (
              <div
                key={badge.code}
                className={badge.unlocked ? 'badge unlocked' : 'badge locked'}
              >
                <span className="icon">{badge.icon ?? '🏅'}</span>
                <p>{badge.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {error && (
        <div className="banner error">
          <span>{error}</span>
          <button onClick={loadTodos}>Retry</button>
        </div>
      )}

      <section className="todo-list">
        {loading ? (
          <p>Loading quests…</p>
        ) : todos.length === 0 ? (
          <p>No quests yet. Start by adding one!</p>
        ) : (
          todos.map((todo) => {
            const priorityStyle = PRIORITY_RULES[todo.priority];
            const isEditing = editingId === todo._id;
            return (
              <article
                key={todo._id}
                className={todo.isCompleted ? 'todo completed' : 'todo'}
              >
                <div className="todo-header">
                  <label>
                    <input
                      type="checkbox"
                      checked={todo.isCompleted}
                      onChange={() => handleToggle(todo._id)}
                    />
                    <span>{todo.title}</span>
                  </label>
                  <div className="todo-meta">
                    <span
                      className="pill"
                      style={{ backgroundColor: priorityStyle.accent }}
                    >
                      {priorityStyle.label}
                    </span>
                    <span className="pill ghost">{todo.pointsEarned} XP</span>
                    <span className="pill ghost">{formatDate(todo.dueDate)}</span>
                  </div>
                </div>

                {todo.description && !isEditing && (
                  <p className="todo-description">{todo.description}</p>
                )}

                {isEditing ? (
                  <form className="todo-edit" onSubmit={handleEditSubmit}>
                    <input
                      type="text"
                      value={editState.title}
                      onChange={(event) =>
                        setEditState((prev) => ({ ...prev, title: event.target.value }))
                      }
                    />
                    <textarea
                      value={editState.description}
                      onChange={(event) =>
                        setEditState((prev) => ({
                          ...prev,
                          description: event.target.value,
                        }))
                      }
                      rows={2}
                    />
                    <div className="form-row">
                      <select
                        value={editState.priority}
                        onChange={(event) =>
                          setEditState((prev) => ({
                            ...prev,
                            priority: event.target.value as Priority,
                          }))
                        }
                      >
                        {Object.entries(PRIORITY_RULES).map(([value, rule]) => (
                          <option key={value} value={value}>
                            {rule.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={editState.dueDate}
                        onChange={(event) =>
                          setEditState((prev) => ({
                            ...prev,
                            dueDate: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="todo-actions">
                      <button type="submit">Save</button>
                      <button
                        className="ghost"
                        type="button"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="todo-actions">
                    <button type="button" onClick={() => startEdit(todo)}>
                      Edit
                    </button>
                    <button
                      className="ghost"
                      type="button"
                      onClick={() => handleDelete(todo._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>

      {toast && (
        <div className="toast" onAnimationEnd={() => setToast(null)}>
          {toast}
        </div>
      )}
    </div>
  );
};

export default App;

