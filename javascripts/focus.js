document.addEventListener("DOMContentLoaded", function () {
  // --- Focus toggle button (existing feature) ---
  if (!document.querySelector(".focus-toggle-btn")) {
    var btn = document.createElement("label");
    btn.className = "md-icon md-header__button focus-toggle-btn";
    btn.title = "Mode Focus";
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3M14 5v2h3v3h2V5h-5Z"></path></svg>';

    var header = document.querySelector(".md-header__inner");
    if (header) header.appendChild(btn);

    btn.addEventListener("click", function () {
      document.body.classList.toggle("md-focus");
      if (document.body.classList.contains("md-focus")) {
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2m3-8H5v2h5V5H8v3m6 11h2v-3h3v-2h-5v5m2-11V5h-2v5h5V8h-3Z"></path></svg>';
      } else {
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5m12 7h-3v2h5v-5h-2v3M14 5v2h3v3h2V5h-5Z"></path></svg>';
      }
    });
  }

  // --- Image lightbox (V357) ---
  var overlay = document.querySelector(".odt-lightbox-overlay");
  var overlayImg = null;
  var closeBtn = null;

  function ensureLightbox() {
    if (overlay) return;

    overlay = document.createElement("div");
    overlay.className = "odt-lightbox-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Agrandissement d'image");

    var content = document.createElement("div");
    content.className = "odt-lightbox-content";

    closeBtn = document.createElement("button");
    closeBtn.className = "odt-lightbox-close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Fermer");
    closeBtn.textContent = "×";

    overlayImg = document.createElement("img");
    overlayImg.alt = "";

    content.appendChild(closeBtn);
    content.appendChild(overlayImg);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // Close interactions
    closeBtn.addEventListener("click", closeLightbox);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeLightbox();
    });

    content.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay && overlay.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

  function openLightbox(src, altText) {
    ensureLightbox();
    if (!overlayImg) return;

    overlayImg.src = src;
    overlayImg.alt = altText || "";
    overlay.classList.add("is-open");
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    if (overlayImg) {
      overlayImg.src = "";
      overlayImg.alt = "";
    }
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t) return;
    if (t.tagName && t.tagName.toLowerCase() === "img" && t.classList.contains("odt-zoomable")) {
      var src = t.getAttribute("data-zoom-src") || t.getAttribute("src");
      if (!src) return;
      e.preventDefault();
      openLightbox(src, t.getAttribute("alt") || "Image");
    }
  });
});