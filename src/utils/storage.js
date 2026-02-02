const WORKOUTS_KEY = 'my_workouts_data';
const LIBRARY_KEY = 'my_exercise_library';
const CATEGORIES_KEY = 'my_categories';
const HABITS_KEY = 'my_habits';
const MEASUREMENTS_KEY = 'my_measurements';
const USER_NAME_KEY = 'my_tracker_user_name';
const PLANS_KEY = 'my_workout_plans'; // Планы
const DRAFT_KEY = 'my_workout_draft'; // Черновик

export const storage = {
  saveWorkouts: (data) => localStorage.setItem(WORKOUTS_KEY, JSON.stringify(data)),
  getWorkouts: () => JSON.parse(localStorage.getItem(WORKOUTS_KEY) || '[]'),
  
  saveLibrary: (data) => localStorage.setItem(LIBRARY_KEY, JSON.stringify(data)),
  getLibrary: () => JSON.parse(localStorage.getItem(LIBRARY_KEY) || '[]'),

  saveCategories: (data) => localStorage.setItem(CATEGORIES_KEY, JSON.stringify(data)),
  getCategories: () => JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]'),

  saveHabits: (data) => localStorage.setItem(HABITS_KEY, JSON.stringify(data)),
  getHabits: () => JSON.parse(localStorage.getItem(HABITS_KEY) || '[]'),

  saveMeasurements: (data) => localStorage.setItem(MEASUREMENTS_KEY, JSON.stringify(data)),
  getMeasurements: () => JSON.parse(localStorage.getItem(MEASUREMENTS_KEY) || '[]'),

  saveUserName: (name) => localStorage.setItem(USER_NAME_KEY, name),
  getUserName: () => localStorage.getItem(USER_NAME_KEY) || 'Алёна',

  savePlans: (data) => localStorage.setItem(PLANS_KEY, JSON.stringify(data)),
  getPlans: () => JSON.parse(localStorage.getItem(PLANS_KEY) || '[]'),

  saveDraft: (data) => localStorage.setItem(DRAFT_KEY, JSON.stringify(data)),
  getDraft: () => JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'),
  clearDraft: () => localStorage.removeItem(DRAFT_KEY),
};