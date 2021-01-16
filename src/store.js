import { writable } from 'svelte/store';
import decode from 'jwt-decode';
// import { LocalStorage } from "node-localstorage";
// global.localStorage = new LocalStorage('.');
let token;
let payload;
let showCategories = false;
let theme = false;

if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      payload = decode(token).user;
    } catch (error) {
      console.log(error);
    }
  }

  const darkThemeFromStorage = JSON.parse(localStorage.getItem('darkTheme'));
  theme = darkThemeFromStorage == true ? true : false;
}

if (typeof screen !== 'undefined') {
  showCategories = screen.width > 750 ? true : false;
}

export const userStore = writable(payload);

export const categories = writable({});

export const searchResults = writable();

export const showOverlay = writable(false);

export const currentCategory = writable();

export const globalError = writable();

export const darkTheme = writable(theme);

export const showCategoriesBar = writable(showCategories);

darkTheme.subscribe((val) => {
  if (typeof window !== 'undefined') localStorage.setItem('darkTheme', val);
});
