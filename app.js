/* Slick Whips Mobile Detailing — template engine (per-lead config at top) */
const CFG = {
  name: "Slick Whips Mobile Detailing",
  town: "Waco, TX",
  phone: "+12545235773",
  phoneText: "+1 254-523-5773",
  mode: "us",             // "us" -> sms:, "ng" -> wa.me
  rating: "5.0",
  reviews: 97,
  area: "Waco · Woodway · Hewitt"
};

const SERVICES = [
  {
    name: "Executive Full Inside & Out",
    cat: "Exterior",
    price: 189,
    time: "≈ 4 hrs on site",
    desc: "The whole car, front to back. Hand wash and dry, wheels and arches, door jambs, vacuum, steam, glass and trim dressed. The one most people book.",
    img: "1605164598708-25701594473e"
  },
  {
    name: "Deep Interior Steam & Stain Extraction",
    cat: "Interior",
    price: 139,
    time: "≈ 3 hrs on site",
    desc: "Shampoo, hot-water extraction and steam through seats, carpets and headliner. Built for spilled coffee, kid seats and years of daily driving.",
    img: "1787510026653-832390809296"
  },
  {
    name: "Foam Bath, Clay Bar & Sealant Gloss",
    cat: "Exterior",
    price: 95,
    time: "≈ 2 hrs on site",
    desc: "Two-bucket foam wash, iron removal and clay bar so the paint feels glassy again, then a sealant layer to keep Texas sun off the clear coat.",
    img: "1694678505383-676d78ea3b96"
  },
  {
    name: "1-Step Paint Enhancement & Ceramic Shield",
    cat: "Protection",
    price: 349,
    time: "≈ 6 hrs on site",
    desc: "Machine polish to knock back swirls and light scratches, then a ceramic layer for gloss and water beading that lasts through the season.",
    img: "1780558852670-3f49298ecc1f"
  },
  {
    name: "Pet Hair & Odor Ozone Reset",
    cat: "Interior",
    price: 55,
    time: "≈ 90 min on site",
    desc: "Rubber-brush lift for embedded hair, enzyme treatment on the fibres, then an ozone cycle to clear the smell out of the vents and carpet.",
    img: "1624884269715-70759892cd29"
  },
  {
    name: "Engine Bay & Headlight Clarity",
    cat: "Protection",
    price: 65,
    time: "≈ 75 min on site",
    desc: "Safe degrease and dress of the engine bay, plus sanding and polishing cloudy headlight lenses so you can actually see at night.",
    img: "1567808291548-fc3ee04dbcf0"
  }
];

const SIZE = [
  { label: "Sedan / coupe", note: "included", add: 0 },
  { label: "Midsize SUV", note: "+$25", add: 25 },
  { label: "Truck / 3-row", note: "+$45", add: 45 }
];
const COND = [
  { label: "Lightly used", note: "included", add: 0 },
  { label: "Needs a deep clean", note: "+$25", add: 25 },
  { label: "Heavy / pet or stain", note: "+$45", add: 45 }
];
const SCHED = [
  { label: "Standard slot", note: "this week", add: 0 },
  { label: "Early morning", note: "+$15", add: 15 },
  { label: "Rush same-day", note: "+$35", add: 35 }
];

const $ = (s) => document.querySelector(s);
const money = (n) => (n === 0 ? "Free" : "$" + n);

/* ---------- marquee ---------- */
(function marquee() {
  const bits = [
    "We come to you",
    "Spot-free water on board",
    "Own power, no house hookups",
    "97 five-star reviews",
    "Waco · Woodway · Hewitt"
  ];
  const one = bits.map((b) => "<span>" + b + " <b>✦</b></span>").join("");
  $("#strip").innerHTML = one + one;
})();

/* ---------- price list ---------- */
(function menu() {
  $("#pricelist").innerHTML = SERVICES.map((s) => {
    const price = s.price === 0 ? "Free consult" : "From $" + s.price;
    return (
      '<li><div><span class="nm">' + s.name + '</span><span class="sub">' + s.cat +
      ' · ' + s.time + '</span></div><span class="dotsline"></span><span class="pr">' + price + "</span></li>"
    );
  }).join("");
})();

/* ---------- hours ---------- */
(function hours() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "short", timeZone: "America/Chicago" });
  document.querySelectorAll("#hoursList li").forEach((li) => {
    if (li.dataset.day === today) li.classList.add("today");
  });
  $("#yr").textContent = String(new Date().getFullYear());
})();

/* ---------- gallery ---------- */
const stage = $("#stage"), dotsEl = $("#dots"), catsEl = $("#cats");
const cats = ["All", ...Array.from(new Set(SERVICES.map((s) => s.cat)))];
let filter = "All";
let list = SERVICES.slice();
let idx = 0;
let cards = [];
let dragX = 0;

function stepPx() {
  return window.innerWidth < 760 ? 214 : 272;
}

