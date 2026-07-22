const brands = [
  { name: "Mercado Livre", logo: "assets/brands/mercado-livre.png" },
  { name: "Amazon Prime", logo: "assets/brands/amazon-prime.svg", className: "wide" },
  { name: "99Food", logo: "assets/brands/99food.png", className: "food-logo" },
  { name: "Rede Globo", logo: "assets/brands/globo-icon.svg", className: "symbol" },
  { name: "Disney", logo: "assets/brands/disney-full-white.png", className: "wide disney" },
  { name: "iFood", logo: "assets/brands/ifood.svg" },
  { name: "99", logo: "assets/brands/99-wordmark.png", className: "number-logo" },
  { name: "Som Livre", logo: "assets/brands/som-livre.png" },
  { name: "Dell", logo: "assets/brands/dell.svg", className: "symbol" },
  { name: "Claro", logo: "assets/brands/claro-wordmark.svg", className: "wide" },
  { name: "Disney Pixar", logo: "assets/brands/disney-pixar.png" },
  { name: "LATAM Airlines", logo: "assets/brands/latam-airlines.svg", className: "wide" },
];

const audioWorks = [
  { title: "Demo Reel 2026", brand: "Gustavo San", src: "assets/demo-gustavo-san.mp3", logo: "assets/brand-kit/icone-uso-cor.png" },
  { title: "Brasil com S", brand: "Som Livre", src: "assets/som-livre-brasil-com-s.mp3", logo: "assets/brands/som-livre.png" },
  { title: "Zappy", brand: "Zappy", src: "assets/zappy-gustavo-san.mp3", mark: "ZAPPY" },
  { title: "Nova Bank", brand: "Nova Bank", src: "assets/nova-bank-gustavo-san.mp3", mark: "NOVA" },
  { title: "Shopline", brand: "Shopline", src: "assets/shopline-gustavo-san.mp3", mark: "SHOPLINE" },
  { title: "Três Corações", brand: "Três Corações", src: "assets/tres-coracoes-gustavo-san.mp3", mark: "3 CORAÇÕES" },
  { title: "Reel comercial", brand: "Voz publicitária", src: "assets/demo-gustavo-san.mp3", logo: "assets/brand-kit/icone-uso-cor.png" },
  { title: "Reel institucional", brand: "Tom institucional", src: "assets/nova-bank-gustavo-san.mp3", mark: "INSTITUCIONAL" },
  { title: "Reel promocional", brand: "Voz de varejo", src: "assets/shopline-gustavo-san.mp3", mark: "VAREJO" },
];

const videoWorks = [
  { title: "Locução publicitária", videoId: "GPDCZIeGgrI" },
  { title: "Identidade sonora", videoId: "APFnqweo7Uo" },
  { title: "Campanha digital", videoId: "NGkMK8iXRyc" },
  { title: "Varejo & promoção", videoId: "FK1mtd7BYc8" },
  { title: "Bastidores em estúdio", src: "assets/gustavo-ambient.mp4", thumbnail: "assets/gustavo-san-cutout.webp" },
];

const brandRow = document.querySelector("#brand-row");
const audioGrid = document.querySelector("#audio-grid");
const videoGrid = document.querySelector("#video-grid");
const globalVolume = document.querySelector("#global-volume");
const globalVolumeButton = document.querySelector("#global-volume-button");
const globalVolumeValue = document.querySelector("#global-volume-value");
const ambientVideo = document.querySelector(".ambient-video video");
const audioElements = [];
const audioControls = [];
const videoCards = [];
let brandPage = 0;
let playingAudio = null;

document.querySelector("#year").textContent = new Date().getFullYear();

const playIcon = (playing = false) => playing
  ? '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"></rect><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"></rect></svg>'
  : '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5.7v12.6L18 12 8 5.7Z" fill="currentColor"></path></svg>';

const volumeIcon = (muted = false) => muted
  ? '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m16 9 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  : '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15 9.5a4 4 0 0 1 0 5m2.5-7.5a7 7 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = String(Math.floor(value % 60)).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

const narrowQuery = window.matchMedia("(max-width: 359px)");
const compactQuery = window.matchMedia("(max-width: 900px)");

function getBrandCount() {
  if (narrowQuery.matches) return 2;
  return compactQuery.matches ? 3 : 4;
}

function renderBrands() {
  const count = getBrandCount();
  // Reaproveita os pills já existentes: mesma marcação final, sem recriar o DOM
  // (e sem novo decode de imagem) a cada rotação do carrossel.
  while (brandRow.children.length > count) brandRow.lastElementChild.remove();
  while (brandRow.children.length < count) {
    const pill = document.createElement("div");
    const logo = document.createElement("img");
    pill.className = "brand-pill";
    logo.decoding = "async";
    pill.appendChild(logo);
    brandRow.appendChild(pill);
  }
  for (let index = 0; index < count; index += 1) {
    const brand = brands[(brandPage * count + index) % brands.length];
    const pill = brandRow.children[index];
    const logo = pill.firstElementChild;
    pill.title = brand.name;
    logo.className = `brand-logo ${brand.className || ""}`.trim();
    if (logo.getAttribute("src") !== brand.logo) logo.src = brand.logo;
    logo.alt = brand.name;
  }
}

