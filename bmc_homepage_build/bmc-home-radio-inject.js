(function injectBmcHomeRadio() {
  var MOUNT_ID = "bmc-repo-home-radio";
  var KEY = "__BMC_REPO_HOME_RADIO__";
  var CHANNEL_NAME = "bmc_sitewide_radio_channel";
  var STORAGE_KEY = "__BMC_SITEWIDE_STOP__";
  var INSTANCE_ID = "bmc_repo_home_" + Date.now() + "_" + Math.random().toString(36).slice(2);
  var bc = null;

  var playlist = [
    {
      title: "Parade On Esplanade",
      src: "https://img1.wsimg.com/blobby/go/fcde905d-e711-4bbd-8961-6b9df0cf58b2/downloads/a862837f-91fa-448b-bb7a-8e02d7e68ac7/ONE%20MO_%20_GIN.mp3?ver=1775241263886"
    },
    {
      title: "Ghost Parade On Canal",
      src: "https://img1.wsimg.com/blobby/go/fcde905d-e711-4bbd-8961-6b9df0cf58b2/downloads/f079c265-e581-4b05-a37d-65b396267fb1/Ghost%20Parade%20on%20Canal.mp3?ver=1774633564261"
    }
  ];

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  ready(function mount() {
    if (window[KEY] && typeof window[KEY].cleanup === "function") {
      try { window[KEY].cleanup(); } catch (e) {}
    }

    var existing = document.getElementById(MOUNT_ID);
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    var css = document.createElement("style");
    css.id = "bmc-repo-home-radio-style";
    css.textContent = "\n" +
      "@import url('https://fonts.googleapis.com/css2?family=DotGothic16&display=swap');\n" +
      "#" + MOUNT_ID + ", #" + MOUNT_ID + " *{box-sizing:border-box;font-family:'DotGothic16','MS Gothic','Chicago',sans-serif!important;}\n" +
      "#" + MOUNT_ID + "{width:min(1080px,calc(100% - 22px));margin:8px auto 10px;position:relative;z-index:99999;}\n" +
      "#" + MOUNT_ID + " .bmc-radio-bar{position:relative;overflow:hidden;min-height:42px;border:1px solid rgba(143,252,255,.82);border-radius:999px;background:linear-gradient(rgba(10,10,35,.54),rgba(28,0,52,.64)),url('https://img-cdn.publive.online/filters:format(webp)/indigomusic/media/post_attachments/wp-content/uploads/2024/06/Vaporwave-aesthetic-1.jpg') center center/cover no-repeat;box-shadow:0 0 0 1px rgba(255,255,255,.13) inset,0 0 12px rgba(0,255,255,.18),0 0 22px rgba(255,0,180,.12);color:#fff;}\n" +
      "#" + MOUNT_ID + " .bmc-radio-bar:before{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(to bottom,rgba(255,255,255,.07),rgba(255,255,255,0)),repeating-linear-gradient(to bottom,rgba(255,255,255,.035) 0,rgba(255,255,255,.035) 1px,transparent 1px,transparent 3px);opacity:.42;mix-blend-mode:screen;}\n" +
      "#" + MOUNT_ID + " .bmc-radio-inner{position:relative;z-index:2;display:grid;grid-template-columns:auto minmax(160px,1fr) auto minmax(110px,210px) auto auto;align-items:center;gap:8px;padding:6px 9px;}\n" +
      "#" + MOUNT_ID + " .bmc-radio-badge{display:inline-flex;align-items:center;justify-content:center;min-height:28px;padding:0 9px;border-radius:999px;border:1px solid rgba(143,252,255,.55);background:rgba(0,0,0,.32);color:#8ffcff;font-size:10px;font-weight:900;letter-spacing:1px;text-transform:uppercase;white-space:nowrap;box-shadow:0 0 8px rgba(143,252,255,.16);}\n" +
      "#" + MOUNT_ID + " .bmc-radio-track{min-width:0;line-height:1;}\n" +
      "#" + MOUNT_ID + " .bmc-radio-title{display:block;color:#fff;font-size:13px;text-shadow:0 0 8px rgba(255,0,200,.35);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\n" +
      "#" + MOUNT_ID + " .bmc-radio-sub{display:block;margin-top:3px;color:#ffd8fa;font-size:9px;letter-spacing:.7px;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\n" +
      "#" + MOUNT_ID + " .bmc-radio-play{appearance:none;border:none;cursor:pointer;min-height:30px;padding:0 12px;border-radius:999px;background:linear-gradient(90deg,#ff4fd8,#7df9ff);color:#16001f;font-size:11px;font-weight:900;white-space:nowrap;box-shadow:0 0 12px rgba(255,0,184,.28);}\n" +
      "#" + MOUNT_ID + " .bmc-radio-play:active{transform:translateY(1px);}\n" +
      "#" + MOUNT_ID + " .bmc-radio-meter{width:100%;height:7px;border-radius:999px;background:rgba(255,255,255,.16);overflow:hidden;box-shadow:inset 0 0 6px rgba(0,0,0,.35);}\n" +
      "#" + MOUNT_ID + " .bmc-radio-progress{display:block;width:0%;height:100%;background:linear-gradient(90deg,#7df9ff,#ff4fd8);box-shadow:0 0 10px rgba(125,249,255,.55);}\n" +
      "#" + MOUNT_ID + " .bmc-radio-time{min-width:74px;text-align:right;font-size:10px;color:#eefcff;text-shadow:0 0 5px rgba(125,249,255,.30);white-space:nowrap;}\n" +
      "#" + MOUNT_ID + " .bmc-radio-vol{display:inline-flex;align-items:center;gap:6px;min-height:30px;padding:0 9px;border-radius:999px;background:rgba(0,0,0,.24);border:1px solid rgba(255,255,255,.14);color:#fff;font-size:10px;white-space:nowrap;}\n" +
      "#" + MOUNT_ID + " .bmc-radio-vol input{width:66px;accent-color:#7df9ff;}\n" +
      "#" + MOUNT_ID + " audio{display:none;}\n" +
      "@media(max-width:760px){#" + MOUNT_ID + "{width:calc(100% - 14px);margin:7px auto 8px;}#" + MOUNT_ID + " .bmc-radio-bar{border-radius:14px;}#" + MOUNT_ID + " .bmc-radio-inner{grid-template-columns:1fr auto;gap:7px;padding:8px;}#" + MOUNT_ID + " .bmc-radio-badge,#" + MOUNT_ID + " .bmc-radio-meter,#" + MOUNT_ID + " .bmc-radio-time,#" + MOUNT_ID + " .bmc-radio-vol{grid-column:1/-1;}#" + MOUNT_ID + " .bmc-radio-track{grid-column:1/2;}#" + MOUNT_ID + " .bmc-radio-play{grid-column:2/3;}#" + MOUNT_ID + " .bmc-radio-time{text-align:left;}#" + MOUNT_ID + " .bmc-radio-vol{display:none;}}\n";
    document.head.appendChild(css);

    var wrap = document.createElement("section");
    wrap.id = MOUNT_ID;
    wrap.setAttribute("aria-label", "BMC Radio slim homepage player");
    wrap.innerHTML = "" +
      "<div class='bmc-radio-bar'>" +
      "  <div class='bmc-radio-inner'>" +
      "    <div class='bmc-radio-badge'>BMC Radio</div>" +
      "    <div class='bmc-radio-track'><strong class='bmc-radio-title'>Parade On Esplanade</strong><span class='bmc-radio-sub'>Balcony Music Club Signal • Autoplay Requested</span></div>" +
      "    <button class='bmc-radio-play' type='button'>▶ Play</button>" +
      "    <div class='bmc-radio-meter' aria-hidden='true'><span class='bmc-radio-progress'></span></div>" +
      "    <div class='bmc-radio-time'>0:00 / 0:00</div>" +
      "    <label class='bmc-radio-vol'>Vol <input class='bmc-radio-volume' type='range' min='0' max='1' step='0.01' value='0.18'></label>" +
      "    <audio class='bmc-radio-audio' preload='auto' autoplay playsinline></audio>" +
      "  </div>" +
      "</div>";

    var target = document.querySelector("header") || document.querySelector(".site-header") || document.body.firstElementChild;
    if (target && target.parentNode) {
      target.parentNode.insertBefore(wrap, target.nextSibling);
    } else {
      document.body.insertBefore(wrap, document.body.firstChild);
    }

    var audio = wrap.querySelector(".bmc-radio-audio");
    var playBtn = wrap.querySelector(".bmc-radio-play");
    var vol = wrap.querySelector(".bmc-radio-volume");
    var progress = wrap.querySelector(".bmc-radio-progress");
    var time = wrap.querySelector(".bmc-radio-time");
    var titleEl = wrap.querySelector(".bmc-radio-title");
    var currentIndex = 0;

    function safePause(targetAudio) {
      if (!targetAudio) return;
      try { targetAudio.pause(); } catch (e) {}
    }

    function hardStop(targetAudio) {
      if (!targetAudio) return;
      try { targetAudio.pause(); } catch (e) {}
      try { targetAudio.currentTime = 0; } catch (e) {}
      try { targetAudio.removeAttribute("src"); } catch (e) {}
      try { targetAudio.load(); } catch (e) {}
    }

    function pauseOtherAudioOnPage() {
      try {
        var audios = document.querySelectorAll("audio");
        for (var i = 0; i < audios.length; i += 1) {
          if (audios[i] !== audio) {
            try { audios[i].pause(); audios[i].currentTime = 0; } catch (e) {}
          }
        }
      } catch (e) {}
    }

    function sendStopSignal() {
      var payload = JSON.stringify({ id: INSTANCE_ID, t: Date.now() });
      try { localStorage.setItem(STORAGE_KEY, payload); } catch (e) {}
      try {
        if (!bc && "BroadcastChannel" in window) bc = new BroadcastChannel(CHANNEL_NAME);
        if (bc) bc.postMessage(payload);
      } catch (e) {}
    }

    function stopThisInstance() {
      safePause(audio);
      updateBtn();
    }

    function onExternalStop(raw) {
      try {
        var data = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (!data || data.id === INSTANCE_ID) return;
        stopThisInstance();
      } catch (e) {}
    }

    function onStorage(event) {
      if (event.key === STORAGE_KEY && event.newValue) onExternalStop(event.newValue);
    }

    function fmt(seconds) {
      if (!Number.isFinite(seconds)) return "0:00";
      var minutes = Math.floor(seconds / 60);
      var secs = Math.floor(seconds % 60);
      return minutes + ":" + (secs < 10 ? "0" + secs : secs);
    }

    function updateBtn() {
      playBtn.textContent = audio.paused ? "▶ Play" : "❚❚ Pause";
    }

    function updateTime() {
      var cur = audio.currentTime || 0;
      var dur = audio.duration || 0;
      var pct = dur ? Math.min(100, Math.max(0, (cur / dur) * 100)) : 0;
      progress.style.width = pct + "%";
      time.textContent = fmt(cur) + " / " + fmt(dur);
    }

    function setTrack(index, shouldPlay) {
      currentIndex = ((index % playlist.length) + playlist.length) % playlist.length;
      var track = playlist[currentIndex];
      safePause(audio);
      audio.src = track.src;
      titleEl.textContent = track.title;
      audio.load();
      audio.volume = parseFloat(vol.value || "0.18");
      updateTime();
      if (shouldPlay) tryStart();
      else updateBtn();
    }

    function nextTrack() {
      setTrack(currentIndex + 1, true);
    }

    function tryStart() {
      sendStopSignal();
      pauseOtherAudioOnPage();
      audio.muted = false;
      audio.volume = parseFloat(vol.value || "0.18");
      var promise = audio.play();
      if (promise && typeof promise.then === "function") {
        promise.then(updateBtn).catch(updateBtn);
      } else {
        updateBtn();
      }
    }

    function onPlayClick(event) {
      if (event) event.preventDefault();
      if (audio.paused) tryStart();
      else {
        audio.pause();
        updateBtn();
      }
    }

    function onVolInput() {
      audio.volume = parseFloat(vol.value || "0.18");
    }

    function onVisibility() {
      if (document.hidden) {
        safePause(audio);
        updateBtn();
      }
    }

    function cleanup() {
      playBtn.removeEventListener("click", onPlayClick);
      vol.removeEventListener("input", onVolInput);
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
      audio.removeEventListener("play", updateBtn);
      audio.removeEventListener("pause", updateBtn);
      audio.removeEventListener("ended", nextTrack);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("pagehide", stopThisInstance);
      window.removeEventListener("beforeunload", stopThisInstance);
      document.removeEventListener("visibilitychange", onVisibility);
      try { if (bc) { bc.close(); bc = null; } } catch (e) {}
      hardStop(audio);
      if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
      var style = document.getElementById("bmc-repo-home-radio-style");
      if (style && style.parentNode) style.parentNode.removeChild(style);
      if (window[KEY] && window[KEY].audio === audio) delete window[KEY];
    }

    try {
      if ("BroadcastChannel" in window) {
        bc = new BroadcastChannel(CHANNEL_NAME);
        bc.onmessage = function (event) { onExternalStop(event.data); };
      }
    } catch (e) {}

    playBtn.addEventListener("click", onPlayClick);
    vol.addEventListener("input", onVolInput);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);
    audio.addEventListener("play", updateBtn);
    audio.addEventListener("pause", updateBtn);
    audio.addEventListener("ended", nextTrack);
    window.addEventListener("storage", onStorage);
    window.addEventListener("pagehide", stopThisInstance);
    window.addEventListener("beforeunload", stopThisInstance);
    document.addEventListener("visibilitychange", onVisibility);

    window[KEY] = { audio: audio, cleanup: cleanup };

    setTrack(0, false);
    window.setTimeout(tryStart, 500);
    updateBtn();
    updateTime();
  });
})();