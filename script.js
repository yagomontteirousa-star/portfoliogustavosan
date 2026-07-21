const brands = [
  { name: "Rede Globo", logo: "assets/brands/globo-icon.svg", className: "symbol" },
  { name: "Disney", logo: "assets/brands/disney-full-white.png", className: "wide disney" },
  { name: "iFood", logo: "assets/brands/ifood.svg" },
  { name: "99", logo: "assets/brands/99-wordmark.png", className: "number-logo" },
  { name: "Som Livre", logo: "assets/brands/som-livre.png" },
  { name: "Dell", logo: "assets/brands/dell.svg", className: "symbol" },
  { name: "Claro", logo: "assets/brands/claro-wordmark.svg", className: "wide" },
  { name: "Disney Pixar", logo: "assets/brands/disney-pixar.png" },
  { name: "LATAM Airlines", logo: "assets/brands/latam-airlines.svg", className: "wide" },
  { name: "Mercado Livre", logo: "assets/brands/mercado-livre.png" },
  { name: "Amazon Prime", logo: "assets/brands/amazon-prime.svg", className: "wide" },
  { name: "99Food", logo: "assets/brands/99food.png", className: "food-logo" },
];

const works = [
  {
    title: "Demo Reel 2026",
    type: "Seleção publicitária",
    mediaType: "audio",
    src: "assets/demo-gustavo-san.mp3",
  },
  {
    title: "Locução publicitária",
    type: "Campanha veiculada",
    mediaType: "video",
    embedUrl: "https://www.youtube.com/embed/GPDCZIeGgrI",
  },
  {
    title: "Brasil com S",
    type: "Som Livre · Chamada de TV",
    mediaType: "audio",
    src: "assets/som-livre-brasil-com-s.mp3",
  },
  {
    title: "Identidade sonora",
    type: "Filme de marca",
    mediaType: "video",
    embedUrl: "https://www.youtube.com/embed/APFnqweo7Uo",
  },
  {
    title: "Zappy",
    type: "Filme publicitário · Natural",
    mediaType: "audio",
    src: "assets/zappy-gustavo-san.mp3",
  },
  {
    title: "Campanha digital",
    type: "Conteúdo publicitário",
    mediaType: "video",
    embedUrl: "https://www.youtube.com/embed/NGkMK8iXRyc",
  },
  {
    title: "Nova Bank",
    type: "Filme publicitário · Moderno",
    mediaType: "audio",
    src: "assets/nova-bank-gustavo-san.mp3",
  },
  {
    title: "Varejo & promoção",
    type: "Filme veiculado",
    mediaType: "video",
    embedUrl: "https://www.youtube.com/embed/FK1mtd7BYc8",
  },
  {
    title: "Shopline",
    type: "Varejo · Promocional",
    mediaType: "audio",
    src: "assets/shopline-gustavo-san.mp3",
  },
  {
    title: "Três Corações",
    type: "Filme publicitário · Acolhedor",
    mediaType: "audio",
    src: "assets/tres-coracoes-gustavo-san.mp3",
  },
];

const brandRow = document.querySelector("#brand-row");
const workList = document.querySelector("#work-list");
const audioPlayer = document.querySelector("#audio-player");
const videoFrame = document.querySelector("#video-frame");
const videoIframe = document.querySelector("#video-iframe");
const audio = document.querySelector("#audio");
const playButton = document.querySelector("#play-button");
const playerTitle = document.querySelector("#player-title");
const playerSubtitle = document.querySelector("#player-subtitle");
const audioSeek = document.querySelector("#audio-seek");
const currentTimeEl = document.querySelector("#current-time");
const durationEl = document.querySelector("#duration");
const volumeButton = document.querySelector("#volume-button");
const volumePopover = document.querySelector("#volume-popover");
const volumeSlider = document.querySelector("#volume-slider");
const volumeValue = document.querySelector("#volume-value");

let brandPage = 0;
let selectedWork = 0;

document.querySelector("#year").textContent = new Date().getFullYear();

function formatTime(value) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = String(Math.floor(value % 60)).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function setRangeProgress(input, propertyName, percent) {
  input.style.setProperty(propertyName, `${Math.max(0, Math.min(100, percent))}%`);
}

function renderBrands() {
  const visible = Array.from({ length: 3 }, (_, index) => {
    const brandIndex = (brandPage * 3 + index) % brands.length;
    return brands[brandIndex];
  });

  brandRow.innerHTML = "";
  visible.forEach((brand) => {
    const pill = document.createElement("div");
    pill.className = "brand-pill";
    pill.title = brand.name;

    const logo = document.createElement("img");
    logo.className = `brand-logo ${brand.className ?? ""}`.trim();
    logo.src = brand.logo;
    logo.alt = brand.name;

    pill.appendChild(logo);
    brandRow.appendChild(pill);
  });
}