function resetAudioControl(index) {
  const control = audioControls[index];
  if (!control) return;
  control.card.classList.remove("is-playing");
  control.play.innerHTML = playIcon(false);
  control.play.setAttribute("aria-label", `Reproduzir ${audioWorks[index].title}`);
  control.progress.hidden = true;
}

function stopOtherAudio(selectedIndex) {
  audioElements.forEach((audio, index) => {
    if (index !== selectedIndex) {
      audio.pause();
      resetAudioControl(index);
    }
  });
}

function syncAudioProgress(index) {
  const audio = audioElements[index];
  const control = audioControls[index];
  if (!audio || !control) return;
  const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
  control.seek.max = duration || 1;
  control.seek.value = duration ? audio.currentTime : 0;
  control.seek.style.setProperty("--card-progress", `${duration ? (audio.currentTime / duration) * 100 : 0}%`);
  control.time.textContent = `${formatTime(audio.currentTime)} / ${formatTime(duration)}`;
}

function renderAudioCatalog() {
  audioGrid.replaceChildren();
  audioWorks.forEach((work, index) => {
    const card = document.createElement("article");
    const visual = document.createElement("div");
    const play = document.createElement("button");
    const progress = document.createElement("div");
    const seek = document.createElement("input");
    const time = document.createElement("span");
    const copy = document.createElement("div");
    const brand = document.createElement("strong");
    const title = document.createElement("span");
    const audio = document.createElement("audio");

    card.className = "audio-card";
    visual.className = "audio-visual";
    play.className = "catalog-play";
    play.type = "button";
    play.innerHTML = playIcon(false);
    play.setAttribute("aria-label", `Reproduzir ${work.title}`);
    progress.className = "audio-card-progress";
    progress.hidden = true;
    seek.type = "range";
    seek.min = "0";
    seek.max = "1";
    seek.step = "0.1";
    seek.value = "0";
    seek.setAttribute("aria-label", `Progresso de ${work.title}`);
    copy.className = "catalog-copy";
    brand.textContent = work.brand;
    title.textContent = work.title;
    audio.src = work.src;
    // "none" evita 6 downloads simultâneos de MP3 na carga da página, que
    // competiam com o vídeo e com a imagem principal. Os metadados são
    // carregados no primeiro play e o progresso já se sincroniza sozinho.
    audio.preload = "none";
    audio.volume = Number(globalVolume.value);
    audioElements[index] = audio;
    audioControls[index] = { card, play, progress, seek, time };

    if (work.logo) {
      const logo = document.createElement("img");
      logo.src = work.logo;
      logo.alt = `Logo ${work.brand}`;
      visual.appendChild(logo);
    } else {
      const mark = document.createElement("span");
      mark.className = "audio-wordmark";
      mark.textContent = work.mark;
      visual.appendChild(mark);
    }

    play.addEventListener("click", async () => {
      const wasPlaying = playingAudio === index && !audio.paused;
      stopOtherAudio(index);
      if (wasPlaying) {
        audio.pause();
        playingAudio = null;
        resetAudioControl(index);
        return;
      }
      try {
        await audio.play();
        playingAudio = index;
        card.classList.add("is-playing");
        play.innerHTML = playIcon(true);
        play.setAttribute("aria-label", `Pausar ${work.title}`);
        progress.hidden = false;
        syncAudioProgress(index);
      } catch {
        resetAudioControl(index);
      }
    });

    seek.addEventListener("input", () => {
      if (!Number.isFinite(audio.duration)) return;
      audio.currentTime = Math.max(0, Math.min(Number(seek.value), audio.duration));
      syncAudioProgress(index);
    });
    audio.addEventListener("loadedmetadata", () => syncAudioProgress(index));
    audio.addEventListener("durationchange", () => syncAudioProgress(index));
    audio.addEventListener("timeupdate", () => syncAudioProgress(index));
    audio.addEventListener("ended", () => {
      playingAudio = null;
      resetAudioControl(index);
    });

    progress.append(seek, time);
    copy.append(brand, title);
    visual.append(play, progress, audio);
    card.append(visual, copy);
    audioGrid.appendChild(card);
  });
}

// Devolve um card de vídeo ao estado de miniatura, encerrando o player que
// estava aberto nele (iframe do YouTube ou <video> local).
function closeVideoCard(entry) {
  if (!entry || !entry.open) return;
  entry.thumb.replaceChildren(entry.image, entry.play);
  entry.open = false;
}

function closeOtherVideoCards(current) {
  videoCards.forEach((entry) => {
    if (entry !== current) closeVideoCard(entry);
  });
}

