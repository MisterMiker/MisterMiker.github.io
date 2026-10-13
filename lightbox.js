/* Click any gallery image to see it large.
   Close: click outside, press Esc, or click the X.
   Navigate: arrow buttons on screen, or the left/right arrow keys. */

(function () {
  // ---- Styles (you can tweak colors here) ----
  var css = `
    .gallery img { cursor: zoom-in; }

    .lb-overlay {
      position: fixed;
      inset: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.97);   /* change to rgba(0,0,0,0.92) for a dark background */
      display: none;
      align-items: center;
      justify-content: center;
    }
    .lb-overlay.open { display: flex; }

    .lb-overlay img {
      max-width: 92vw;
      max-height: 90vh;
      object-fit: contain;
    }

    .lb-btn {
      position: absolute;
      background: none;
      border: none;
      font-size: 36px;
      font-weight: 200;
      color: #222;
      cursor: pointer;
      opacity: 0.5;
      padding: 16px;
      line-height: 1;
    }
    .lb-btn:hover { opacity: 1; }
    .lb-close { top: 8px; right: 16px; }
    .lb-prev  { left: 8px;  top: 50%; transform: translateY(-50%); }
    .lb-next  { right: 8px; top: 50%; transform: translateY(-50%); }
  `;
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ---- Build the overlay ----
  var overlay = document.createElement("div");
  overlay.className = "lb-overlay";
  overlay.innerHTML =
    '<button class="lb-btn lb-close" aria-label="Close">&times;</button>' +
    '<button class="lb-btn lb-prev" aria-label="Previous">&#8249;</button>' +
    '<img alt="">' +
    '<button class="lb-btn lb-next" aria-label="Next">&#8250;</button>';
  document.body.appendChild(overlay);

  var bigImg = overlay.querySelector("img");
  var images = [];     // images in the gallery that was clicked
  var index = 0;

  function show(i) {
    index = (i + images.length) % images.length;
    bigImg.src = images[index].src;
    bigImg.alt = images[index].alt;
  }

  function open(gallery, clicked) {
    images = Array.prototype.slice.call(gallery.querySelectorAll("img"));
    show(images.indexOf(clicked));
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";   // stop page scrolling behind
  }

  function close() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  // ---- Wire up every gallery image ----
  document.querySelectorAll(".gallery img").forEach(function (img) {
    img.addEventListener("click", function () {
      open(img.closest(".gallery"), img);
    });
  });

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) close();            // click on empty space
  });
  overlay.querySelector(".lb-close").onclick = close;
  overlay.querySelector(".lb-prev").onclick = function () { show(index - 1); };
  overlay.querySelector(".lb-next").onclick = function () { show(index + 1); };

  document.addEventListener("keydown", function (e) {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
})();
