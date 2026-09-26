const target = new Date("2026-09-28T00:00:00");
const countdown = document.getElementById("countdown");

function tick() {
  const now = new Date();
  let diff = target - now;
  if (diff <= 0) {
    countdown.textContent = "IT'S YOUR DAY ♡";
    return;
  }
  const days = Math.floor(diff / 86400000);
  diff %= 86400000;
  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;
  const mins = Math.floor(diff / 60000);
  diff %= 60000;
  const secs = Math.floor(diff / 1000);
  countdown.textContent = [days, hours, mins, secs]
    .map((n) => String(n).padStart(2, "0"))
    .join(" : ");
}
tick();
setInterval(tick, 1000);

function scrollToId(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

const birthdayMusic = document.getElementById("birthdayMusic");
const musicToggle = document.getElementById("musicToggle");

function updateMusicControl(isPlaying) {
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.innerHTML = isPlaying
    ? '<span aria-hidden="true">Ⅱ</span> Pause music'
    : '<span aria-hidden="true">♫</span> Play music';
}

async function startBirthdayMusic() {
  try {
    await birthdayMusic.play();
    updateMusicControl(true);
  } catch {
    updateMusicControl(false);
  }
}

musicToggle.addEventListener("click", () => {
  if (birthdayMusic.paused) {
    startBirthdayMusic();
  } else {
    birthdayMusic.pause();
    updateMusicControl(false);
  }
});

birthdayMusic.addEventListener("pause", () => updateMusicControl(false));
birthdayMusic.addEventListener("play", () => updateMusicControl(true));
birthdayMusic.addEventListener("error", () => {
  musicToggle.disabled = true;
  musicToggle.textContent = "Add birthday-song.mp3";
  musicToggle.setAttribute(
    "aria-label",
    "Add birthday-song.mp3 to the assets folder to enable music",
  );
});
birthdayMusic.addEventListener("canplay", () => {
  musicToggle.disabled = false;
  musicToggle.removeAttribute("aria-label");
  updateMusicControl(!birthdayMusic.paused);
});
startBirthdayMusic();

function cutCake() {
  const scene = document.getElementById("cakeScene");
  const button = document.getElementById("cutCakeButton");
  scene.classList.add("cake-cut");
  scene.setAttribute(
    "aria-label",
    "The birthday cake has been cut; a slice is ready",
  );
  button.disabled = true;
  button.innerHTML = "Wish made <span>♡</span>";
  document.getElementById("cakeMessage").textContent =
    "May this year bring you everything beautiful. Happy 20th!";
  burstConfetti();
  burstHearts();
}

const photoMotionButton = document.getElementById("photoMotionButton");
photoMotionButton.addEventListener("click", () => {
  const paused = document.body.classList.toggle("photo-motion-paused");
  photoMotionButton.setAttribute("aria-pressed", String(paused));
  photoMotionButton.innerHTML = paused
    ? '<span aria-hidden="true">▶</span> Resume photo motion'
    : '<span aria-hidden="true">Ⅱ</span> Pause photo motion';
});

const revealItems = document.querySelectorAll(
  ".section-tag, .hero h1, .hero-sub, .countdown-card, .birthday-cake h2, .cake-intro, .story h2, .letter p, .memories h2, .section-intro, .gallery figure, .ours-label, .film h2, .video-frame p, .prayer-card > *, .secret h2, .lock-card, .finale-inner > *",
);
const galleryRevealStyles = [
  "photo-reveal-circle",
  "photo-reveal-horizontal",
  "photo-reveal-vertical",
  "photo-reveal-corners",
];

document.querySelectorAll(".gallery figure").forEach((figure, index) => {
  figure.classList.add(galleryRevealStyles[index % galleryRevealStyles.length]);
  figure.style.setProperty("--photo-delay", `${(index % 4) * 110}ms`);
});

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  revealItems.forEach((item, index) => {
    item.classList.add("reveal-item");
    if (item.closest(".letter")) {
      item.style.setProperty(
        "--reveal-delay",
        `${Math.min(index % 4, 3) * 70}ms`,
      );
    }
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

let wrongNameAttempts = 0;

function unlock() {
  const input = document.getElementById("secretInput");
  const message = document.getElementById("lockMessage");
  if (input.value.trim().toLowerCase() === "aramide") {
    document.getElementById("lock").classList.add("hidden");
    document.getElementById("unlocked").classList.remove("hidden");
    burstHearts();
  } else {
    wrongNameAttempts += 1;
    const otherReplies = [
      "Hmm… that's not the one. 😂",
      "So close... try that again, baby. 😉",
      "I know you know this one. Think, Angel! ♡",
      "That name is hiding somewhere in your heart. 💕",
    ];
    message.textContent =
      wrongNameAttempts === 3
        ? "Please don't tell me you've forgotten 😭"
        : otherReplies[(wrongNameAttempts - 1) % otherReplies.length];
    input.animate(
      [
        { transform: "translateX(-5px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 250 },
    );
  }
}
document.getElementById("secretInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") unlock();
});

function burstHearts() {
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const h = document.createElement("span");
      h.className = "float-heart";
      h.textContent = ["♡", "♥", "✦"][Math.floor(Math.random() * 3)];
      h.style.left = Math.random() * 100 + "%";
      h.style.animationDuration = 3 + Math.random() * 3 + "s";
      document.getElementById("hearts").appendChild(h);
      setTimeout(() => h.remove(), 6500);
    }, i * 90);
  }
}

function burstConfetti() {
  const colors = ["#d98291", "#e9bd68", "#7e9d83", "#f2d5a0", "#a84e62"];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.setProperty("--drift", Math.random() * 240 - 120 + "px");
    piece.style.setProperty("--confetti-color", colors[i % colors.length]);
    piece.style.animationDuration = 2.8 + Math.random() * 2.2 + "s";
    piece.style.animationDelay = Math.random() * 0.7 + "s";
    document.getElementById("hearts").appendChild(piece);
    setTimeout(() => piece.remove(), 6000);
  }
}

setInterval(() => {
  if (Math.random() < 0.35) {
    const h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = "♡";
    h.style.left = Math.random() * 100 + "%";
    h.style.animationDuration = 7 + Math.random() * 5 + "s";
    document.getElementById("hearts").appendChild(h);
    setTimeout(() => h.remove(), 13000);
  }
}, 1000);