function renderVideoCatalog() {
  videoGrid.replaceChildren();
  videoCards.length = 0;
  videoWorks.forEach((work) => {
    const card = document.createElement("article");
    const thumb = document.createElement("div");
    const image = document.createElement("img");
    const play = document.createElement("button");
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    const type = document.createElement("span");

    card.className = "video-card";
    thumb.className = "video-thumb";
    image.src = work.videoId ? `https://img.youtube.com/vi/${work.videoId}/hqdefault.jpg` : work.thumbnail;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    play.className = "catalog-play video-play";
    play.type = "button";
    play.innerHTML = playIcon(false);
    play.setAttribute("aria-label", `Reproduzir ${work.title}`);
    copy.className = "catalog-copy";
    title.textContent = work.title;
    type.textContent = "Vídeo";

    const entry = { thumb, image, play, open: false };
    videoCards.push(entry);

    play.addEventListener("click", () => {
      audioElements.forEach((audio, index) => {
        audio.pause();
        resetAudioControl(index);
      });
      playingAudio = null;
      // Só um vídeo por vez: antes ficavam vários iframes/players tocando juntos.
      closeOtherVideoCards(entry);

      if (work.videoId) {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${work.videoId}?autoplay=1&rel=0`;
        iframe.title = work.title;
        iframe.loading = "lazy";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        thumb.replaceChildren(iframe);
      } else {
        const video = document.createElement("video");
        video.src = work.src;
        video.autoplay = true;
        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.setAttribute("aria-label", work.title);
        thumb.replaceChildren(video);
      }
      entry.open = true;
    });

    copy.append(title, type);
    thumb.append(image, play);
    card.append(thumb, copy);
    videoGrid.appendChild(card);
  });
}

function syncGlobalVolume() {
  const volume = Number(globalVolume.value);
  audioElements.forEach((audio) => { audio.volume = volume; });
  globalVolume.style.setProperty("--global-volume", `${volume * 100}%`);
  globalVolumeValue.textContent = `${Math.round(volume * 100)}%`;
  globalVolumeButton.innerHTML = volumeIcon(volume === 0);
  globalVolumeButton.setAttribute("aria-label", volume === 0 ? "Ativar volume dos áudios" : "Silenciar áudios");
}

globalVolume.addEventListener("input", syncGlobalVolume);
globalVolumeButton.addEventListener("click", () => {
  globalVolume.value = Number(globalVolume.value) === 0 ? "0.85" : "0";
  syncGlobalVolume();
});

// No mobile, mostrar/esconder a barra de endereço dispara "resize" durante o
// scroll. Antes isso remontava o carrossel inteiro no meio do gesto; agora só
// reage quando a quantidade de logos realmente muda.
let brandCount = getBrandCount();

window.addEventListener("resize", () => {
  const nextCount = getBrandCount();
  if (nextCount === brandCount) return;
  brandCount = nextCount;
  brandPage = 0;
  renderBrands();
}, { passive: true });

let brandTimer = null;

function advanceBrands() {
  brandRow.classList.remove("is-visible");
  brandRow.classList.add("is-hidden");
  window.setTimeout(() => {
    brandCount = getBrandCount();
    brandPage = (brandPage + 1) % Math.ceil(brands.length / brandCount);
    renderBrands();
    brandRow.classList.remove("is-hidden");
    brandRow.classList.add("is-visible");
  }, 320);
}

function startBrandRotation() {
  if (brandTimer === null) brandTimer = window.setInterval(advanceBrands, 4000);
}

function stopBrandRotation() {
  if (brandTimer === null) return;
  window.clearInterval(brandTimer);
  brandTimer = null;
}

// O vídeo ambiente é decorativo: não faz sentido decodificar 30 quadros por
// segundo quando ele está fora da tela ou a aba está em segundo plano. É esse
// trabalho contínuo que atrapalhava o scroll no mobile.
function setupAmbientVideo() {
  if (!ambientVideo) return;
  ambientVideo.disablePictureInPicture = true;
  ambientVideo.disableRemotePlayback = true;

  // Quem pediu menos movimento no sistema não deve receber um vídeo em loop:
  // o CSS já zera as animações, aqui congelamos o fundo pelo mesmo motivo.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let isVisible = true;

  const sync = () => {
    const shouldPlay = isVisible && !document.hidden && !reduceMotion.matches;
    if (shouldPlay) {
      if (ambientVideo.paused) {
        const started = ambientVideo.play();
        if (started && typeof started.catch === "function") started.catch(() => {});
      }
    } else if (!ambientVideo.paused) {
      ambientVideo.pause();
    }
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[entries.length - 1].isIntersecting;
      sync();
    }, { threshold: 0 });
    observer.observe(ambientVideo.parentElement);
  }

  document.addEventListener("visibilitychange", sync);
  if (typeof reduceMotion.addEventListener === "function") {
    reduceMotion.addEventListener("change", sync);
  }
  sync();
}

setupAmbientVideo();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopBrandRotation();
  else startBrandRotation();
});

renderBrands();
renderAudioCatalog();
renderVideoCatalog();
syncGlobalVolume();
startBrandRotation();
