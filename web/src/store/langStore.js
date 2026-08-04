// src/store/langStore.js
// ============================================================
// Language Store — Zustand State Management for MLA E-Office
// Switches application language dynamically between English ('EN') & Marathi ('MR')
// ============================================================

import { create } from 'zustand';

const useLangStore = create((set) => ({
  lang: localStorage.getItem('mla_lang') || 'EN',
  setLang: (newLang) => {
    localStorage.setItem('mla_lang', newLang);
    set({ lang: newLang });
  },
}));

export default useLangStore;
