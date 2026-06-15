const UPCOMING_SHOWS_SOURCES = [
  "https://floydclaptonblues.github.io/UpcomingShows/shows.json",
  "https://raw.githubusercontent.com/floydclaptonblues/UpcomingShows/main/shows.json"
];

const MONTH_INDEX = {
  JANUARY: 0,
  FEBRUARY: 1,
  MARCH: 2,
  APRIL: 3,
  MAY: 4,
  JUNE: 5,
  JULY: 6,
  AUGUST: 7,
  SEPTEMBER: 8,
  OCTOBER: 9,
  NOVEMBER: 10,
  DECEMBER: 11
};

const scheduleEls = {
  liveTitle: document.querySelector("[data-live-title]"),
  liveSubtitle: document.querySelector("[data-live-subtitle]"),
  liveEvents: document.querySelector("[data-live-events]"),
  summary: document.querySelector("[data-schedule-summary]"),
  grid: document.querySelector("[data-schedule-grid]"),
  source: document.querySelector("[data-schedule-source]")
};

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function dateKey(year, monthIndex, day) {
  return (year * 10000) + ((monthIndex + 1) * 100) + day;
}

function scheduleYear(data) {
  const yearMatch = String(data.month || data.subtitle || "").match(/\b(20\d{2})\b/);
  if (yearMatch) return Number(yearMatch[1]);
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", year: "numeric" }).format(new Date()));
}

function todayPartsForVenue() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "long",
    hour: "numeric",
    minute: "2-digit"
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    weekday: values.weekday || "",
    time: `${values.hour}:${values.minute}`
  };
}

function todayKeyForVenue() {
  const today = todayPartsForVenue();
  return dateKey(today.year, today.month - 1, today.day);
}

function showDayKey(day, data) {
  const match = String(day.date || "").match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})\b/i);
  if (!match) return null;

  const monthIndex = MONTH_INDEX[match[1].toUpperCase()];
  const dayNumber = Number(match[2]);
  if (!Number.isFinite(monthIndex) || !Number.isFinite(dayNumber)) return null;

  return dateKey(scheduleYear(data), monthIndex, dayNumber);
}

function filterUpcomingDays(data) {
  const todayKey = todayKeyForVenue();
  return (data.shows || []).filter((day) => {
    const key = showDayKey(day, data);
    return key === null || key >= todayKey;
  });
}

async function fetchScheduleData() {
  const cacheBust = `v=${Date.now()}`;
  let lastError = null;

  for (const source of UPCOMING_SHOWS_SOURCES) {
    const url = `${source}${source.includes("?") ? "&" : "?"}${cacheBust}`;
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`${response.status} from ${source}`);
      const data = await response.json();
      return { data, source };
    } catch (error) {
      lastError = error;
      console.warn("Could not load BMC schedule source:", source, error);
    }
  }

  throw lastError || new Error("No schedule source responded.");
}

function renderEmpty(message = "Upcoming shows will be posted here soon.") {
  if (scheduleEls.liveTitle) scheduleEls.liveTitle.textContent = "Schedule Updating";
  if (scheduleEls.liveSubtitle) scheduleEls.liveSubtitle.textContent = message;
  if (scheduleEls.liveEvents) {
    scheduleEls.liveEvents.innerHTML = `
      <div><dt>Source</dt><dd>UpcomingShows GitHub repo</dd></div>
      <div><dt>Status</dt><dd>Waiting for new dates</dd></div>
      <div><dt>Venue</dt><dd>504 Esplanade</dd></div>
      <div><dt>City</dt><dd>New Orleans</dd></div>
    `;
  }
  if (scheduleEls.summary) scheduleEls.summary.textContent = message;
  if (scheduleEls.grid) scheduleEls.grid.innerHTML = `<p class="schedule-empty">${escapeHtml(message)}</p>`;
}

function renderLiveCard(days, data) {
  const todayKey = todayKeyForVenue();
  const today = days.find((day) => showDayKey(day, data) === todayKey);
  const focus = today || days[0];

  if (!focus) {
    renderEmpty();
    return;
  }

  if (scheduleEls.liveTitle) {
    scheduleEls.liveTitle.textContent = `${today ? "Tonight" : "Next Up"}: ${focus.date}`;
  }

  const count = (focus.shows || []).length;
  if (scheduleEls.liveSubtitle) {
    scheduleEls.liveSubtitle.textContent = `${count} performance${count === 1 ? "" : "s"} loaded from the UpcomingShows GitHub schedule.`;
  }

  if (scheduleEls.liveEvents) {
    scheduleEls.liveEvents.innerHTML = (focus.shows || []).map((show) => `
      <div class="${show.headliner ? "is-headliner" : ""}">
        <dt>${escapeHtml(show.time)}</dt>
        <dd>${escapeHtml(show.artist)}</dd>
      </div>
    `).join("");
  }
}

function renderScheduleGrid(days, data, source) {
  const eventCount = days.reduce((sum, day) => sum + (day.shows || []).length, 0);
  const today = todayPartsForVenue();

  if (scheduleEls.summary) {
    scheduleEls.summary.textContent = `${days.length} upcoming show days • ${eventCount} performances • pulled live from floydclaptonblues/UpcomingShows.`;
  }

  if (scheduleEls.source) {
    scheduleEls.source.textContent = `Last checked ${today.weekday} ${today.month}/${today.day}/${today.year} at ${today.time} Central • Source: ${source.includes("raw.githubusercontent") ? "raw GitHub fallback" : "UpcomingShows GitHub Pages"}`;
  }

  if (!scheduleEls.grid) return;
  if (!days.length) {
    renderEmpty();
    return;
  }

  scheduleEls.grid.innerHTML = days.map((day) => `
    <article class="schedule-day-card">
      <h3>${escapeHtml(day.date)}</h3>
      <div class="schedule-day-events">
        ${(day.shows || []).map((show) => `
          <div class="schedule-event${show.headliner ? " is-headliner" : ""}">
            <time>${escapeHtml(show.time)}</time>
            <strong>${escapeHtml(show.artist)}</strong>
          </div>
        `).join("")}
      </div>
    </article>
  `).join("");
}

async function bootHomepageSchedule() {
  if (!scheduleEls.liveTitle && !scheduleEls.grid) return;

  try {
    const { data, source } = await fetchScheduleData();
    const days = filterUpcomingDays(data);
    renderLiveCard(days, data);
    renderScheduleGrid(days, data, source);
  } catch (error) {
    console.error("BMC homepage schedule unavailable:", error);
    renderEmpty("The live schedule could not load from the UpcomingShows repository. Open the full Shows page for the latest listing.");
  }
}

bootHomepageSchedule();
