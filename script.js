// 🎵 Reference to hidden audio player
const audioPlayer = document.getElementById("audioPlayer");

// 🎵 Albums songs
const songs = [
  { title: "ANIMAL", artist: "Manan Bharadwaj", src: "songs/hawayien.mp3", cover: "covers/hawayien.jpg" },
  { title: "Still Rollin", artist: "Shubh", src: "songs/Bulleya Sultan 128 Kbps.mp3", cover: "covers/jagg.jpg" },
  { title: "Husn", artist: "Anuv Jain", src: "songs/Naamumkin - Maalik 2025 128KBPS.mp3", cover: "covers/khwab.jpg" },
  { title: "Moosetape", artist: "Sidhu Moose Wala", src: "songs/Sapphire - (Raag.Fm).mp3", cover: "covers/moosetape.jpg" },
  { title: "Satranga", artist: "Arijit Singh", src: "songs/Bulleya Sultan 128 Kbps.mp3", cover: "covers/satranga.jpg" }
];

// 🎵 Artist songs
const artistSongs = [
  { title: "Kesariya", artist: "Pritam Singh", src: "songs/Agar Tum Sath Ho(KoshalWorld.Com).mp3", cover: "covers/song1.jpg" },
  {title:  "Tum Hi Ho", artist: "A.R Rehman", src: "songs/Bulleya Sultan 128 Kbps.mp3", cover: "covers/song1.jpg" },
  {title:  "Agar Tum Saath Ho", artist: "Arijit Singh", src: "songs/hawayien.mp3", cover: "covers/song1.jpg" },
  { title: "Dil Diyan Gallan", artist: "Atif Aslam", src: "songs/Naamumkin - Maalik 2025 128KBPS.mp3", cover: "covers/song2.jpg" },
  { title: "BUlleya", artist: "Sachin-Jigar", src: "songs/Sapphire - (Raag.Fm).mp3", cover: "covers/song3.jpg" },
  { title: "Kesariyaa", artist: "Shreya Ghosal", src: "songs/Agar Tum Sath Ho(KoshalWorld.Com).mp3", cover: "covers/song4.jpg" },
  { title: "Lut Gaye", artist: "Jubin Nautiyal", src: "songs/Bulleya Sultan 128 Kbps.mp3", cover: "covers/song5.jpg" }

];

// 🎵 Select all card play buttons
const albumBtns = document.querySelectorAll(".spotify-playlist .card .item .play-btn i");
const artistBtns = document.querySelectorAll(".spotify-artist .card .item .play-btn i");

// 🎵 Now Playing bar elements
const nowPlayingBar = document.querySelector(".now-playing");
const nowTitle = document.getElementById("now-title");
const nowArtist = document.getElementById("now-artist");
const playPauseBtn = document.getElementById("play-pause");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");

// Spotlight
const spotlight = document.getElementById("spotlight");
const spotlightCover = document.getElementById("spotlight-cover");
const spotlightTitle = document.getElementById("spotlight-title");
const spotlightArtist = document.getElementById("spotlight-artist");
const closeSpotlight = document.getElementById("close-spotlight");

// 🎵 Player state
let currentSongIndex = null;
let currentType = null; // "album" or "artist"
let isPlaying = false;

// 🎵 Functions to play/pause songs
function playSong(index, type) {
  const song = type === "album" ? songs[index] : artistSongs[index];
  audioPlayer.src = song.src;

  audioPlayer.play().then(() => {
    isPlaying = true;
    currentSongIndex = index;
    currentType = type;

    nowTitle.textContent = song.title;
    nowArtist.textContent = song.artist;

    updateCardIcons();
    playPauseBtn.innerHTML = `<i class="fas fa-pause"></i>`;
    nowPlayingBar.classList.add("active");

    showSpotlight(song);
  }).catch(err => console.error(err));
}

function pauseSong() {
  audioPlayer.pause();
  isPlaying = false;
  updateCardIcons();
  playPauseBtn.innerHTML = `<i class="fas fa-play"></i>`;
  nowPlayingBar.classList.remove("active");
}

function updateCardIcons() {
  albumBtns.forEach(btn => btn.classList.replace("fa-pause", "fa-play"));
  artistBtns.forEach(btn => btn.classList.replace("fa-pause", "fa-play"));

  if (isPlaying && currentSongIndex !== null) {
    if (currentType === "album") albumBtns[currentSongIndex].classList.replace("fa-play", "fa-pause");
    else if (currentType === "artist") artistBtns[currentSongIndex].classList.replace("fa-play", "fa-pause");
  }
}

// 🎵 Album buttons click
albumBtns.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    if (currentType === "album" && currentSongIndex === i && isPlaying) pauseSong();
    else playSong(i, "album");
  });
});

// 🎵 Artist buttons click
artistBtns.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    if (currentType === "artist" && currentSongIndex === i && isPlaying) pauseSong();
    else playSong(i, "artist");
  });
});

// 🎵 Now Playing bar play/pause
playPauseBtn.addEventListener("click", () => {
  if (isPlaying) pauseSong();
  else if (currentSongIndex !== null) playSong(currentSongIndex, currentType);
});

// 🎵 Next/Prev Buttons
nextBtn.addEventListener("click", () => {
  if (currentType === "album" && currentSongIndex < songs.length - 1) playSong(currentSongIndex + 1, "album");
  else if (currentType === "artist" && currentSongIndex < artistSongs.length - 1) playSong(currentSongIndex + 1, "artist");
});

prevBtn.addEventListener("click", () => {
  if (currentType === "album" && currentSongIndex > 0) playSong(currentSongIndex - 1, "album");
  else if (currentType === "artist" && currentSongIndex > 0) playSong(currentSongIndex - 1, "artist");
});

// 🎵 Progress & seek
audioPlayer.addEventListener("timeupdate", () => {
  if (!audioPlayer.duration) return;
  progress.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  durationEl.textContent = formatTime(audioPlayer.duration);
});

progress.addEventListener("input", () => {
  audioPlayer.currentTime = (progress.value / 100) * audioPlayer.duration;
});

// 🎵 Volume
volumeSlider.addEventListener("input", () => audioPlayer.volume = volumeSlider.value);

// 🎵 Format time
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// 🎵 Auto-play next or stop
audioPlayer.addEventListener("ended", () => {
  if (currentType === "album" && currentSongIndex < songs.length - 1) playSong(currentSongIndex + 1, "album");
  else if (currentType === "artist" && currentSongIndex < artistSongs.length - 1) playSong(currentSongIndex + 1, "artist");
  else {
    isPlaying = false;
    currentSongIndex = null;
    currentType = null;
    updateCardIcons();
    nowPlayingBar.classList.remove("active");
  }
});

// 🎵 Spotlight
function showSpotlight(song) {
  if (!song.cover) return;
  spotlightCover.src = song.cover;
  spotlightTitle.textContent = song.title;
  spotlightArtist.textContent = song.artist;
  spotlight.classList.add("active");
  document.body.classList.add("playing");
}

// 🎵 Close Spotlight
closeSpotlight.addEventListener("click", () => {
  spotlight.classList.remove("active");
});
