// Change this to the studio's WhatsApp number (country code, no + or spaces)
const WHATSAPP_NUMBER = "919876543210";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmt = n => "₹" + (Math.round(n / 10) * 10).toLocaleString("en-IN");

// ---------- Hero contact sheet ----------
if (document.querySelector(".hero")) (() => {
const SHOOTS = {
  wedding: {
    img: "images/hero.jpg", alt: "Couple in wedding attire by a lake, holding a bouquet", meta: "f/1.8 · 1/250 · ISO 200",
    kicker: "Weddings in Chennai and across South India",
    title: "Every ritual, every glance, kept for the next fifty years.",
    sub: "Candid and traditional coverage from the nalangu to the reception, with a cinematic film and a hand-bound album."
  },
  prewedding: {
    img: "images/prewed-shadow.jpg", alt: "Couple holding hands, their shadows on the grass", meta: "f/2.0 · 1/500 · ISO 100",
    kicker: "Pre-wedding shoots",
    title: "Your story before the big day.",
    sub: "Beaches, heritage streets, hills or tea estates. Relaxed, unposed photos and a save-the-date reel."
  },
  postwedding: {
    img: "images/postwed-beach.jpg", alt: "Bride and groom on a beach, her veil blowing in the wind", meta: "f/2.8 · 1/800 · ISO 100",
    kicker: "Post-wedding shoots",
    title: "The slow portraits there was no time for.",
    sub: "Wear the wedding outfit again, with no guests and no rush, at golden hour."
  },
  model: {
    img: "images/model-pink.jpg", alt: "Close portrait of a model against a pink wall", meta: "f/4.0 · 1/160 · ISO 100",
    kicker: "Model and actor portfolios",
    title: "A portfolio that gets you the callback.",
    sub: "Studio lighting, outdoor looks and agency-ready headshots, retouched by hand."
  },
  baby: {
    img: "images/baby-bear.jpg", alt: "Baby in a teddy-bear suit on a white blanket", meta: "f/2.2 · 1/200 · ISO 400",
    kicker: "Baby, newborn and first-birthday shoots",
    title: "They are this small for only a few weeks.",
    sub: "A warm, safe studio full of props. We work around feeds and naps, never the other way round."
  }
};
const ORDER = Object.keys(SHOOTS);
const AUTOPLAY_MS = 6500;

const layers = [...document.querySelectorAll(".hero-layer")];
const frames = [...document.querySelectorAll(".frame")];
const strip = document.querySelector(".strip");
const viewfinder = document.querySelector(".viewfinder");
const shutter = document.querySelector(".shutter");
const textEls = ["heroKicker", "heroTitle", "heroSub"].map(id => document.getElementById(id));
let activeLayer = 0, currentKey = "wedding", timer = null, userTook = false;

// preload hero photos so the crossfade never shows a blank frame
ORDER.forEach(k => { const i = new Image(); i.src = SHOOTS[k].img; });

function restartBar(frame) {
  strip.style.setProperty("--autoplay", "0s");
  frames.forEach(f => f.classList.remove("is-active"));
  void frame.offsetWidth;                       // reset the bar to empty
  frame.classList.add("is-active");
  requestAnimationFrame(() => strip.style.setProperty("--autoplay", userTook || reduceMotion ? "0s" : AUTOPLAY_MS + "ms"));
}

function showShoot(key) {
  if (key === currentKey) return;
  currentKey = key;
  const s = SHOOTS[key];
  const frame = frames.find(f => f.dataset.key === key);
  frames.forEach(f => f.setAttribute("aria-selected", f === frame));
  restartBar(frame);

  const next = layers[1 - activeLayer], prev = layers[activeLayer];
  next.src = s.img; next.alt = s.alt; next.removeAttribute("aria-hidden");
  prev.alt = ""; prev.setAttribute("aria-hidden", "true");
  next.classList.add("is-on"); prev.classList.remove("is-on");
  activeLayer = 1 - activeLayer;
  document.getElementById("heroMeta").textContent = s.meta;

  [s.kicker, s.title, s.sub].forEach((t, i) => {
    const el = textEls[i];
    el.textContent = t;
    if (!reduceMotion) { el.classList.remove("is-swapping"); void el.offsetWidth; el.classList.add("is-swapping"); }
  });

  if (!reduceMotion) {
    viewfinder.classList.add("is-focusing");
    setTimeout(() => viewfinder.classList.remove("is-focusing"), 260);
    shutter.classList.remove("is-firing"); void shutter.offsetWidth; shutter.classList.add("is-firing");
  }
}

function schedule() {
  clearTimeout(timer);
  if (userTook || reduceMotion) return;
  timer = setTimeout(() => {
    showShoot(ORDER[(ORDER.indexOf(currentKey) + 1) % ORDER.length]);
    schedule();
  }, AUTOPLAY_MS);
}

frames.forEach(f => f.addEventListener("click", () => {
  userTook = true; clearTimeout(timer);              // a person chose: stop auto-advancing
  strip.style.setProperty("--autoplay", "0s");
  showShoot(f.dataset.key);
}));
// arrow keys move between frames (tablist pattern)
strip.addEventListener("keydown", e => {
  if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
  const i = frames.indexOf(document.activeElement);
  if (i < 0) return;
  const n = frames[(i + (e.key === "ArrowRight" ? 1 : -1) + frames.length) % frames.length];
  n.focus(); n.click();
});
// pause while the visitor is looking at the strip or the tab is hidden
const pause = () => { clearTimeout(timer); strip.classList.add("is-paused"); };
const resume = () => { strip.classList.remove("is-paused"); restartBar(frames.find(f => f.dataset.key === currentKey)); schedule(); };
strip.addEventListener("mouseenter", pause);
strip.addEventListener("mouseleave", () => !userTook && resume());
document.addEventListener("visibilitychange", () => document.hidden ? pause() : !userTook && resume());

restartBar(frames[0]);
setTimeout(schedule, 1200);   // start after the load sequence finishes
// slow push-in on the first photo
if (!reduceMotion) { layers[0].classList.remove("is-on"); requestAnimationFrame(() => requestAnimationFrame(() => layers[0].classList.add("is-on"))); }   // start after the load sequence finishes
})();

