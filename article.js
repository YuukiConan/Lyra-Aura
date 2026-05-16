import Rave from "./Rave/js/Rave.js";

const richi = Rave ? new Rave("Next 0.5 beta", "keyzarichi.org") : null;

richi.setCarousel({
    json: './json/news-carousel.json',
    title: document.querySelector('.carousel-title'),
    subtitle: document.querySelector('.carousel-subtitle'),
    track: document.querySelector('.carousel-track'),
    newsType: document.querySelector('.carousel-news-type'),
    indicators: document.querySelector('.carousel-indicators'),
    prev: document.querySelector('.prev-btn'),
    next: document.querySelector('.next-btn'),
    duration: 5000
});
