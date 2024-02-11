import axios from 'axios';
import { API_URL, options } from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchElement = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreElement = document.querySelector('.load-more');

loadMoreElement.style.display = 'none';

const lightbox = () =>
  new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
    enableKeyboard: true,
    showCounter: false,
    scrollZoom: false,
    close: false,
  });

searchElement.addEventListener('submit', onSubmit);

function getPhotos(hits) {
  const markup = hits
    .map(item => {
      return `
       <div class="photo-card">
          <a href="${item.largeImageURL}"> 
            <img src="${item.webformatURL}" alt="${item.tags}" />
          </a>
          <div class="info">
            <p class="info-item">
              <p> <b> Likes </b> </br> ${item.likes}</p>
            </p>
            <p class="info-item">
              <p> <b>Views</b> </br> ${item.views}</p>
            </p>
            <p class="info-item">
              <p> <b> Comments</b></br>${item.comments}</p>
            </p>
            <p class="info-item">
              <p> <b> Downloads</b></br>${item.downloads}</p>
            </p>
          </div>
        </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

async function onSubmit(event) {
  event.preventDefault();
  const form = event.target;
  options.params.q = form.elements.searchQuery.value;
  if (options.params.q === '') {
    Notify.info('Fill in the search input!');
    gallery.innerHTML = '';
    return;
  }

  options.params.page = 1;
  gallery.innerHTML = '';

  try {
    const response = await axios.get(API_URL, options);
    const totalHits = response.data.totalHits;
    const hits = response.data.hits;
    if (hits.length === 0) {
      loadMoreElement.style.display = 'none';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      getPhotos(hits);
      lightbox();
      loadMoreElement.style.display = 'block';
    }
  } catch (error) {
    console.log(error);
  }
}

function onScrollHandler() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

loadMoreElement.addEventListener('click', getMorePhotos);

async function getMorePhotos() {
  options.params.page += 1;
  try {
    const response = await axios.get(API_URL, options);
    const hits = response.data.hits;
    const totalHits = response.data.totalHits;
    getPhotos(hits);
    onScrollHandler();
    lightbox();
    if (options.params.page * options.params.per_page >= totalHits) {
      loadMoreElement.style.display = 'none';
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.log(error);
  }
}
