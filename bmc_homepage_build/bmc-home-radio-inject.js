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

  function mount() {
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
      "height:72px",
      "border:0",
      "display:block",
      "overflow:hidden",
      "background:transparent"
    ].join(";");

    wrap.appendChild(frame);

    var target = document.querySelector("header") ||
      document.querySelector(".site-header") ||
      document.querySelector("main") ||
      document.body.firstElementChild;

    if (target && target.parentNode) {
      target.parentNode.insertBefore(wrap, target.nextSibling);
    } else {
      document.body.insertBefore(wrap, document.body.firstChild);
    }
  }

  ready(mount);
})();