function buildCats() {
  catsEl.innerHTML = cats
    .map((c) => '<button class="pill" type="button" data-cat="' + c + '">' + c + "</button>")
    .join("");
  catsEl.querySelectorAll(".pill").forEach((p) => {
    p.setAttribute("aria-pressed", String(p.dataset.cat === filter));
    p.addEventListener("click", () => {
      filter = p.dataset.cat;
      list = filter === "All" ? SERVICES.slice() : SERVICES.filter((s) => s.cat === filter);
      idx = 0; dragX = 0;
      buildCards(); buildCats(); render(); buildDots();
    });
  });
}

function buildCards() {
  stage.innerHTML = "";
  cards = list.map((s, i) => {
    const el = document.createElement("article");
    el.className = "gcard";
    el.style.setProperty("--i", i);
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.innerHTML =
      '<img src="https://images.unsplash.com/photo-' + s.img + '?auto=format&fit=crop&w=640&q=72" alt="" loading="lazy" onerror="this.style.display=\'none\';this.parentNode.classList.add(\'noimg\')">' +
      '<div class="cap"><span class="no">' + String(i + 1).padStart(2, "0") + " · " + s.cat + "</span>" +
      "<h3>" + s.name + "</h3><span class=\"from\">" + (s.price === 0 ? "Free consult" : "From $" + s.price) + "</span></div>";
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openService(i); }
    });
    stage.appendChild(el);
    return el;
  });
}

function render() {
  const step = stepPx();
  cards.forEach((el, i) => {
    const off = i - idx;
    const ang = Math.max(-54, Math.min(54, off * 26));
    const tx = off * step + dragX;
    const tz = -Math.abs(off) * 100;
    el.style.transform = "translateX(" + tx + "px) translateZ(" + tz + "px) rotateY(" + (-ang) + "deg)";
    el.style.zIndex = String(100 - Math.abs(off));
    el.style.filter = Math.abs(off) > 2 ? "brightness(.72)" : "none";
    el.classList.toggle("is-centre", off === 0);
  });
}

function buildDots() {
  dotsEl.innerHTML = list.map((_, i) => '<button class="dot" type="button" aria-label="Card ' + (i + 1) + '"></button>').join("");
  dotsEl.querySelectorAll(".dot").forEach((d, i) => {
    d.addEventListener("click", () => { idx = i; dragX = 0; render(); syncDots(); });
    if (i === idx) d.classList.add("on");
  });
}
function syncDots() {
  dotsEl.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("on", i === idx));
}

function go(n) {
  idx = Math.max(0, Math.min(list.length - 1, idx + n));
  dragX = 0;
  render(); syncDots();
}

$("#prev").addEventListener("click", () => go(-1));
$("#next").addEventListener("click", () => go(1));

/* pointer drag + tap */
let down = false, startX = 0, moved = 0, downCard = -1;
stage.addEventListener("pointerdown", (e) => {
  down = true; startX = e.clientX; moved = 0;
  const c = e.target.closest(".gcard");
  downCard = c ? cards.indexOf(c) : -1;
  stage.classList.add("dragging");
});
window.addEventListener("pointermove", (e) => {
  if (!down) return;
  dragX = e.clientX - startX;
  moved = Math.max(moved, Math.abs(dragX));
  render();
});
window.addEventListener("pointerup", () => {
  if (!down) return;
  down = false;
  stage.classList.remove("dragging");
  const step = stepPx();
  if (moved > 12) {
    const shift = Math.round(-dragX / step);
    idx = Math.max(0, Math.min(list.length - 1, idx + shift));
    dragX = 0; render(); syncDots();
  } else {
    dragX = 0; render();
    if (downCard > -1) {
      if (downCard === idx) openService(idx);
      else { idx = downCard; render(); syncDots(); }
    }
  }
  downCard = -1;
});
window.addEventListener("resize", render);

/* ---------- configurator ---------- */
let current = 0;
let opts = { size: 0, cond: 0, sched: 0 };

function optRow(el, data, key) {
  el.innerHTML = data
    .map((o, i) => '<button class="opt" type="button" data-i="' + i + '">' + o.label + "<small>" + o.note + "</small></button>")
    .join("");
  el.querySelectorAll(".opt").forEach((b) => {
    b.classList.toggle("on", Number(b.dataset.i) === opts[key]);
    b.addEventListener("click", () => {
      opts[key] = Number(b.dataset.i);
      el.querySelectorAll(".opt").forEach((x) => x.classList.toggle("on", x === b));
      price();
    });
  });
}

function price() {
  const base = list[current].price;
  const total = base + SIZE[opts.size].add + COND[opts.cond].add + SCHED[opts.sched].add;
  $("#livePrice").textContent = money(total);
  return total;
}

