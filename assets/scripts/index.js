// Use const instead of let when possible
const dataFilms = [];
// Combine selectors that reference the same element
const matchCard = document.getElementById('match'),
  noMatchCard = document.getElementById('no-match'),
  onboardingCard = document.getElementById('onboarding'),
  dropdown = document.querySelector('.dropdown-menu'),
  searchInput = document.querySelector('.form-control'),
  searchForm = document.querySelector('form'),
  bgPoster = document.getElementById('bg-poster'),
  filmPoster = document.querySelector('#film-poster'),
  filmTitle = document.querySelector('#film-title'),
  filmSynopsis = document.querySelector('#film-synopsis'),
  filmHepburn = document.querySelector('#film-hepburn'),
  filmRelease = document.querySelector('#film-release'),
  filmDirector = document.querySelector('#film-director'),
  filmReview = document.querySelector('#film-review'),
  filmRuntime = document.querySelector('#film-runtime'),
  filmGenre = document.querySelector('#film-genre'),
  filmBoxOffice = document.querySelector('#film-box-office'),
  filmAwards = document.querySelector('#film-awards'),
  characterTable = document.getElementById('character-table');

// Reduce DOM queries
const elements = {
  bgPoster,
  filmPoster,
  filmTitle,
  filmSynopsis,
  filmHepburn,
  filmRelease,
  filmDirector,
  filmReview,
  filmRuntime,
  filmGenre,
  filmBoxOffice,
  filmAwards,
  characterTable,
};

function showCard(film) {
  elements.bgPoster.style.backgroundImage = `url('${film.poster}')`;
  elements.filmPoster.src = film.poster;
  elements.filmPoster.alt = film.title;
  elements.filmTitle.textContent = film.title;
  elements.filmSynopsis.textContent = film.synopsis;
  elements.filmHepburn.textContent = film.hepburn;
  elements.filmRelease.textContent = film.release;
  elements.filmDirector.textContent = film.director;
  elements.filmReview.textContent = film.reviews?.imdb ? film.reviews.imdb : '';
  elements.filmRuntime.textContent = `${film.runtimeMinutes} min.`;
  elements.filmGenre.textContent = film.genre;
  elements.filmBoxOffice.textContent = `$${film.boxOfficeUSD} USD`;
  if (Array.isArray(film.awards)) {
    elements.filmAwards.innerHTML = '';
    film.awards.forEach((award) => {
      const awardItem = document.createElement('li');
      awardItem.textContent =
        award === '' ? 'No existen datos para mostrar' : `· ${award}`;
      elements.filmAwards.appendChild(awardItem);
    });
  }

  elements.characterTable.innerHTML = '';
  if (Array.isArray(film.character)) {
    film.character.forEach((character) => {
      const characterItem = document.createElement('tr');
      const characterName = document.createElement('td');
      const characterOriginal = document.createElement('td');
      const characterEnglish = document.createElement('td');

      if (character.name) {
        characterName.textContent = character.name;
      }
      if (character.originalCast) {
        characterOriginal.textContent = character.originalCast;
      }
      if (character.lastEnglishDubbingActor) {
        characterEnglish.textContent = character.lastEnglishDubbingActor;
      }

      characterItem.appendChild(characterName);
      characterItem.appendChild(characterOriginal);
      characterItem.appendChild(characterEnglish);
      elements.characterTable.appendChild(characterItem);
    });
  }
}

function fillDropdown() {
  dataFilms.forEach((film) => {
    const listItem = document.createElement('li');
    listItem.classList.add('d-flex', 'ps-2', 'align-items-center');
    const listImg = document.createElement('img');
    listImg.src = film.poster;
    listImg.alt = `${film.title} thumbnails`;
    listImg.width = '20';
    listImg.height = '20';
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = film.title;
    link.classList.add('dropdown-item');

    link.addEventListener('click', () => {
      const selectedFilmTitle = link.textContent?.trim();
      const selectedFilm = dataFilms.find((film) =>
        film.title.toLowerCase().includes(selectedFilmTitle?.toLowerCase())
      );
      if (selectedFilm) {
        showCard(selectedFilm);
        hideElements(noMatchCard);
        showElements(matchCard);
      } else {
        showElements(noMatchCard);
        hideElements(matchCard);
      }
      hideElements(onboardingCard);
    });

    listItem.appendChild(listImg);
    listItem.appendChild(link);
    dropdown.appendChild(listItem);
  });
}

function searchForFilm(event) {
  event.preventDefault();
  const search = searchInput.value?.toLowerCase().trim();

  if (!search) return;

  const selectedFilm = dataFilms.find((film) =>
    film.title.toLowerCase().includes(search)
  );

  if (selectedFilm) {
    showCard(selectedFilm);
    hideElements(noMatchCard);
    showElements(matchCard);
  } else {
    showElements(noMatchCard);
    hideElements(matchCard);
  }

  hideElements(onboardingCard);
  searchInput.value = '';
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://studio-ghibli-films-api.herokuapp.com/api/')
    .then((response) => response.json())
    .then((data) => {
      Object.keys(data).forEach((key) => {
        dataFilms.push(data[key]);
      });
      fillDropdown();
      searchForm.addEventListener('submit', searchForFilm);
    })
    .catch((error) => {
      console.error(error);
    });
});

/*
Helper functions
*/

function hideElements(...elements) {
  elements.forEach((element) => {
    element.classList.add('d-none');
  });
}

function showElements(...elements) {
  elements.forEach((element) => {
    element.classList.remove('d-none');
  });
}
