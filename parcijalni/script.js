const searchInput = document.getElementById("searchTerm");
const searchBtn = document.getElementById("searchTermBtn");
const songContainer = document.getElementById("songs");
const loader = document.getElementById("loader");

let term = "";
let timeoutId;

searchInput.addEventListener("input", debounce(updateTerm, 500));
searchBtn.addEventListener("click", updateTerm);

function updateTerm() {
  term = searchInput.value.trim();
  if (!term || term === "") {
    alert("upisi nesto");
  } else {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
      term
    )}`;
    showLoader();
    clearResults();
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const artists = data.results;
        artists.forEach((result) => {
          const article = createArticleElement(result);
          songContainer.appendChild(article);
        });
        hideLoader();
      })
      .catch((error) => {
        console.log("Request failed:", error);
        hideLoader();
      });
  }
}

function clearResults() {
  while (songContainer.firstChild) {
    songContainer.removeChild(songContainer.firstChild);
  }
}

function createArticleElement(result) {
  const article = document.createElement("article");
  const artists = document.createElement("p");
  const song = document.createElement("h4");
  const img = document.createElement("img");
  const audio = document.createElement("audio");
  const audioSource = document.createElement("source");

  artists.textContent = result.artistName;
  song.textContent = result.trackName;
  img.src = result.artworkUrl100;
  audioSource.src = result.previewUrl;
  audio.controls = true;

  article.appendChild(img);
  article.appendChild(artists);
  article.appendChild(song);
  article.appendChild(audio);
  audio.appendChild(audioSource);

  return article;
}

function debounce(func, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

document.addEventListener(
  "play",
  (event) => {
    const audioElements = document.getElementsByTagName("audio");
    for (let i = 0; i < audioElements.length; i++) {
      if (audioElements[i] !== event.target) {
        audioElements[i].pause();
      }
    }
  },
  true
);

function showLoader() {
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
}