function openService(i) {
  current = i;
  const s = list[i];
  opts = { size: 0, cond: 0, sched: 0 };
  $("#cfgImg").src = "https://images.unsplash.com/photo-" + s.img + "?auto=format&fit=crop&w=900&q=75";
  $("#cfgImg").alt = s.name;
  $("#cfgCat").textContent = s.cat;
  $("#cfgIndex").textContent = "(" + String(i + 1).padStart(2, "0") + ")";
  $("#cfgName").textContent = s.name;
  $("#cfgDesc").textContent = s.desc;
  $("#cfgTime").textContent = s.time;
  $("#cfgTown").textContent = CFG.town;
  optRow($("#optSize"), SIZE, "size");
  optRow($("#optCond"), COND, "cond");
  optRow($("#optSched"), SCHED, "sched");
  price();
  document.body.classList.add("detail-view");
  $("#detail").classList.add("on");
  buildMore(i);
  window.scrollTo({ top: 0, behavior: "auto" });
}

function buildMore(i) {
  const others = list.filter((_, n) => n !== i).slice(0, 3);
  $("#moreGrid").innerHTML = "";
  others.forEach((s) => {
    const b = document.createElement("button");
    b.className = "mcard";
    b.type = "button";
    b.innerHTML =
      '<img src="https://images.unsplash.com/photo-' + s.img + '?auto=format&fit=crop&w=240&q=65" alt="">' +
      "<div><b>" + s.name + "</b><i>" + (s.price === 0 ? "Free consult" : "From $" + s.price) + "</i></div>";
    b.addEventListener("click", () => {
      const n = list.findIndex((x) => x.name === s.name);
      openService(n);
    });
    $("#moreGrid").appendChild(b);
  });
}

$("#backBtn").addEventListener("click", () => {
  document.body.classList.remove("detail-view");
  $("#detail").classList.remove("on");
  window.scrollTo({ top: 0, behavior: "auto" });
});

/* ---------- cart / drawer ---------- */
let cart = [];

function openDrawer() {
  $("#drawer").classList.add("on");
  $("#drawer").setAttribute("aria-hidden", "false");
  $("#scrim").classList.add("on");
}
function closeDrawer() {
  $("#drawer").classList.remove("on");
  $("#drawer").setAttribute("aria-hidden", "true");
  $("#scrim").classList.remove("on");
}

function paintCart() {
  const body = $("#drawerBody");
  if (!cart.length) {
    body.innerHTML = '<p class="empty">Nothing added yet. Pick a service off the wall and build your estimate.</p>';
  } else {
    body.innerHTML = cart
      .map((c, i) =>
        '<div class="line"><div><b>' + c.name + "</b><span>" + c.detail + "</span>" +
        '<button class="rm" type="button" data-i="' + i + '">remove</button></div>' +
        '<div class="amt">' + money(c.price) + "</div></div>"
      )
      .join("");
    body.querySelectorAll(".rm").forEach((b) => {
      b.addEventListener("click", () => {
        cart.splice(Number(b.dataset.i), 1);
        paintCart(); count();
      });
    });
  }
  const total = cart.reduce((a, c) => a + c.price, 0);
  $("#total").textContent = "$" + total;
  const msg =
    "Hi " + CFG.name + ", I'd like to book: " +
    (cart.length ? cart.map((c) => c.name + " (" + c.detail + ")").join("; ") + ". Estimate " + money(total) + "." : "an estimate.");
  $("#textBtn").href = CFG.mode === "ng"
    ? "https://wa.me/" + CFG.phone.replace("+", "") + "?text=" + encodeURIComponent(msg)
    : "sms:" + CFG.phone + "?&body=" + encodeURIComponent(msg);
}

function count() {
  const n = cart.length;
  [$("#cartCount"), $("#cartCount2")].forEach((el) => {
    if (!el) return;
    el.textContent = n;
    el.classList.toggle("on", n > 0);
  });
}

$("#addBtn").addEventListener("click", () => {
  const s = list[current];
  const total = price();
  cart.push({
    name: s.name,
    price: total,
    detail: SIZE[opts.size].label + " · " + COND[opts.cond].label + " · " + SCHED[opts.sched].label
  });
  paintCart(); count();
  const t = $("#toast");
  t.classList.add("on");
  setTimeout(() => t.classList.remove("on"), 1900);
  openDrawer();
});

["#openEstimate", "#openEstimate2", "#openEstimate3"].forEach((sel) => {
  const el = $(sel);
  if (el) el.addEventListener("click", openDrawer);
});
$("#closeDrawer").addEventListener("click", closeDrawer);
$("#scrim").addEventListener("click", closeDrawer);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

/* ---------- start-up curtain ---------- */
(function intro() {
  const el = document.getElementById("intro");
  if (!el) return;
  setTimeout(() => el.remove(), 2600);
})();

/* ---------- boot ---------- */
buildCats();
buildCards();
render();
buildDots();
paintCart();
count();
