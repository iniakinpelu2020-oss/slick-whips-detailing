(function(){
  "use strict";

  var CFG = {
    name: "Slick Whips Mobile Detailing",
    town: "Waco, TX",
    areas: "Waco, Woodway, Hewitt, Robinson & China Spring",
    phone: "+12545235773",
    phoneLabel: "+1 254-523-5773",
    mode: "us",
    rating: "5.0",
    reviews: "97",
    hoursNote: "Tue–Sat, 8am–6pm"
  };

  var IMG = "https://images.unsplash.com/photo-";
  var QS  = "?auto=format&fit=crop&w=1000&q=75";
  var QST = "?auto=format&fit=crop&w=420&q=70";

  var SERVICES = [
    { id:"full", cat:"Exterior", name:"Executive Full Inside & Out", price:189, time:"4 hrs on site",
      img:"1605164598708-25701594473e",
      desc:"The whole car, front to back. Hand wash and dry, wheels and arches, door jambs, vacuum, steam, glass and trim dressed. The one most people book.",
      tag:"Most booked" },
    { id:"interior", cat:"Interior", name:"Deep Interior Steam & Stain Extraction", price:139, time:"3 hrs on site",
      img:"1787510026653-832390809296",
      desc:"Shampoo, hot-water extraction and steam through seats, carpets and headliner. Built for spilled coffee, kid seats and years of daily driving.",
      tag:"Interior" },
    { id:"foam", cat:"Exterior", name:"Foam Bath, Clay Bar & Sealant Gloss", price:95, time:"2 hrs on site",
      img:"1694678505383-676d78ea3b96",
      desc:"Two-bucket foam wash, iron removal and clay bar so the paint feels glassy again, then a sealant layer to keep Texas sun off the clear coat.",
      tag:"Paint-safe" },
    { id:"paint", cat:"Protection", name:"1-Step Paint Enhancement & Ceramic Shield", price:349, time:"6 hrs on site",
      img:"1780558852670-3f49298ecc1f",
      desc:"Machine polish to knock back swirls and light scratches, then a ceramic layer for gloss and water beading that lasts through the season.",
      tag:"Gloss" },
    { id:"pet", cat:"Interior", name:"Pet Hair & Odor Ozone Reset", price:55, time:"90 mins on site",
      img:"1624884269715-70759892cd29",
      desc:"Rubber-brush lift for embedded hair, enzyme treatment on the fibres, then an ozone cycle to clear the smell out of the vents and carpet.",
      tag:"Reset" },
    { id:"engine", cat:"Protection", name:"Engine Bay & Headlight Clarity", price:65, time:"75 mins on site",
      img:"1567808291548-fc3ee04dbcf0",
      desc:"Safe degrease and dress of the engine bay, plus sanding and polishing cloudy headlight lenses so you can actually see at night.",
      tag:"Details" }
  ];

  var SIZE  = [{k:"Sedan / coupe", d:0}, {k:"Midsize SUV", d:25}, {k:"Truck / 3-row", d:45}];
  var COND  = [{k:"Lightly used", d:0}, {k:"Needs a deep clean", d:25}, {k:"Heavy / pet or stain issue", d:45}];
  var SCHED = [{k:"Standard slot", d:0}, {k:"Early morning", d:15}, {k:"Rush same-day", d:35}];

  var activeCat = "All";
  var visible = SERVICES.slice();
  var index = 0;
  var current = null;
  var sel = { size:0, cond:0, sched:0 };
  var cart = [];

  var $ = function(id){ return document.getElementById(id); };
  var money = function(n){ return "$" + n.toLocaleString("en-US"); };

  var stage = $("stage"), cats = $("cats"), dots = $("dots");

  function renderCats(){
    var list = ["All"].concat(SERVICES.map(function(s){ return s.cat; }).filter(function(v,i,a){ return a.indexOf(v) === i; }));
    cats.innerHTML = list.map(function(c){
      return '<button class="pill" type="button" data-cat="' + c + '" aria-pressed="' + (c === activeCat) + '">' + c + "</button>";
    }).join("");
  }

  function filterServices(cat){
    activeCat = cat;
    visible = cat === "All" ? SERVICES.slice() : SERVICES.filter(function(s){ return s.cat === cat; });
    index = Math.min(2, Math.max(0, visible.length - 1));
    renderCats();
    renderGallery();
  }

  function renderGallery(){
    stage.innerHTML = visible.map(function(s, i){
      return '' +
      '<article class="gcard" data-i="' + i + '" tabindex="0" role="button" aria-label="' + s.name + ', from ' + money(s.price) + '">' +
        '<img src="' + IMG + s.img + QS + '" alt="' + s.name + '" loading="' + (i ? "lazy" : "eager") + '" onerror="this.style.display=\'none\';this.parentNode.classList.add(\'noimg\')">' +
        '<div class="veil"></div>' +
        '<div class="body">' +
          '<div class="kicker">' + s.tag + "</div>" +
          "<h3>" + s.name + "</h3>" +
          '<div class="price">From ' + money(s.price) + " <small>· " + s.time + "</small></div>" +
        "</div>" +
      "</article>";
    }).join("");

    dots.innerHTML = visible.map(function(s, i){
      return '<button class="dot" type="button" data-i="' + i + '" aria-label="Go to ' + s.name + '"></button>';
    }).join("");

    layout(0);
    $("hint").textContent = visible.length > 1 ? "Swipe or drag to turn the wall" : "Tap the card to open the configurator";
  }

  var lastArc = 150;
  function layout(dragPx){
    var nodes = stage.querySelectorAll(".gcard");
    var arc = Math.min(188, Math.max(104, 880 / Math.max(3, nodes.length)));
    lastArc = arc;
    for (var i = 0; i < nodes.length; i++){
      var off = i - index;
      if (dragPx) off -= dragPx / 230;
      var abs = Math.abs(off);
      var x = off * arc;
      var z = -abs * 118;
      var ry = off * -19;
      var sc = 1 - Math.min(abs, 4) * 0.055;
      var op = abs > 3.2 ? 0 : Math.max(.42, 1 - Math.min(abs, 3) * 0.2);
      var n = nodes[i];
      n.style.transform = "translateX(" + x.toFixed(1) + "px) translateZ(" + z.toFixed(1) + "px) rotateY(" + ry.toFixed(1) + "deg) scale(" + sc.toFixed(3) + ")";
      n.style.opacity = op.toFixed(2);
      n.style.zIndex = String(100 - Math.round(abs * 10));
      n.classList.toggle("is-centre", abs < 0.5);
      n.setAttribute("aria-hidden", abs > 3 ? "true" : "false");
    }
    var ds = dots.querySelectorAll(".dot");
    for (var d = 0; d < ds.length; d++) ds[d].classList.toggle("on", d === index);
  }

  function go(i){
    if (!visible.length) return;
    index = Math.max(0, Math.min(visible.length - 1, i));
    layout(0);
  }

  var dragging = false, startX = 0, moved = 0, lastDx = 0, downCard = null;
  stage.addEventListener("pointerdown", function(e){
    dragging = true; startX = e.clientX; moved = 0; lastDx = 0;
    downCard = e.target.closest(".gcard");
    stage.classList.add("dragging");
    if (stage.setPointerCapture) { try { stage.setPointerCapture(e.pointerId); } catch (err) {} }
  });
  stage.addEventListener("pointermove", function(e){
    if (!dragging) return;
    var dx = e.clientX - startX;
    moved = Math.abs(dx); lastDx = dx;
    layout(dx);
  });
  function settle(){
    dragging = false;
    stage.classList.remove("dragging");
    layout(0);
    lastDx = 0;
    downCard = null;
  }
  stage.addEventListener("pointerup", function(){
    var card = downCard, tapped = moved <= 12, dx = lastDx;
    if (!tapped){
      var steps = Math.round(-dx / (lastArc || 150));
      if (steps) go(index + steps);
    }
    settle();
    if (!tapped || !card) return;
    var i = parseInt(card.getAttribute("data-i"), 10);
    if (isNaN(i) || !visible[i]) return;
    if (i === index) openDetail(visible[i]); else go(i);
  });
  stage.addEventListener("pointercancel", settle);
  stage.addEventListener("pointerleave", function(){ if (dragging) settle(); });

  stage.addEventListener("keydown", function(e){
    if (e.key === "Enter" || e.key === " "){
      var card = e.target.closest(".gcard");
      if (!card) return;
      e.preventDefault();
      var i = parseInt(card.getAttribute("data-i"), 10);
      if (i === index) openDetail(visible[i]); else go(i);
    }
  });

  cats.addEventListener("click", function(e){
    var b = e.target.closest("button[data-cat]");
    if (b) filterServices(b.getAttribute("data-cat"));
  });
  dots.addEventListener("click", function(e){
    var b = e.target.closest(".dot");
    if (b) go(parseInt(b.getAttribute("data-i"), 10));
  });
  $("prev").addEventListener("click", function(){ go(index - 1); });
  $("next").addEventListener("click", function(){ go(index + 1); });
  window.addEventListener("keydown", function(e){
    if (e.key === "ArrowLeft") go(index - 1);
    if (e.key === "ArrowRight") go(index + 1);
  });

  var detail = $("detail"), gallerySection = $("gallery");

  function price(){
    if (!current) return 0;
    return current.price + SIZE[sel.size].d + COND[sel.cond].d + SCHED[sel.sched].d;
  }

  function optRow(el, list, key){
    el.innerHTML = list.map(function(o, i){
      return '<button class="opt' + (sel[key] === i ? " on" : "") + '" type="button" data-k="' + key + '" data-i="' + i + '">' +
        o.k + (o.d ? "<small>+" + money(o.d) + "</small>" : "<small>included</small>") + "</button>";
    }).join("");
  }

  function paintOptions(){
    optRow($("optSize"), SIZE, "size");
    optRow($("optCond"), COND, "cond");
    optRow($("optSched"), SCHED, "sched");
    $("livePrice").innerHTML = money(price()) + "<small>your estimate</small>";
  }

  function openDetail(s){
    current = s;
    sel = { size:0, cond:0, sched:0 };
    $("cfgName").textContent = s.name;
    $("cfgCat").textContent = s.cat;
    $("cfgTime").textContent = "≈ " + s.time;
    $("cfgTown").textContent = CFG.town;
    $("cfgDesc").textContent = s.desc;
    var im = $("cfgImg");
    im.onerror = function(){ im.style.visibility = "hidden"; };
    im.style.visibility = "visible";
    im.src = IMG + s.img + QS;
    im.alt = s.name;
    paintOptions();

    $("moreGrid").innerHTML = SERVICES.filter(function(x){ return x.id !== s.id; }).slice(0, 3).map(function(x){
      return '<button class="mcard" type="button" data-id="' + x.id + '">' +
        '<img src="' + IMG + x.img + QST + '" alt="' + x.name + '" loading="lazy" onerror="this.style.visibility=\'hidden\'">' +
        "<span><b>" + x.name + "</b><span>From " + money(x.price) + "</span></span>" +
      "</button>";
    }).join("");

    gallerySection.style.display = "none";
    document.body.classList.add("detail-view");
    detail.classList.add("on");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeDetail(){
    detail.classList.remove("on");
    document.body.classList.remove("detail-view");
    gallerySection.style.display = "";
    current = null;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  $("backBtn").addEventListener("click", closeDetail);

  detail.addEventListener("click", function(e){
    var o = e.target.closest(".opt");
    if (o){ sel[o.getAttribute("data-k")] = parseInt(o.getAttribute("data-i"), 10); paintOptions(); return; }
    var m = e.target.closest(".mcard");
    if (m){
      var s = SERVICES.filter(function(x){ return x.id === m.getAttribute("data-id"); })[0];
      if (s) openDetail(s);
    }
  });

  var drawer = $("drawer"), scrim = $("scrim"), body = $("drawerBody");

  function cartTotal(){ return cart.reduce(function(a, b){ return a + b.price; }, 0); }

  function paintCart(){
    var count = cart.length;
    ["cartCount", "cartCount2"].forEach(function(id){
      var el = $(id);
      if (!el) return;
      el.textContent = count;
      el.classList.toggle("on", count > 0);
    });
    $("total").textContent = money(cartTotal());

    if (!count){
      body.innerHTML = '<div class="empty">Nothing here yet.<br>Pick a service, choose your options, then tap <strong style="color:#fff">Add to estimate</strong>.</div>';
    } else {
      body.innerHTML = cart.map(function(it, i){
        return '<div class="line">' +
          "<div><b>" + it.name + "</b><span>" + it.detail + "</span><button class=\"rm\" type=\"button\" data-rm=\"" + i + "\">remove</button></div>" +
          '<div class="amt">' + money(it.price) + "</div>" +
        "</div>";
      }).join("");
    }

    var msg = "Hi " + CFG.name + " — I built an estimate on your site:%0A" +
      cart.map(function(it){ return "• " + it.name + " (" + it.detail + ") — " + money(it.price); }).join("%0A") +
      "%0A%0ATotal: " + money(cartTotal()) + "%0A%0ACan we book a slot?";
    if (CFG.mode === "ng"){
      $("textBtn").href = "https://wa.me/" + CFG.phone.replace(/\D/g, "") + "?text=" + msg;
      $("textBtn").textContent = "Send on WhatsApp";
    } else {
      $("textBtn").href = "sms:" + CFG.phone + "?&body=" + msg;
      $("textBtn").textContent = "Text this estimate";
    }
  }

  function openDrawer(){
    paintCart();
    drawer.classList.add("on");
    scrim.classList.add("on");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer(){
    drawer.classList.remove("on");
    scrim.classList.remove("on");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  ["openEstimate", "openEstimate2"].forEach(function(id){
    var b = $(id);
    if (b) b.addEventListener("click", openDrawer);
  });
  $("closeDrawer").addEventListener("click", closeDrawer);
  scrim.addEventListener("click", closeDrawer);
  window.addEventListener("keydown", function(e){ if (e.key === "Escape") closeDrawer(); });

  body.addEventListener("click", function(e){
    var r = e.target.closest("[data-rm]");
    if (r){ cart.splice(parseInt(r.getAttribute("data-rm"), 10), 1); paintCart(); }
  });

  var toastTimer = null;
  function toast(msg){
    var t = $("toast");
    t.textContent = msg || "Added to your estimate";
    t.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ t.classList.remove("on"); }, 1900);
  }

  $("addBtn").addEventListener("click", function(){
    if (!current) return;
    var bits = [SIZE[sel.size].k, COND[sel.cond].k];
    if (SCHED[sel.sched].d) bits.push(SCHED[sel.sched].k);
    cart.push({ name: current.name, detail: bits.join(" · "), price: price() });
    paintCart();
    toast("Added — " + money(price()));
    openDrawer();
  });

  $("strip").innerHTML = (function(){
    var one = "<span>We come to you <b>✦</b></span><span>Spot-free water <b>✦</b></span><span>Own power on board <b>✦</b></span><span>97 five-star reviews <b>✦</b></span><span>Waco · Woodway · Hewitt · Robinson · China Spring <b>✦</b></span>";
    return one + one;
  })();

  try {
    var parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", weekday: "short" }).formatToParts(new Date());
    var day = "";
    parts.forEach(function(p){ if (p.type === "weekday") day = p.value; });
    var row = document.querySelector('#hoursList li[data-day="' + day + '"]');
    if (row) row.classList.add("today");
  } catch (e) {}

  $("yr").textContent = new Date().getFullYear();

  renderCats();
  index = Math.min(2, Math.max(0, SERVICES.length - 1));
  renderGallery();
  go(index);
  paintCart();
})();
