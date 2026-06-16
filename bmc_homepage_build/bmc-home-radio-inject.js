(function injectBmcHomeRadioFrame() {
  var FRAME_ID = "bmc-repo-home-radio-frame";
  var WRAP_ID = "bmc-repo-home-radio-frame-wrap";
  var SRC = "https://floydclaptonblues.github.io/BMC-Homepage/bmc_homepage_build/bmc-home-radio-embed.html?v=20260616-standalone-frame";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function findHeaderTarget() {
    return document.querySelector("header") ||
      document.querySelector("[role='banner']") ||
      document.querySelector(".site-header") ||
      document.querySelector(".header") ||
      document.querySelector("#header") ||
      document.querySelector(".bmc-site-header") ||
      document.querySelector("nav") ||
      document.body.firstElementChild;
  }

  function placeAfterHeader(node) {
    var target = findHeaderTarget();
    if (target && target.parentNode) {
      target.parentNode.insertBefore(node, target.nextSibling);
    } else if (document.body.firstChild) {
      document.body.insertBefore(node, document.body.firstChild);
    } else {
      document.body.appendChild(node);
    }
  }

  function slimExistingPlayer(existing) {
    existing.id = "bmc-radio-wrap";
    existing.style.cssText += ";width:100%;max-width:1120px;margin:8px auto 10px;padding:0 8px;box-sizing:border-box;position:relative;z-index:99999;";

    var bar = existing.querySelector("#bmc-radio-bar");
    if (bar) {
      bar.style.cssText += ";min-height:46px;border-radius:10px;";
    }

    var ticker = existing.querySelector("#bmcThinTicker");
    if (ticker && ticker.parentNode) {
      ticker.parentNode.style.display = "none";
    }

    var socials = existing.querySelector("#bmc-socials");
    if (socials) {
      socials.style.display = "none";
    }

    var inner = existing.querySelector("#bmc-radio-bar > div[style*='display:flex']");
    if (inner) {
      inner.style.cssText += ";padding:7px 10px;gap:9px;";
    }

    placeAfterHeader(existing);
  }

  function createFrame() {
    var old = document.getElementById(WRAP_ID);
    if (old && old.parentNode) old.parentNode.removeChild(old);

    var wrap = document.createElement("div");
    wrap.id = WRAP_ID;
    wrap.style.cssText = [
      "width:100%",
      "max-width:1120px",
      "margin:8px auto 10px",
      "padding:0 8px",
      "box-sizing:border-box",
      "position:relative",
      "z-index:99999"
    ].join(";");

    var frame = document.createElement("iframe");
    frame.id = FRAME_ID;
    frame.title = "BMC Radio";
    frame.src = SRC;
    frame.loading = "eager";
    frame.scrolling = "no";
    frame.setAttribute("allow", "autoplay");
    frame.style.cssText = [
      "width:100%",
      "height:76px",
      "border:0",
      "display:block",
      "overflow:hidden",
      "background:transparent"
    ].join(";");

    wrap.appendChild(frame);
    placeAfterHeader(wrap);
  }

  function mount() {
    var existing = document.getElementById("bmc-radio-wrap") ||
      document.getElementById("bmc-home-radio-wrap");

    if (existing && !document.getElementById(FRAME_ID)) {
      slimExistingPlayer(existing);
      return;
    }

    createFrame();
  }

  ready(function () {
    mount();
    window.setTimeout(mount, 600);
    window.setTimeout(mount, 1800);
  });
})();