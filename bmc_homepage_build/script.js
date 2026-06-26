const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".main-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox img");
const lightboxClose = document.querySelector(".lightbox-close");

document.querySelectorAll(".gallery-grid button").forEach((button) => {
  button.addEventListener("click", () => {
    const img = button.querySelector("img");
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = button.dataset.full;
    lightboxImage.alt = img?.alt || "Balcony Music Club gallery photo";
    lightbox.hidden = false;
  });
});

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.hidden = true;
  lightboxImage.src = "";
}

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox();
});

document.querySelector(".signup form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.querySelector("input");
  if (input) input.value = "";
});

(function restoreHomepage(){
  const links = {
    home: "https://www.balconymusicclub.com/",
    shows: "https://shows.balconymusicclub.com/",
    host: "https://www.balconymusicclub.com/host-your-event",
    store: "https://www.balconymusicclub.com/store",
    jazzycat: "https://www.balconymusicclub.com/ask-jazzycat/",
    app: "https://app.balconymusicclub.com/"
  };

  const css = document.createElement("style");
  css.id = "bmc-homepage-fit-restore";
  css.textContent = `
    html,body{width:100%!important;height:100%!important;min-height:100%!important;margin:0!important;overflow:hidden!important}
    .bmc-home-radio,.site-footer,.dashboard,.hero-buttons [data-bmc-radio-trigger]{display:none!important}
    .site-header{position:relative!important;top:auto!important;width:min(1680px,calc(100vw - 36px))!important;margin-top:10px!important;padding:8px 14px!important}
    .brand img{width:clamp(224px,18vw,350px)!important;max-height:98px!important;object-fit:contain!important;image-rendering:auto!important}
    main#home{min-height:0!important;overflow:visible!important}
    .hero.shell{width:min(1680px,calc(100vw - 42px))!important;max-width:none!important}
    .hero{min-height:660px!important;padding-top:clamp(16px,2.3vh,34px)!important;padding-bottom:172px!important;align-items:center!important;overflow:visible!important}
    .official-copy{max-width:790px!important;margin:20px 0 0!important;font-size:clamp(18px,1.55vw,27px)!important;line-height:1.32!important}
    .stage-photo{height:118px!important;background-image:linear-gradient(90deg,rgba(18,7,38,.10),rgba(18,7,38,.26)),url("bmc_homepage_build/assets/gallery-4.jpg")!important;background-size:cover!important;background-position:center 48%!important;image-rendering:auto!important}
    .live-card{padding:20px!important}.live-card .genre{font-size:16px!important;line-height:1.28!important}.live-card .set-times{margin-bottom:14px!important}.live-card .set-times div{padding:8px 0!important}
    .jazzycat-band{bottom:38px!important;min-height:142px!important;padding:12px 20px 16px!important;align-items:center!important;overflow:visible!important}
    .jazzycat-copy{align-self:center!important;padding-bottom:6px!important;overflow:visible!important}.jazzycat-copy small{display:block!important;color:rgba(255,243,207,.92)!important;font-size:13px!important;line-height:1.35!important;padding-bottom:4px!important;overflow:visible!important}
    .cat-march{height:116px!important;overflow:visible!important}.cat{height:clamp(82px,8vw,116px)!important}
    .bmc-legal-notice{position:fixed!important;left:50%!important;bottom:4px!important;z-index:70!important;width:min(1440px,calc(100vw - 48px))!important;margin:0!important;padding:6px 12px!important;transform:translateX(-50%)!important;text-align:center!important;font-size:10px!important;text-transform:none!important;background:rgba(9,2,22,.38)!important;border:1px solid rgba(255,210,91,.16)!important}
    @media(max-width:1120px){.brand img{max-height:82px!important}.hero{min-height:0!important;padding-bottom:158px!important}.jazzycat-band{bottom:36px!important;min-height:132px!important;padding:10px 18px 15px!important}.cat-march{height:104px!important}.cat{height:clamp(72px,9vw,104px)!important}}
    @media(max-width:760px){body{min-height:1080px!important}.site-header{margin-top:8px!important;padding:8px 10px!important}.brand img{width:min(62vw,250px)!important;max-height:72px!important}.header-actions{display:none!important}.hero.shell{display:grid!important;grid-template-columns:1fr!important;grid-template-areas:"copy" "cats" "live"!important;gap:12px!important;height:auto!important;padding-top:12px!important;padding-bottom:58px!important;align-items:start!important}.hero-copy{grid-area:copy!important}.live-card{grid-area:live!important;padding:12px!important;max-width:650px!important;width:100%!important}.hero h1{font-size:clamp(40px,12.4vw,62px)!important}.official-copy{margin-top:12px!important;font-size:clamp(14px,3.75vw,18px)!important;line-height:1.22!important}.stage-photo{height:62px!important}.jazzycat-band{grid-area:cats!important;position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;grid-template-columns:.92fr 1.08fr!important;min-height:84px!important;margin:2px 0 0!important;padding:10px 12px!important;overflow:hidden!important}.cat-march{height:68px!important;justify-content:flex-end!important;gap:0!important}.cat{height:54px!important;margin-left:-10px!important}}
  `;
  document.head.appendChild(css);

  function setLink(el, href, target){
    if (!el) return;
    el.href = href;
    el.target = target || "_top";
    if (el.target === "_blank") el.rel = "noopener noreferrer";
    else el.removeAttribute("rel");
  }

  setLink(document.querySelector(".brand"), links.home);
  document.querySelectorAll(".main-nav a").forEach((a)=>{
    const label=(a.textContent||"").trim().toLowerCase();
    if(label==="home")setLink(a,links.home);
    if(label==="shows")setLink(a,links.shows);
    if(label==="host your event")setLink(a,links.host);
    if(label==="store")setLink(a,links.store);
    if(label==="ask jazzycat")setLink(a,links.jazzycat);
  });
  document.querySelectorAll(".hero-buttons a,.live-card a").forEach((a)=>{
    const label=(a.textContent||"").toLowerCase();
    if(label.includes("schedule")||label.includes("shows"))setLink(a,links.shows);
  });
  document.querySelectorAll(".header-actions a").forEach((a)=>{
    const label=(a.textContent||a.getAttribute("aria-label")||"").toLowerCase();
    if(label.includes("app"))setLink(a,links.app,"_blank");
  });
})();