// ---------- Header shrinks after scrolling ----------
if (document.querySelector(".nav")) (() => {
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();

// ---------- Scroll reveals + darkroom "develop" ----------
if (document.querySelector(".reveal")) (() => {
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
}, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));
})();

// ---------- Mobile nav ----------
if (document.querySelector(".nav-toggle")) (() => {
const toggle = document.querySelector(".nav-toggle");
const links = document.getElementById("nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
});
links.addEventListener("click", e => {
  if (e.target.tagName === "A") { links.classList.remove("is-open"); toggle.setAttribute("aria-expanded", false); }
});
})();

// ---------- Portfolio filter (animated) ----------
if (document.querySelector("#lightbox")) (() => {
const figures = [...document.querySelectorAll("#grid figure")];
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => { c.classList.remove("is-on"); c.setAttribute("aria-pressed", false); });
    chip.classList.add("is-on"); chip.setAttribute("aria-pressed", true);
    const f = chip.dataset.filter;
    const show = fig => f === "all" || fig.dataset.cat === f;
    if (reduceMotion) { figures.forEach(fig => fig.hidden = !show(fig)); return; }
    figures.filter(fig => !fig.hidden && !show(fig)).forEach(fig => fig.classList.add("is-leaving"));
    setTimeout(() => {
      figures.forEach(fig => { fig.classList.remove("is-leaving"); fig.hidden = !show(fig); });
      const shown = figures.filter(fig => !fig.hidden);
      shown.forEach(fig => fig.classList.add("is-entering"));
      shown.forEach((fig, i) => setTimeout(() => fig.classList.remove("is-entering"), 40 + i * 45));
    }, 280);
  });
});

// ---------- Lightbox ----------
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
let current = 0, lastFocus = null;
const visible = () => figures.filter(f => !f.hidden);

function openLb(fig) {
  const list = visible();
  current = list.indexOf(fig);
  setLb(list[current]);
  lastFocus = document.activeElement;
  lb.hidden = false;
  lb.querySelector(".lb-close").focus();
}
function setLb(fig) {
  const i = fig.querySelector("img"); lbImg.src = i.src; lbImg.alt = i.alt;
  lbImg.style.animation = "none"; void lbImg.offsetWidth; lbImg.style.animation = "";
}
function step(d) { const list = visible(); current = (current + d + list.length) % list.length; setLb(list[current]); }
function closeLb() { lb.hidden = true; lastFocus && lastFocus.focus(); }

