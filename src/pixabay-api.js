export const API_URL = 'https://pixabay.com/api/';
export const API_KEY = '42275812-94ae38888942c55c0a8530194';
export const options = {
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: 1,
    q: '',
  },
};
