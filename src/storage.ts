// storage.ts
// This file provides a mock implementation of localStorage for Lynx,
// since @lynx-js/file-system is not available. This mock will store data
// in memory, so it will NOT persist across app restarts.

const storage: { [key: string]: string } = {};

export const localStorage = {
  getItem: async (key: string) => {
    return storage[key] || null;
  },
  setItem: async (key: string, value: string) => {
    storage[key] = value;
  },
  removeItem: async (key: string) => {
    delete storage[key];
  },
  clear: async () => {
    Object.keys(storage).forEach(key => delete storage[key]);
  },
};