function renderWorkList() {
  workList.innerHTML = "";

  works.forEach((work, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = index === selectedWork ? "work-option active" : "work-option";

    const number = document.createElement("span");
    number.className = "work-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const copy = document.createElement("span");
    const title = document.createElement("strong");
    const subtitle = document.createElement("small");
    const tag = document.createElement("b");

    title.textContent = work.title;
    tag.textContent = work.mediaType === "audio" ? "Áudio" : "Vídeo";
    subtitle.append(tag, document.createTextNode(work.type));
    copy.append(title, subtitle);
    button.append(number, copy);

    button.addEventListener("click", () => selectWork(index));
    workList.appendChild(button);
  });
}

function selectWork(index) {
  selectedWork = index;
  const work = works[selectedWork];
  renderWorkList();

  audio.pause();
  playButton.classList.remove("is-playing");
  playButton.setAttribute("aria-label", "Reproduzir áudio");
  audio.currentTime = 0;
  audioSeek.value = 0;
  setRangeProgress(audioSeek, "--audio-progress", 0);
  currentTimeEl.textContent = "0:00";

  if (work.mediaType === "audio") {
    videoIframe.src = "";
    videoFrame.hidden = true;
    audioPlayer.hidden = false;
    audio.src = work.src;
    audio.load();
    playerTitle.textContent = work.title;
    playerSubtitle.textContent = work.type;
  } else {
    audio.removeAttribute("src");
    audio.load();
    audioPlayer.hidden = true;
    videoFrame.hidden = false;
    videoIframe.src = work.embedUrl;
    videoIframe.title = work.title;
  }
}

function toggleAudio() {
  if (!audio.src) return;

  if (audio.paused) {
    audio.play();
    playButton.classList.add("is-playing");
    playButton.setAttribute("aria-label", "Pausar áudio");
  } else {
    audio.pause();
    playButton.classList.remove("is-playing");
    playButton.setAttribute("aria-label", "Reproduzir áudio");
  }
}

function seekAudio(value) {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
  const nextTime = Math.max(0, Math.min(Number(value), audio.duration));
  audio.currentTime = nextTime;
  currentTimeEl.textContent = formatTime(nextTime);
  setRangeProgress(audioSeek, "--audio-progress", (nextTime / audio.duration) * 100);
}

function syncVolume() {
  const volume = Number(volumeSlider.value);
  audio.volume = volume;
  volumeValue.textContent = `${Math.round(volume * 100)}%`;
  setRangeProgress(volumeSlider, "--volume-progress", volume * 100);
}

setInterval(() => {
  brandRow.classList.remove("is-visible");
  brandRow.classList.add("is-hidden");

  window.setTimeout(() => {
    brandPage = (brandPage + 1) % Math.ceil(brands.length / 3);
    renderBrands();
    brandRow.classList.remove("is-hidden");
    brandRow.classList.add("is-visible");
  }, 320);
}, 2800);

playButton.addEventListener("click", toggleAudio);

audio.addEventListener("loadedmetadata", () => {
  const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
  audioSeek.max = duration || 1;
  durationEl.textContent = formatTime(duration);
});

audio.addEventListener("timeupdate", () => {
  const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  setRangeProgress(audioSeek, "--audio-progress", duration ? (audio.currentTime / duration) * 100 : 0);
  audioSeek.value = duration ? audio.currentTime : 0;
});

audio.addEventListener("ended", () => {
  playButton.classList.remove("is-playing");
  playButton.setAttribute("aria-label", "Reproduzir áudio");
});

audioSeek.addEventListener("input", (event) => seekAudio(event.currentTarget.value));
audioSeek.addEventListener("change", (event) => seekAudio(event.currentTarget.value));

volumeButton.addEventListener("click", () => {
  const willOpen = volumePopover.hidden;
  volumePopover.hidden = !willOpen;
  volumeButton.setAttribute("aria-expanded", String(willOpen));
});

volumeSlider.addEventListener("input", syncVolume);
volumeSlider.addEventListener("change", syncVolume);

document.addEventListener("click", (event) => {
  if (!event.target.closest(".volume-control")) {
    volumePopover.hidden = true;
    volumeButton.setAttribute("aria-expanded", "false");
  }
});

renderBrands();
renderWorkList();
syncVolume();
selectWork(0);
