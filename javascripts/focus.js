document.addEventListener("DOMContentLoaded",function(){
  // Focus toggle button (existing behavior)
  if(!document.querySelector(".focus-toggle-btn")){
    var e=document.createElement("label");
    e.className="md-icon md-header__button focus-toggle-btn";
    e.title="Mode Focus";
    e.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5m12 7h-3v2h5v-5h-2v3M14 5v2h3v3h2V5h-5Z"></path></svg>';
    var t=document.querySelector(".md-header__inner");
    if(t) t.appendChild(e);
    e.addEventListener("click",function(){
      document.body.classList.toggle("md-focus");
    });
  }

  // Image lightbox (DOCX): all images with .docx-zoomable are clickable
  if(document.querySelector(".docx-lightbox-overlay")) return;

  var overlay=document.createElement("div");
  overlay.className="docx-lightbox-overlay";
  overlay.setAttribute("role","dialog");
  overlay.setAttribute("aria-modal","true");

  var content=document.createElement("div");
  content.className="docx-lightbox-content";

  var img=document.createElement("img");
  img.className="docx-lightbox-img";
  img.alt="Image agrandie";

  var closeBtn=document.createElement("button");
  closeBtn.className="docx-lightbox-close";
  closeBtn.type="button";
  closeBtn.setAttribute("aria-label","Fermer");
  closeBtn.textContent="×";

  content.appendChild(closeBtn);
  content.appendChild(img);
  overlay.appendChild(content);
  document.body.appendChild(overlay);

  function openLightbox(src){
    if(!src) return;
    img.src=src;
    overlay.classList.add("is-open");
    document.body.classList.add("docx-lightbox-open");
  }
  function closeLightbox(){
    overlay.classList.remove("is-open");
    document.body.classList.remove("docx-lightbox-open");
    // clear src to free memory on very large images
    img.removeAttribute("src");
  }

  document.addEventListener("click",function(ev){
    var target=ev.target;
    if(target && target.classList && target.classList.contains("docx-zoomable")){
      ev.preventDefault();
      openLightbox(target.getAttribute("src"));
    }
  });

  closeBtn.addEventListener("click",function(ev){
    ev.preventDefault();
    closeLightbox();
  });

  overlay.addEventListener("click",function(ev){
    // close when clicking outside the image/content
    if(ev.target===overlay){
      closeLightbox();
    }
  });

  document.addEventListener("keydown",function(ev){
    if(ev.key==="Escape" && overlay.classList.contains("is-open")){
      closeLightbox();
    }
  });

  // Also allow closing by clicking on the enlarged image itself
  img.addEventListener("click",function(){
    closeLightbox();
  });
});
// --- Copy-to-clipboard for code blocks (DOCX converter) ---
(function() {
  var COPY_LABEL = "Copier";
  var COPIED_LABEL = "Copié";
  var ONLY_RECOGNIZED = true;
  var MIN_LINES = 4;
  var PYGMENTS_HEURISTIC = true;

  // Languages considered "not recognized" (plain text)
  var EXCLUDED = { "text":1, "plaintext":1, "plain":1, "txt":1, "none":1, "pygments":0, "hljs":0 };

  function fallbackCopyText(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        fallbackCopyText(text);
      });
    }
    fallbackCopyText(text);
    return Promise.resolve();
  }

  function setButtonState(btn) {
    if (!btn) return;
    btn.textContent = COPIED_LABEL;
    btn.classList.add("is-copied");
    window.setTimeout(function () {
      btn.textContent = COPY_LABEL;
      btn.classList.remove("is-copied");
    }, 1200);
  }

  function getLangFromClass(el) {
    if (!el || !el.classList) return "";
    for (var i = 0; i < el.classList.length; i++) {
      var c = el.classList[i];
      if (c.indexOf("language-") === 0) return c.substring(9);
    }
    return "";
  }

  function isHighlighted(el) {
    if (!el) return false;
    // Pygments / MkDocs wrappers
    if (el.classList && (el.classList.contains("highlight") || el.classList.contains("codehilite"))) return true;
    if (el.closest && el.closest("div.highlight,div.codehilite,table.highlighttable")) return true;
    // Highlight.js
    if (el.classList && el.classList.contains("hljs")) return true;
    if (el.querySelector && el.querySelector(".hljs")) return true;
    // Heuristic: presence of common Pygments token spans
    if (el.querySelector && el.querySelector("span.k,span.kt,span.kn,span.kd,span.kc,span.nb,span.nc,span.nn,span.nf,span.nt,span.na,span.s,span.s1,span.s2,span.mi,span.mf,span.c,span.c1,span.cp,span.o")) return true;
    return false;
  }

  function detectLanguage(el) {
    if (!el) return "";
    // try code, pre, container, ancestors
    var code = el.querySelector ? (el.querySelector("code") || null) : null;
    var pre = el.querySelector ? (el.querySelector("pre") || null) : null;

    var lang = "";
    if (code) lang = getLangFromClass(code);
    if (!lang && pre) lang = getLangFromClass(pre);
    if (!lang) lang = getLangFromClass(el);

    if (!lang) {
      // ancestors
      var cur = el;
      for (var k = 0; k < 4 && cur; k++) {
        lang = getLangFromClass(cur);
        if (lang) break;
        cur = cur.parentElement;
      }
    }
    if (!lang) {
      // data attributes
      var attr = (code && (code.getAttribute("data-language") || code.getAttribute("data-lang"))) ||
                 (pre && (pre.getAttribute("data-language") || pre.getAttribute("data-lang"))) ||
                 (el.getAttribute && (el.getAttribute("data-language") || el.getAttribute("data-lang")));
      if (attr) lang = attr;
    }
    if (!lang && PYGMENTS_HEURISTIC) {
      // Heuristic: if the block contains Pygments token spans, syntax highlighting is active
      // even if no explicit language-xxx class is present.
      var hasTok = el.querySelector && el.querySelector("span.k,span.kt,span.kn,span.kd,span.kc,span.nb,span.nc,span.nn,span.nf,span.nt,span.na,span.s,span.s1,span.s2,span.mi,span.mf,span.c,span.c1,span.cp,span.o");
      if (hasTok) lang = "pygments";
    }
    return (lang || "").toLowerCase();
  }

  function countLinesFromText(text) {
    if (!text) return 0;
    text = text.replace(/\s+$/,"");
    if (!text) return 0;
    return text.split("\n").length;
  }

  function extractCodeFromRich(container) {
    // Prefer explicit content spans to avoid line numbers
    var parts = container.querySelectorAll(".docx-code-line-content");
    if (parts && parts.length) {
      var lines = [];
      parts.forEach(function (sp) {
        lines.push(sp.textContent || "");
      });
      return lines.join("\n");
    }
    var code = container.querySelector("pre code") || container.querySelector("code") || container.querySelector("pre");
    if (!code) return "";
    var clone = code.cloneNode(true);
    clone.querySelectorAll(".docx-code-lineno,.lineno,.linenos,.linenodiv,td.linenos,span.linenos,.hljs-ln-numbers").forEach(function (n) {
      n.remove();
    });
    return (clone.textContent || "").replace(/\s+$/,"");
  }

  function extractCodeGeneric(scope) {
    var table = scope.closest ? scope.closest("table.highlighttable") : null;
    if (table) {
      var codeCell = table.querySelector("td.code pre, td.code code, td.code");
      if (codeCell) {
        return (codeCell.textContent || "").replace(/\s+$/,"");
      }
    }

    var pre = scope.tagName && scope.tagName.toLowerCase() === "pre" ? scope : (scope.querySelector ? (scope.querySelector("pre") || scope) : scope);
    var code = pre && pre.querySelector ? (pre.querySelector("code") || pre) : pre;
    if (!code) return "";

    var clone = code.cloneNode(true);
    clone.querySelectorAll(".docx-code-lineno,.lineno,.linenos,.linenodiv,td.linenos,span.linenos,.hljs-ln-numbers").forEach(function (n) {
      n.remove();
    });
    return (clone.textContent || "").replace(/\s+$/,"");
  }

  function shouldAddButton(container, codeText, opts) {
    opts = opts || {};
    if (!container) return false;
    if (container.querySelector && container.querySelector(".docx-code-copy-btn")) return false;

    // Force: unconditional (kept for compatibility)
    if (opts.force) return true;

    // Rich code blocks: ignore language recognition, but still respect MIN_LINES.
    if (!opts.rich) {
      var lang = detectLanguage(container);
      if (ONLY_RECOGNIZED) {
        if (!lang || EXCLUDED[lang]) return false;
      }
    }
    if (MIN_LINES && MIN_LINES > 0) {
      var n = countLinesFromText(codeText);
      if (n < MIN_LINES) return false;
    }
    return true;
  }

  function ensureButton(container, extractor, opts) {
    if (!container) return;
    opts = opts || {};
    var text = extractor(container);
    if (!shouldAddButton(container, text, opts)) return;

    container.classList.add("docx-code-copy-container");

    var btn = container.querySelector(".docx-code-copy-btn");
    if (btn && btn.getAttribute("data-copy-bound") === "1") return;

    if (!btn) {
      btn = document.createElement("button");
      btn.className = "docx-code-copy-btn";
      btn.type = "button";
      btn.textContent = COPY_LABEL;
      container.appendChild(btn);
    } else {
      // Ensure expected baseline attributes
      btn.classList.add("docx-code-copy-btn");
      if (!btn.type) btn.type = "button";
      if (!btn.textContent) btn.textContent = COPY_LABEL;
    }

    btn.setAttribute("data-copy-bound","1");

    btn.addEventListener("click", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var t = extractor(container);
      copyText(t).then(function () {
        setButtonState(btn);
      });
    });
  }

  function initCopy(root) {
    var scope = root || document;

    // Rich code blocks generated by the converter
    scope.querySelectorAll(".docx-code-rich").forEach(function (block) {
      ensureButton(block, extractCodeFromRich, { rich: true });
    });

    // Pygments highlight tables: prefer attaching on the outer wrapper (.highlight/.codehilite)
// so the button is positioned correctly, while copying from td.code only.
    scope.querySelectorAll("table.highlighttable").forEach(function (tbl) {
      var cell = tbl.querySelector("td.code");
      if (!cell) return;

      var wrap = null;
      if (tbl.closest) {
        wrap = tbl.closest("div.highlight, div.codehilite");
      }
      if (!wrap) wrap = tbl;

      ensureButton(wrap, function () { return extractCodeGeneric(cell); });
    });

    // MkDocs/Pygments wrappers: add a button once per wrapper
    scope.querySelectorAll("div.highlight, div.codehilite").forEach(function (wrap) {
      // Avoid duplicates if the wrapper contains an already handled table.highlighttable
      if (wrap.querySelector && wrap.querySelector("table.highlighttable")) return;
      ensureButton(wrap, function () { return extractCodeGeneric(wrap); });
    });

    // Other code blocks: add a button on the nearest wrapper around <pre>
// (robust against MkDocs Material wrapper variations)
    scope.querySelectorAll("pre").forEach(function (pre) {
      if (pre.closest && pre.closest(".docx-code-rich")) return;
      if (pre.closest && pre.closest("table.highlighttable")) return;

      var container = pre;

      // Typical MkDocs/Pygments wrappers
      var p = pre.parentElement;
      if (p && p.classList && (p.classList.contains("highlight") || p.classList.contains("codehilite"))) {
        container = p;
      } else if (pre.classList && (pre.classList.contains("highlight") || pre.classList.contains("codehilite"))) {
        container = pre;
      } else if (pre.closest) {
        var wrap = pre.closest("div.highlight,div.codehilite,figure.highlight,figure.codehilite");
        if (wrap) container = wrap;
      }

      ensureButton(container, function () { return extractCodeGeneric(container); });
    });
  }

  function boot() {
    try { initCopy(document); } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // MkDocs Material instant navigation support
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(function () {
      window.setTimeout(boot, 0);
    });
  } else {
    var target = document.querySelector(".md-content");
    if (target && window.MutationObserver) {
      var mo = new MutationObserver(function () {
        window.setTimeout(boot, 0);
      });
      mo.observe(target, { childList: true, subtree: true });
    }
  }
})();