figures.forEach(fig => {
  fig.tabIndex = 0;
  fig.setAttribute("role", "button");
  fig.addEventListener("click", () => openLb(fig));
  fig.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(fig); } });
});
lb.querySelector(".lb-close").addEventListener("click", closeLb);
lb.querySelector(".lb-prev").addEventListener("click", () => step(-1));
lb.querySelector(".lb-next").addEventListener("click", () => step(1));
lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
document.addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});
})();

// ---------- Album flip-book ----------
if (document.querySelector("#albumBook")) (() => {
const albumBook = document.getElementById("albumBook");
const leaves = [...albumBook.querySelectorAll(".leaf")];
const pagePrev = document.getElementById("pagePrev");
const pageNext = document.getElementById("pageNext");
const pageInfo = document.getElementById("pageInfo");
const FLIP_MS = reduceMotion ? 0 : 1100;
let turned = 0;

function settleLeaves() {
  leaves.forEach((l, i) => { l.style.zIndex = i < turned ? i + 1 : leaves.length - i; });
}
function renderBook(movingIdx) {
  leaves.forEach((l, i) => l.classList.toggle("is-flipped", i < turned));
  if (movingIdx != null) leaves[movingIdx].style.zIndex = leaves.length + 1;   // keep the turning page on top
  setTimeout(settleLeaves, FLIP_MS);
  albumBook.classList.toggle("is-closed", turned === 0);
  albumBook.classList.toggle("is-end", turned === leaves.length);
  pagePrev.disabled = turned === 0;
  pageNext.disabled = turned === leaves.length;
  pageInfo.textContent = turned === 0 ? "Cover" : turned === leaves.length ? "Back cover" : `Spread ${turned} of ${leaves.length - 1}`;
}
const turn = d => {
  const next = turned + d;
  if (next < 0 || next > leaves.length) return;
  const moving = d > 0 ? turned : next;
  turned = next; renderBook(moving);
};
pagePrev.addEventListener("click", () => turn(-1));
pageNext.addEventListener("click", () => turn(1));
albumBook.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") { e.preventDefault(); turn(1); }
  if (e.key === "ArrowLeft") { e.preventDefault(); turn(-1); }
});
// click the right half to go forward, the left half to go back; swipe on touch
let downX = null;
albumBook.addEventListener("pointerdown", e => { downX = e.clientX; });
albumBook.addEventListener("pointerup", e => {
  if (downX == null) return;
  const dx = e.clientX - downX; downX = null;
  if (Math.abs(dx) > 40) return turn(dx < 0 ? 1 : -1);
  const r = albumBook.getBoundingClientRect();
  turn(e.clientX > r.left + r.width / 2 ? 1 : -1);
});
document.querySelectorAll(".covers button").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".covers button").forEach(x => x.setAttribute("aria-checked", x === b));
  albumBook.dataset.cover = b.dataset.cover;
  if (turned !== 0 && turned !== leaves.length) { turned = 0; renderBook(); }   // close the album to show the new cover
}));
settleLeaves(); renderBook();
})();

