import '../css/styles.css';
import gallery from '../templates/gallery.hbs';
import Notiflix from 'notiflix';
import { getImages } from './api/api-servise';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtnRef = document.querySelector('.load-more');
let dataInput = '';
let page = 1;
let timerId = null;

formRef.addEventListener('submit', onFormSubmit);
formRef.addEventListener('input', onInput);
loadMoreBtnRef.addEventListener('click', onLoadMore);
loadMoreBtnRef.hidden = true;


function onFormSubmit(event) {
    event.preventDefault();
    loadMoreBtnRef.hidden = true;
    galleryRef.innerHTML = '';
        
    if (dataInput !== '') {
        getImages(dataInput)
        .then(createGallery)
        .catch(noResultsMessage);
    }

    page = 1;
}

function onInput(event) {
    dataInput = event.target.value.trim();
}

function createGallery(images) {
    clearInterval(timerId);
    if (images.totalHits === 0) {
            noResultsMessage(images);
    } else {
        renderMarkup(images);
        loadMoreBtnRef.hidden = false;
        
        if (images.hits.length < 40) {
            endOfListMessage();
            loadMoreBtnRef.hidden = true;
        }
    }
    
    if (page === 1 & images.totalHits > 0) {
        responseMessage(images);
    }
}

function renderMarkup(images) {
    images.hits.map(image => {
        galleryRef.insertAdjacentHTML('beforeend', gallery(image));
    })

    let lightbox = new SimpleLightbox('.photo-card a');
    lightbox.on('show.simplelightbox', function () { });
    lightbox.refresh();
}

function onLoadMore() {
    page += 1;
    getImages(dataInput, page)
        .then(images => {
            createGallery(images);
            smoothScroll();
        })
        .catch(noResultsMessage);
}

function smoothScroll() {
  const { height: cardHeight } = galleryRef
  .firstElementChild.getBoundingClientRect();

  window.scrollBy({
  top: cardHeight * 2,
  behavior: 'smooth',
  });  
}

function noResultsMessage() {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
}

function responseMessage(images) {
    Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
}

function endOfListMessage() {
    timerId = setTimeout(() => {
        Notiflix.Notify.warning("We\'re sorry, but you\'ve reached the end of search results.")
    }, 1000)
}