// ---------- Frame studio ----------
if (document.querySelector("#wallArt")) (() => {
const SIZES = { "8x12": [8, 12, 1200], "12x18": [12, 18, 2400], "16x24": [16, 24, 3900], "20x30": [20, 30, 5900], "24x36": [24, 36, 8500] };
const STYLES = {
  teak:   { name: "Teak wood frame", mult: 1.2, mould: 1.4 },
  walnut: { name: "Dark walnut frame", mult: 1.25, mould: 1.4 },
  gold:   { name: "Antique gold frame", mult: 1.5, mould: 2.2 },
  black:  { name: "Matte black frame", mult: 1, mould: 1 },
  white:  { name: "Gallery white frame", mult: 1, mould: 1 },
  canvas: { name: "Canvas wrap, no frame", mult: 0.9, mould: 0 }
};
const frameState = { src: "images/hero.jpg", own: false, style: "teak", size: "12x18", orient: "landscape", mat: true };
const wallArt = document.getElementById("wallArt");
const frameImg = document.getElementById("frameImg");
const matToggle = document.getElementById("matToggle");
const priceEl = document.getElementById("framePrice");

function framePrice() {
  const st = STYLES[frameState.style];
  let p = SIZES[frameState.size][2] * st.mult;
  if (frameState.mat && frameState.style !== "canvas") p *= 1.15;
  return p;
}
function renderFrame() {
  const [w, h] = SIZES[frameState.size];
  const [pw, ph] = frameState.orient === "landscape" ? [h, w] : [w, h];
  const st = STYLES[frameState.style];
  const canvas = frameState.style === "canvas";
  wallArt.dataset.style = frameState.style;
  wallArt.style.setProperty("--pw", pw);
  wallArt.style.setProperty("--ph", ph);
  wallArt.style.setProperty("--mould", st.mould);
  wallArt.style.setProperty("--mat", frameState.mat && !canvas ? 2 : 0);
  matToggle.disabled = canvas;
  document.getElementById("wallNote").textContent = `${pw} × ${ph} in print`;
  const old = priceEl.textContent, now = fmt(framePrice());
  priceEl.textContent = now;
  if (old !== now && !reduceMotion) { priceEl.classList.remove("is-bump"); void priceEl.offsetWidth; priceEl.classList.add("is-bump"); }
}
function pressOne(group, btn) {
  group.querySelectorAll("button").forEach(b => { const on = b === btn; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on); });
}
const pickPhotos = document.getElementById("pickPhotos");
const uploadLabel = pickPhotos.querySelector(".upload");
pickPhotos.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
  pressOne(pickPhotos, b); uploadLabel.classList.remove("is-on");
  frameState.src = b.dataset.src; frameState.own = false; frameImg.src = b.dataset.src;
}));
document.getElementById("ownPhoto").addEventListener("change", e => {
  const f = e.target.files[0];
  if (!f || !f.type.startsWith("image/")) return;
  const url = URL.createObjectURL(f);
  pressOne(pickPhotos, null);
  uploadLabel.classList.add("is-on"); uploadLabel.style.backgroundImage = `url("${url}")`;
  frameState.own = true; frameImg.src = url;
  // match orientation to the uploaded photo
  const probe = new Image();
  probe.onload = () => {
    frameState.orient = probe.naturalWidth >= probe.naturalHeight ? "landscape" : "portrait";
    pressOne(document.querySelector(".seg"), document.querySelector(`.seg [data-orient="${frameState.orient}"]`));
    renderFrame();
  };
  probe.src = url;
});
const bindGroup = (id, key, attr) => {
  const g = document.getElementById(id) || document.querySelector(id);
  g.querySelectorAll("button").forEach(b => b.addEventListener("click", () => { pressOne(g, b); frameState[key] = b.dataset[attr]; renderFrame(); }));
};
bindGroup("frameStyles", "style", "style");
bindGroup("frameSizes", "size", "size");
bindGroup(".seg", "orient", "orient");
matToggle.addEventListener("change", () => { frameState.mat = matToggle.checked; renderFrame(); });
document.getElementById("frameOrder").addEventListener("click", () => {
  const [w, h] = SIZES[frameState.size];
  const [pw, ph] = frameState.orient === "landscape" ? [h, w] : [w, h];
  const lines = [
    "Hi PS Photography, I'd like to order a photo frame.",
    `Size: ${pw} × ${ph} in (${frameState.orient})`,
    `Frame: ${STYLES[frameState.style].name}`,
    frameState.style !== "canvas" && `White mount: ${frameState.mat ? "Yes" : "No"}`,
    `Photo: ${frameState.own ? "my own photo, I'll send it in this chat" : "sample " + frameState.src.split("/").pop()}`,
    `Shown price: ${fmt(framePrice())}`
  ].filter(Boolean);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
});
renderFrame();

})();

// ---------- Booking → WhatsApp ----------
if (document.querySelector("#bookForm")) (() => {
document.getElementById("bookForm").addEventListener("submit", e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  const err = document.getElementById("formError");
  if (!d.name.trim() || !d.phone.trim() || !d.type) {
    err.textContent = "Add your name, phone number and shoot type so we can check availability.";
    return;
  }
  err.textContent = "";
  const lines = [
    "Hi PS Photography, I'd like to book a shoot.",
    `Name: ${d.name}`, `Phone: ${d.phone}`, `Shoot: ${d.type}`,
    d.date && `Date: ${d.date}`, d.venue && `Venue: ${d.venue}`, d.msg && `Notes: ${d.msg}`
  ].filter(Boolean);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
});
// links like contact.html?type=Wedding pre-select the shoot type
const want = new URLSearchParams(location.search).get("type");
const sel = document.querySelector('#bookForm select[name="type"]');
if (want && [...sel.options].some(o => o.value === want || o.text === want)) sel.value = want;
})();

document.querySelectorAll(".js-year").forEach(el => el.textContent = new Date().getFullYear());

