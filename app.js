"use strict";

const STORAGE_KEY = "tageskompass-v2"; // gleicher Schlüssel: bestehende Daten bleiben erhalten
const HABITS = [
  { id: "food", group: "Körper", label: "Essen gesichert", hint: "Etwas Nahrhaftes gegessen oder die nächste leicht erreichbare Mahlzeit vorbereitet." },
  { id: "water", group: "Körper", label: "Wasser griffbereit", hint: "Getrunken und für den nächsten Abschnitt sichtbar hingestellt." },
  { id: "medication", group: "Körper", label: "Medikamente wie verordnet", hint: "Nach deinem persönlichen ärztlichen Einnahmeplan – ohne Dosisänderung durch die App." },
  { id: "hygiene", group: "Körper", label: "Körperpflege-Basis", hint: "Zum Beispiel Zähne, Gesicht, Dusche oder frische Kleidung." },
  { id: "movement", group: "Regulation", label: "Tageslicht oder Bewegung", hint: "Auch fünf Minuten vor die Tür oder kurzes Dehnen zählen." },
  { id: "sensoryPause", group: "Regulation", label: "Reizpause", hint: "Kurz ohne Anforderungen: Lärm, Licht und Bildschirm reduzieren." },
  { id: "sleepPrep", group: "Regulation", label: "Schlaf vorbereitet", hint: "Wecker, Abendroutine oder ein klarer Übergang in die Nacht." },
  { id: "connection", group: "Regulation", label: "Kontakt oder Unterstützung", hint: "Jemandem geschrieben, um Hilfe gebeten oder bewusst Nähe zugelassen." }
];
const CHECKINS = [
  { id: "sleep", label: "Schlaf-Erholung", low: "kaum erholt", high: "gut erholt" },
  { id: "energy", label: "Körperenergie", low: "leer", high: "tragfähig" },
  { id: "activation", label: "Ins-Tun-Kommen", low: "festgefahren", high: "startklar" },
  { id: "focus", label: "Fokus steuern", low: "springt stark", high: "gut lenkbar" },
  { id: "sensory", label: "Reizpuffer", low: "überreizt", high: "stabil" },
  { id: "regulation", label: "Gefühle regulieren", low: "übernehmen mich", high: "gut steuerbar" }
];
const DAILY_QUOTES = [
  "Du bist genug – auch wenn heute weniger geht als gestern.", "Dein Wert steht auf keiner To-do-Liste.",
  "Langsam ist immer noch eine Richtung.", "Eine Pause ist kein Rückschritt. Sie ist Versorgung.",
  "Du musst heute nichts beweisen, um liebenswert zu sein.", "Auch ein kleiner Schritt darf heute der ganze Erfolg sein.",
  "Dein Gehirn arbeitet anders – nicht falsch.", "Du darfst freundlich mit dir sprechen, besonders an schweren Tagen.",
  "Nicht alles, was dringend wirkt, ist wirklich wichtig.", "Ausruhen zählt. Atmen zählt. Du zählst.",
  "Du darfst den Tag kleiner machen, bis er zu dir passt.", "Genug getan ist besser als dich selbst zu übergehen.",
  "Heute darfst du deinem Tempo vertrauen.", "Du bist mehr als deine Produktivität.", "Unfertig bedeutet nicht gescheitert.",
  "Du darfst neu anfangen, ohne dich für den ersten Versuch zu verurteilen.",
  "Ein überforderter Moment sagt nichts über deine Fähigkeiten aus.", "Deine Bedürfnisse sind keine Störung.",
  "Du musst nicht erst erschöpft sein, um eine Pause zu verdienen.", "Heute darf leicht sein, wo leicht möglich ist.",
  "Es ist okay, wenn dein bester Schritt heute Fürsorge heißt.", "Du bist nicht zu viel. Vielleicht war es einfach gerade zu viel.",
  "Fortschritt darf bunt, krumm und unregelmäßig sein.", "Du darfst stolz auf Dinge sein, die andere gar nicht sehen.",
  "Sanft mit dir zu sein ist kein Aufgeben.", "Du bist bereits ein ganzer Mensch – auch mitten im Chaos.",
  "Manchmal ist Entschleunigen die mutigste Entscheidung des Tages.",
  "Dein heutiges Können muss nicht deinem gestrigen entsprechen.", "Du darfst Hilfe brauchen und trotzdem stark sein.",
  "Heute reicht es, hier zu sein."
];
const WEATHER_ICONS = {0:"☀️",1:"🌤️",2:"⛅",3:"☁️",45:"🌫️",48:"🌫️",51:"🌦️",53:"🌦️",55:"🌧️",56:"🌧️",57:"🌧️",61:"🌧️",63:"🌧️",65:"🌧️",66:"🌧️",67:"🌧️",71:"🌨️",73:"🌨️",75:"❄️",77:"❄️",80:"🌦️",81:"🌧️",82:"⛈️",85:"🌨️",86:"❄️",95:"⛈️",96:"⛈️",99:"⛈️"};
const WEATHER_CACHE_KEY = "tageskompass-weather-v1";
const BOTTLENECKS = [
  { id: "start", label: "Starten" },
  { id: "unclear", label: "Aufgabe unklar" },
  { id: "distraction", label: "Ablenkung" },
  { id: "sensory", label: "Zu viele Reize" },
  { id: "emotion", label: "Starke Gefühle" },
  { id: "tired", label: "Müdigkeit" },
  { id: "food_water", label: "Hunger / Durst" },
  { id: "time", label: "Zeitdruck" },
  { id: "none", label: "Kein großer Engpass" }
];

const EMOTIONS = [
  { id: "freude", label: "Freude", patterns: ["freu", "glücklich", "schoen", "schön", "gelungen", "dankbar", "zufrieden", "spass", "spaß", "lachen", "leicht"] },
  { id: "stolz", label: "Stolz", patterns: ["stolz", "geschafft", "gemeistert", "hingekriegt", "erreicht", "mutig", "durchgezogen"] },
  { id: "erleichterung", label: "Erleichterung", patterns: ["erleichtert", "endlich", "aufatmen", "vorbei", "beruhigt", "entlastet"] },
  { id: "hoffnung", label: "Hoffnung", patterns: ["hoffe", "hoffnung", "zuversicht", "vielleicht klappt", "wird besser", "freue mich auf"] },
  { id: "ueberforderung", label: "Überforderung", patterns: ["überfordert", "ueberfordert", "zu viel", "alles gleichzeitig", "komme nicht hinterher", "keine kraft", "erschöpft", "erschoepft", "fertig", "voller kopf"] },
  { id: "stress", label: "Stress", patterns: ["stress", "druck", "hektisch", "angespannt", "unruhig", "keine zeit", "muss noch", "deadline"] },
  { id: "angst", label: "Angst oder Sorge", patterns: ["angst", "sorge", "besorgt", "nervös", "nervoes", "unsicher", "befürchte", "befuerchte", "panik", "was wenn"] },
  { id: "traurigkeit", label: "Traurigkeit", patterns: ["traurig", "weinen", "vermis", "enttäuscht", "enttaeuscht", "niedergeschlagen", "schwer", "leer"] },
  { id: "wut", label: "Wut oder Ärger", patterns: ["wütend", "wuetend", "sauer", "ärger", "aerger", "genervt", "frustriert", "unfair", "aufgeregt über"] },
  { id: "einsamkeit", label: "Einsamkeit", patterns: ["einsam", "allein", "niemand", "nicht verstanden", "ausgeschlossen", "fehlt mir"] },
  { id: "scham", label: "Scham oder Schuld", patterns: ["schäme", "schaeme", "schuld", "peinlich", "versagt", "hätte müssen", "haette muessen", "schlechtes gewissen"] },
  { id: "verbundenheit", label: "Verbundenheit", patterns: ["zusammen", "verstanden", "unterstützt", "unterstuetzt", "nähe", "naehe", "freund", "familie", "gutgetan"] }
];

const PATTERNS = [
  { label: "hoher innerer Druck", test: text => countMatches(text, ["muss", "sollte", "darf nicht", "alles", "perfekt", "unbedingt"]) >= 2 },
  { label: "Selbstkritik", test: text => countMatches(text, ["ich bin dumm", "ich kann das nicht", "versagt", "war schlecht", "mein fehler", "nicht gut genug"]) >= 1 },
  { label: "Schwarz-Weiß-Denken", test: text => countMatches(text, ["immer", "nie", "alles ist", "gar nichts", "komplett", "total"]) >= 2 },
  { label: "Ambivalenz: mehrere Gefühle gleichzeitig", test: text => countMatches(text, ["aber", "gleichzeitig", "trotzdem", "einerseits", "andererseits"]) >= 2 },
  { label: "erkennbare Selbstwirksamkeit", test: text => countMatches(text, ["geschafft", "gelungen", "ich konnte", "ich habe gemacht", "stolz", "durchgezogen"]) >= 1 },
  { label: "Bedürfnis nach Ruhe oder Entlastung", test: text => countMatches(text, ["ruhe", "pause", "abschalten", "entlast", "schlafen", "erholen", "zeit für mich", "zeit fuer mich"]) >= 1 },
  { label: "Bedürfnis nach Nähe oder Unterstützung", test: text => countMatches(text, ["reden", "jemand", "unterstützung", "unterstuetzung", "verstanden", "nähe", "naehe", "allein"]) >= 1 }
];

const QUESTION_BY_EMOTION = {
  ueberforderung: "Welcher Teil davon braucht heute wirklich deine Aufmerksamkeit – und was darf bewusst kleiner werden?",
  stress: "Woran würdest du merken, dass der Druck für heute ein kleines Stück geringer geworden ist?",
  angst: "Welche Sorge ist gerade eine Tatsache, und welcher Teil ist eine Befürchtung?",
  traurigkeit: "Was hätte dir in diesem Moment Trost oder Halt gegeben?",
  wut: "Welche Grenze oder welches Bedürfnis könnte hinter deinem Ärger stehen?",
  einsamkeit: "Bei welcher Person könntest du dich zeigen, ohne schon eine perfekte Erklärung zu haben?",
  scham: "Wie würdest du mit einer vertrauten Person sprechen, die dasselbe erlebt hat?",
  freude: "Was genau hat diesen guten Moment möglich gemacht, und wie kannst du mehr davon bemerken?",
  stolz: "Welche eigene Stärke wird in dem sichtbar, was du heute geschafft hast?",
  erleichterung: "Was hat dir geholfen, wieder etwas Luft zu bekommen?",
  hoffnung: "Welcher kleine nächste Schritt würde diese Hoffnung unterstützen?",
  verbundenheit: "Was hat dir heute das Gefühl gegeben, nicht allein zu sein?"
};

const state = loadState();
const CALENDAR_KEY_STORAGE = "tageskompass-calendar-access-key-v1";
let selectedDate = startOfToday();
let currentView = "home";
let saveTimer = null;
let deferredInstallPrompt = null;

const el = Object.fromEntries([
  "pageTitle","headerSubtitle","homeView","weekView","dayView","weekDays","weeklyFocus","weekReflection","createWeekReflection",
  "homeGreeting","homeDate","homeOpenDay","homeQuickTask","homeWeekStrip","homePriority","homeSupport","homeCare","homeCareBar","homeEvents","homeEventsEmpty","homeRefreshCalendar","homeCheckinCount","homeCheckinSummary","homeJournalTitle","homeJournalText","homeOpenJournal","homeTab","homeQuote","weatherStatus","weatherIcon","weatherValues","weatherCurrent","weatherHigh","weatherLow","weatherButton",
  "dayHeading","dayPriority","checkinStatus","checkinGrid","sleepHours","medicationState","sideEffectsWrap","sideEffectsText","bottleneckChips","adhdSupportBox","calendarStatus","calendarEventList","refreshCalendarButton","taskCounter","taskList","emptyTasks","habitCounter","habitList",
  "journalText","journalSaveStatus","reflectionOutput","createReflectionButton","clearReflectionButton","previousButton","nextButton",
  "dateButton","weekTab","dayTab","addTaskButton","taskDialog","taskForm","taskDialogTitle","taskTitle","taskTime","taskCategory",
  "taskId","closeTaskDialog","taskTemplate","settingsButton","settingsDialog","closeSettingsDialog","installButton","exportButton",
  "importInput","clearButton","calendarEnabled","calendarEndpoint","calendarAccessKey","testCalendarButton","calendarImportInput","calendarTestResult","aiEnabled","aiEndpoint","testAiButton","aiTestResult"
].map(id => [id, document.getElementById(id)]));

function defaultState() {
  return { version: 4, days: {}, weeks: {}, calendarEvents: [], calendarLastSync: "", settings: { aiEnabled: false, aiEndpoint: "", calendarEnabled: false, calendarEndpoint: "" } };
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : defaultState();
    return Object.assign(defaultState(), parsed, {
      settings: Object.assign(defaultState().settings, parsed.settings || {})
    });
  } catch (error) {
    console.warn("Gespeicherte Daten konnten nicht gelesen werden.", error);
    return defaultState();
  }
}
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Lokale Speicherung ist in dieser Vorschau nicht verfügbar.", error);
  }
}
function markJournalSaving() {
  el.journalSaveStatus.textContent = "speichert …";
  el.journalSaveStatus.style.color = "var(--muted)";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveState();
    el.journalSaveStatus.textContent = "gespeichert";
    el.journalSaveStatus.style.color = "var(--green)";
  }, 500);
}
function startOfToday() {
  const d = new Date(); d.setHours(0,0,0,0); return d;
}
function isoDate(date) {
  const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return d.toISOString().slice(0,10);
}
function addDays(date, amount) { const d = new Date(date); d.setDate(d.getDate() + amount); return d; }
function mondayOf(date) {
  const d = new Date(date); const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1); d.setHours(0,0,0,0); return d;
}
function formatDate(date, options) { return new Intl.DateTimeFormat("de-DE", options).format(date); }
function getDayData(date) {
  const key = isoDate(date);
  if (!state.days[key]) state.days[key] = { priority: "", tasks: [], habits: {}, checkin: {}, bottleneck: "", sleepHours: "", medicationState: "", sideEffects: "", journal: "", reflection: null };
  const day = state.days[key];
  day.tasks = Array.isArray(day.tasks) ? day.tasks : [];
  day.habits = day.habits || {};
  // Einmalige, verlustfreie Übernahme aus der vorherigen Version.
  if (day.habits.food == null && day.habits.breakfast != null) day.habits.food = day.habits.breakfast;
  if (day.habits.sensoryPause == null && day.habits.pause != null) day.habits.sensoryPause = day.habits.pause;
  if (day.habits.sleepPrep == null && day.habits.evening != null) day.habits.sleepPrep = day.habits.evening;
  day.checkin = day.checkin || {};
  if (!("regulation" in day.checkin) && day.checkin.mood != null) day.checkin.regulation = day.checkin.mood;
  if (!("sensory" in day.checkin) && day.checkin.calm != null) day.checkin.sensory = day.checkin.calm;
  if (day.bottleneck == null) day.bottleneck = "";
  if (day.sleepHours == null) day.sleepHours = "";
  if (day.medicationState == null) day.medicationState = "";
  if (day.sideEffects == null) day.sideEffects = "";
  if (day.journal == null) day.journal = "";
  return day;
}
function getWeekData(date) {
  const key = isoDate(mondayOf(date));
  if (!state.weeks[key]) state.weeks[key] = { focus: "", reflection: null };
  return state.weeks[key];
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));
}
function render() {
  renderNavigation();
  if (currentView === "home") renderHome();
  else if (currentView === "week") renderWeek();
  else renderDay();
}
function renderNavigation() {
  const home = currentView === "home";
  const week = currentView === "week";
  const day = currentView === "day";
  el.homeView.classList.toggle("active", home);
  el.weekView.classList.toggle("active", week);
  el.dayView.classList.toggle("active", day);
  el.homeTab.classList.toggle("active", home);
  el.weekTab.classList.toggle("active", week);
  el.dayTab.classList.toggle("active", day);
  el.pageTitle.textContent = home ? "Heute" : week ? "Wochenplan" : "Tagesplan";
  el.headerSubtitle.textContent = home ? "Alles Wichtige auf einen Blick" : week ? "Orientierung für die ganze Woche" : "Planen, wahrnehmen und reflektieren";
}


function supportSuggestions(data) {
  const suggestions = [];
  const bottleneck = data.bottleneck;
  const map = {
    start:"Öffne nur das benötigte Material und arbeite zwei Minuten daran.",
    unclear:"Schreibe den allerersten sichtbaren Handlungsschritt auf.",
    distraction:"Lege das Handy außer Sicht und schließe alles, was du gerade nicht brauchst.",
    sensory:"Reduziere für zehn Minuten Geräusche, Licht und Benachrichtigungen.",
    emotion:"Benenne zuerst das stärkste Gefühl, bevor du eine Aufgabe auswählst.",
    tired:"Plane einen kleineren Schritt und eine echte Pause ein.",
    food_water:"Kümmere dich zuerst um Essen oder Trinken und entscheide danach neu.",
    time:"Wähle genau eine Muss-Aufgabe und verschiebe den Rest bewusst.",
    none:"Nutze den verfügbaren Schwung für einen klar begrenzten nächsten Schritt."
  };
  if (map[bottleneck]) suggestions.push(map[bottleneck]);
  if ((data.checkin?.activation || 5) <= 2 && !suggestions.length) suggestions.push("Verkleinere die Aufgabe auf einen Schritt, der unter zwei Minuten dauert.");
  return suggestions;
}

function dailyQuoteIndex(date = startOfToday()) {
  const key = isoDate(date).replaceAll("-", ""); let hash = 0;
  for (const char of key) hash = ((hash * 31) + char.charCodeAt(0)) >>> 0;
  return hash % DAILY_QUOTES.length;
}
function renderDailyQuote() { el.homeQuote.textContent = DAILY_QUOTES[dailyQuoteIndex()]; }
function readWeatherCache() { try { return JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY) || "null"); } catch { return null; } }
function renderWeather(data = readWeatherCache()) {
  if (!data) { el.weatherValues.hidden=true; el.weatherStatus.textContent="Tippe einmal, um deinen Standort freizugeben."; el.weatherButton.textContent="Standort erlauben & Wetter laden"; return; }
  el.weatherValues.hidden=false; el.weatherCurrent.textContent=Math.round(data.current)+"°"; el.weatherHigh.textContent=Math.round(data.high)+"°"; el.weatherLow.textContent=Math.round(data.low)+"°";
  el.weatherIcon.textContent=WEATHER_ICONS[data.code]||"🌈"; el.weatherStatus.textContent="Aktuell · "+new Intl.DateTimeFormat("de-DE",{hour:"2-digit",minute:"2-digit"}).format(new Date(data.updatedAt))+" Uhr"; el.weatherButton.textContent="Wetter aktualisieren";
}
function getCurrentPosition() { return new Promise((resolve,reject)=>{ if(!navigator.geolocation)return reject(new Error("Geolocation nicht unterstützt")); navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:false,timeout:12000,maximumAge:15*60*1000}); }); }
async function refreshWeather(showLoading = true) {
  if(showLoading){el.weatherButton.disabled=true;el.weatherButton.textContent="Wetter wird geladen …";el.weatherStatus.textContent="Standort wird abgefragt …";}
  try {
    const position=await getCurrentPosition(); const latitude=position.coords.latitude.toFixed(4); const longitude=position.coords.longitude.toFixed(4);
    const url="https://api.open-meteo.com/v1/forecast?latitude="+latitude+"&longitude="+longitude+"&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1";
    const response=await fetch(url,{headers:{"Accept":"application/json"}}); if(!response.ok)throw new Error("Wetterdienst HTTP "+response.status); const payload=await response.json();
    const data={current:payload.current?.temperature_2m,high:payload.daily?.temperature_2m_max?.[0],low:payload.daily?.temperature_2m_min?.[0],code:payload.current?.weather_code,updatedAt:new Date().toISOString()};
    if(![data.current,data.high,data.low].every(Number.isFinite))throw new Error("Unvollständige Wetterdaten"); localStorage.setItem(WEATHER_CACHE_KEY,JSON.stringify(data)); renderWeather(data);
  } catch(error) { console.warn("Wetter konnte nicht geladen werden",error); const cached=readWeatherCache(); renderWeather(cached); el.weatherStatus.textContent=cached?"Keine Aktualisierung möglich · letzter gespeicherter Stand":"Standort nicht freigegeben oder Wetterdienst nicht erreichbar."; }
  finally { el.weatherButton.disabled=false; }
}
function weatherIsStale(){const cached=readWeatherCache();return !cached||Date.now()-new Date(cached.updatedAt).getTime()>30*60*1000;}

function renderHomeWeek() {
  const monday = mondayOf(startOfToday());
  el.homeWeekStrip.innerHTML = "";
  for (let i = 0; i < 7; i++) {
    const date = addDays(monday, i);
    const data = getDayData(date);
    const open = data.tasks.filter(task => !task.done).length;
    const events = eventsForDate(date).length;
    const isToday = isoDate(date) === isoDate(startOfToday());
    const button = document.createElement("button");
    button.className = `home-week-day color-${i + 1}${isToday ? " today" : ""}`;
    button.setAttribute("aria-label", `${formatDate(date,{weekday:"long",day:"numeric",month:"long"})} öffnen`);
    button.innerHTML = `
      <span class="week-day-name">${escapeHtml(formatDate(date,{weekday:"short"}))}</span>
      <strong>${escapeHtml(formatDate(date,{day:"2-digit"}))}</strong>
      <span class="week-day-dots"><i title="${events} Termine">${events ? "●" : "○"}</i><i title="${open} Aufgaben">${open ? "★" : "☆"}</i></span>
      <small>${events}T · ${open}A</small>`;
    button.addEventListener("click", () => { selectedDate = date; currentView = "day"; render(); });
    el.homeWeekStrip.appendChild(button);
  }
  requestAnimationFrame(() => el.homeWeekStrip.querySelector(".today")?.scrollIntoView({inline:"center",block:"nearest"}));
}

function renderHome() {
  selectedDate = startOfToday();
  const data = getDayData(selectedDate);
  const hour = new Date().getHours();
  el.dateButton.textContent = "Heute";
  el.homeGreeting.textContent = hour < 11 ? "Guten Morgen, Tim" : hour < 18 ? "Hallo Tim" : "Guten Abend, Tim";
  el.homeDate.textContent = formatDate(selectedDate,{weekday:"long",day:"2-digit",month:"long",year:"numeric"});
  renderDailyQuote();
  renderWeather();
  renderHomeWeek();
  el.homePriority.textContent = data.priority || "Noch kein Tagesziel";
  const support = supportSuggestions(data);
  el.homeSupport.textContent = support.length ? support[0] : "Öffne den Tag und lege einen kleinen, konkreten Schritt fest.";

  const done = HABITS.filter(h => habitStatus(data.habits[h.id]) === "done").length;
  const relevant = HABITS.filter(h => habitStatus(data.habits[h.id]) !== "na").length || HABITS.length;
  el.homeCare.textContent = `${done} von ${relevant} erledigt`;
  el.homeCareBar.querySelector("span").style.width = `${Math.round(done/relevant*100)}%`;

  const events = eventsForDate(selectedDate).slice(0,4);
  el.homeEvents.innerHTML = "";
  el.homeEventsEmpty.hidden = events.length > 0;
  events.forEach(event => {
    const card = document.createElement("article");
    card.className = "calendar-event";
    card.innerHTML = `<div class="calendar-time">${escapeHtml(eventTimeLabel(event))}</div><div class="calendar-event-content"><strong>${escapeHtml(event.title)}</strong>${event.location?`<span>📍 ${escapeHtml(event.location)}</span>`:""}</div>`;
    el.homeEvents.appendChild(card);
  });

  const values = CHECKINS.map(c => data.checkin?.[c.id]).filter(v => Number.isFinite(v));
  el.homeCheckinCount.textContent = `${values.length}/${CHECKINS.length}`;
  el.homeCheckinSummary.innerHTML = "";
  CHECKINS.forEach(item => {
    const value = data.checkin?.[item.id];
    const metric = document.createElement("div");
    metric.className = "dashboard-metric";
    metric.innerHTML = `<span>${escapeHtml(item.label)}</span><strong>${value || "–"}${value?"/5":""}</strong>`;
    el.homeCheckinSummary.appendChild(metric);
  });

  const hasJournal = (data.journal || "").trim().length > 0;
  el.homeJournalTitle.textContent = hasJournal ? "Journal begonnen" : "Gedanken festhalten";
  el.homeJournalText.textContent = hasJournal ? "Dein Eintrag ist gespeichert. Du kannst ihn ergänzen oder eine Gefühlsreflexion erstellen." : "Ein paar freie Sätze reichen. Später erstellt der Planer daraus eine Gefühlsreflexion.";
}

function renderWeek() {
  const monday = mondayOf(selectedDate); const sunday = addDays(monday, 6);
  el.dateButton.textContent = `${formatDate(monday,{day:"2-digit",month:"2-digit"})} – ${formatDate(sunday,{day:"2-digit",month:"2-digit",year:"numeric"})}`;
  el.weekDays.innerHTML = "";
  for (let i=0; i<7; i++) {
    const date = addDays(monday, i); const data = getDayData(date);
    const open = data.tasks.filter(task => !task.done).length;
    const journal = (data.journal || "").trim().length > 0;
    const calendarCount = eventsForDate(date).length;
    const regulation = data.checkin?.regulation || data.checkin?.mood || null;
    const button = document.createElement("button");
    button.className = "day-card";
    if (isoDate(date) === isoDate(startOfToday())) button.classList.add("today");
    button.innerHTML = `
      <span class="day-date"><small>${escapeHtml(formatDate(date,{weekday:"short"}))}</small><strong>${escapeHtml(formatDate(date,{day:"2-digit"}))}</strong></span>
      <span class="day-info"><strong>${escapeHtml(data.priority || "Noch kein Tagesziel")}</strong><small>${open} offene Aufgabe${open===1?"":"n"}${calendarCount?` · ${calendarCount} Termin${calendarCount===1?"":"e"}`:""}${journal?" · Journal vorhanden":""}</small></span>
      <span class="day-badges">${regulation?`<span class="mood-pill" title="Emotionsregulation">Reg ${regulation}/5</span>`:""}<span class="day-count">${open}</span></span>`;
    button.addEventListener("click", () => { selectedDate = date; currentView = "day"; render(); });
    el.weekDays.appendChild(button);
  }
  const weekData = getWeekData(selectedDate);
  el.weeklyFocus.value = weekData.focus || "";
  renderWeekReflection(weekData.reflection);
}
function renderDay() {
  const data = getDayData(selectedDate);
  el.dateButton.textContent = formatDate(selectedDate,{weekday:"long",day:"2-digit",month:"long",year:"numeric"});
  el.dayHeading.textContent = formatDate(selectedDate,{weekday:"long",day:"2-digit",month:"long"});
  el.dayPriority.value = data.priority || "";
  el.journalText.value = data.journal || "";
  el.sleepHours.value = data.sleepHours ?? "";
  el.medicationState.value = data.medicationState || "";
  el.sideEffectsText.value = data.sideEffects || "";
  el.sideEffectsWrap.hidden = data.medicationState !== "side_effects";
  renderCalendarEvents();
  renderCheckins(data); renderBottlenecks(data); renderSupport(data); renderTasks(data); renderHabits(data); renderReflection(data.reflection);
}
function renderCheckins(data) {
  el.checkinGrid.innerHTML = "";
  let completed = 0;
  CHECKINS.forEach(item => {
    const value = Object.prototype.hasOwnProperty.call(data.checkin || {}, item.id) ? data.checkin[item.id] : legacyCheckinValue(data.checkin, item.id);
    if (value) completed++;
    const row = document.createElement("div"); row.className = "checkin-row";
    row.innerHTML = `<div class="checkin-label"><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.low)} ↔ ${escapeHtml(item.high)}</small></div><div class="rating-buttons"></div>`;
    const buttons = row.querySelector(".rating-buttons");
    for (let n=1;n<=5;n++) {
      const button = document.createElement("button");
      button.className = "rating-button";
      if (value === n) button.classList.add("selected", n<=2?"low":n===3?"mid":"high");
      button.textContent = n; button.type = "button";
      button.setAttribute("aria-label", `${item.label}: ${n} von 5, von ${item.low} bis ${item.high}`);
      button.addEventListener("click", () => {
        data.checkin = data.checkin || {};
        data.checkin[item.id] = value === n ? null : n;
        saveState(); renderCheckins(data); renderSupport(data);
      });
      buttons.appendChild(button);
    }
    el.checkinGrid.appendChild(row);
  });
  el.checkinStatus.textContent = completed === CHECKINS.length ? "vollständig" : `${completed}/${CHECKINS.length}`;
}
function legacyCheckinValue(checkin, id) {
  if (!checkin) return null;
  if (id === "regulation") return checkin.mood ?? null;
  if (id === "sensory") return checkin.calm ?? null;
  return null;
}
function renderBottlenecks(data) {
  el.bottleneckChips.innerHTML = "";
  BOTTLENECKS.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-chip" + (data.bottleneck === item.id ? " selected" : "");
    button.textContent = item.label;
    button.setAttribute("aria-pressed", data.bottleneck === item.id ? "true" : "false");
    button.addEventListener("click", () => {
      data.bottleneck = data.bottleneck === item.id ? "" : item.id;
      saveState(); renderBottlenecks(data); renderSupport(data);
    });
    el.bottleneckChips.appendChild(button);
  });
}
function habitStatus(value) {
  if (value === true || value === "done") return "done";
  if (value === "na") return "na";
  return "open";
}
function buildSupportSuggestions(data) {
  const c = data.checkin || {};
  const status = id => habitStatus(data.habits?.[id]);
  const suggestions = [];
  const add = text => { if (text && !suggestions.includes(text)) suggestions.push(text); };

  if (data.bottleneck === "food_water" || ((c.energy || 5) <= 2 && (status("food") !== "done" || status("water") !== "done"))) {
    add("Körper zuerst: Stell Wasser sichtbar hin und wähle etwas leicht erreichbares zu essen. Danach erst neu entscheiden, was heute realistisch ist.");
  }
  if (data.bottleneck === "tired" || (c.sleep || 5) <= 2) {
    add("Behandle geringe Schlaf-Erholung als echte Belastung: Anforderungen verkleinern, einen Puffer einplanen und den Schlafverlauf über mehrere Tage beobachten.");
  }
  if (data.bottleneck === "start" || (c.activation || 5) <= 2) {
    add("Mach nur den Start sichtbar: Formuliere eine Handlung unter zwei Minuten und stelle einen Timer auf zehn Minuten. Danach darfst du neu entscheiden.");
  }
  if (data.bottleneck === "unclear") {
    add("Schreibe einen Satz: „Fertig bedeutet heute …“. Leite daraus nur den allerersten sichtbaren Arbeitsschritt ab.");
  }
  if (data.bottleneck === "distraction" || (c.focus || 5) <= 2) {
    add("Entlaste die Fokussteuerung: nur eine Aufgabe sichtbar, Benachrichtigungen weg und ein kurzer, klar begrenzter Arbeitsblock.");
  }
  if (data.bottleneck === "sensory" || (c.sensory || 5) <= 2) {
    add("Reduziere Reize, bevor du mehr Disziplin verlangst: Licht oder Lärm senken, Kopfhörer nutzen oder drei Minuten den Raum wechseln.");
  }
  if (data.bottleneck === "emotion" || (c.regulation || legacyCheckinValue(c,"regulation") || 5) <= 2) {
    add("Benenne zuerst statt zu lösen: „Ich fühle …, ausgelöst durch …, und brauche gerade …“. Verschiebe große Entscheidungen, bis die Intensität etwas gesunken ist.");
  }
  if (data.bottleneck === "time") {
    add("Bei Zeitdruck: Teile in „muss heute“, „wäre gut“ und „parken“. Wähle genau eine nächste Handlung aus der ersten Kategorie.");
  }
  if (data.medicationState === "side_effects" || data.medicationState === "weak_unclear") {
    add("Notiere Zeitpunkt, Wirkung und Auffälligkeit möglichst konkret. Bei anhaltenden oder starken Beschwerden ärztlich rückmelden; Einnahme oder Dosis nicht selbst verändern.");
  }
  if (!suggestions.length && data.bottleneck === "none") {
    add("Dein System wirkt heute vergleichsweise tragfähig. Schütze das, indem du trotzdem nur einen klaren nächsten Schritt gleichzeitig sichtbar hältst.");
  }
  if (!suggestions.length) {
    add("Wähle nicht den wichtigsten Schritt deines ganzen Tages, sondern den kleinsten Schritt, der die nächsten zehn Minuten leichter macht.");
  }
  return suggestions.slice(0, 2);
}
function renderSupport(data) {
  const suggestions = buildSupportSuggestions(data);
  el.adhdSupportBox.innerHTML = `<strong>Jetzt hilfreich</strong><ul>${suggestions.map(text => `<li>${escapeHtml(text)}</li>`).join("")}</ul>`;
}

function normalizeCalendarEvent(event) {
  if (!event || !event.start || !event.title) return null;
  return {
    id: String(event.id || `${event.start}-${event.title}`),
    title: String(event.title),
    start: String(event.start),
    end: event.end ? String(event.end) : "",
    allDay: !!event.allDay,
    location: String(event.location || ""),
    notes: String(event.notes || "")
  };
}
function eventLocalDateKey(event) {
  if (event.allDay && /^\d{4}-\d{2}-\d{2}/.test(event.start)) return event.start.slice(0,10);
  const d = new Date(event.start);
  return Number.isNaN(d.getTime()) ? event.start.slice(0,10) : isoDate(d);
}
function eventsForDate(date) {
  const key = isoDate(date);
  return (state.calendarEvents || []).filter(event => eventLocalDateKey(event) === key)
    .sort((a,b) => (a.start || "").localeCompare(b.start || ""));
}
function eventTimeLabel(event) {
  if (event.allDay) return "Ganztägig";
  const start = new Date(event.start); const end = event.end ? new Date(event.end) : null;
  if (Number.isNaN(start.getTime())) return "";
  const fmt = d => new Intl.DateTimeFormat("de-DE",{hour:"2-digit",minute:"2-digit"}).format(d);
  return end && !Number.isNaN(end.getTime()) ? `${fmt(start)}–${fmt(end)} Uhr` : `${fmt(start)} Uhr`;
}
function renderCalendarEvents() {
  const events = eventsForDate(selectedDate);
  el.calendarEventList.innerHTML = "";
  const enabled = !!state.settings.calendarEnabled;
  if (!enabled && !(state.calendarEvents || []).length) {
    el.calendarStatus.textContent = "Noch kein Kalender verbunden. Öffne die Einstellungen oder importiere testweise eine ICS-Datei.";
    return;
  }
  const last = state.calendarLastSync ? new Date(state.calendarLastSync) : null;
  el.calendarStatus.textContent = events.length
    ? `${events.length} Termin${events.length===1?"":"e"}${last && !Number.isNaN(last.getTime()) ? ` · zuletzt aktualisiert ${new Intl.DateTimeFormat("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}).format(last)}` : ""}`
    : `Keine Termine an diesem Tag${last && !Number.isNaN(last.getTime()) ? ` · zuletzt aktualisiert ${new Intl.DateTimeFormat("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}).format(last)}` : ""}.`;
  events.forEach(event => {
    const card = document.createElement("article"); card.className = "calendar-event";
    card.innerHTML = `<div class="calendar-time">${escapeHtml(eventTimeLabel(event))}</div><div class="calendar-event-content"><strong>${escapeHtml(event.title)}</strong>${event.location?`<span>📍 ${escapeHtml(event.location)}</span>`:""}${event.notes?`<small>${escapeHtml(event.notes)}</small>`:""}</div>`;
    el.calendarEventList.appendChild(card);
  });
}
async function syncCalendar(showResult = false) {
  const endpoint = (state.settings.calendarEndpoint || "").trim().replace(/\/$/,"");
  const accessKey = localStorage.getItem(CALENDAR_KEY_STORAGE) || "";
  if (!state.settings.calendarEnabled || !endpoint) {
    if (showResult) el.calendarTestResult.textContent = "Aktiviere den Kalender und trage den Worker-Endpunkt ein.";
    renderCalendarEvents(); return false;
  }
  if (!accessKey) { if (showResult) el.calendarTestResult.textContent = "Trage zusätzlich deinen privaten Zugriffsschlüssel ein."; return false; }
  if (showResult) el.calendarTestResult.textContent = "Kalender wird geladen …";
  else el.calendarStatus.textContent = "Kalender wird aktualisiert …";
  try {
    const separator = endpoint.includes("?") ? "&" : "?";
    const response = await fetch(endpoint + "/calendar" + separator + "fresh=" + Date.now(), {headers:{"Accept":"application/json","Authorization":`Bearer ${accessKey}`},cache:"no-store"});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload.events)) throw new Error("Ungültige Kalenderantwort");
    state.calendarEvents = payload.events.map(normalizeCalendarEvent).filter(Boolean);
    state.calendarLastSync = new Date().toISOString();
    saveState(); render();
    if (showResult) el.calendarTestResult.textContent = `${state.calendarEvents.length} Termine aus deinen privaten iCloud-Kalendern geladen.`;
    return true;
  } catch (error) {
    console.warn("Kalender konnte nicht geladen werden", error);
    if (showResult) el.calendarTestResult.textContent = error.message === "HTTP 401" ? "Zugriffsschlüssel stimmt nicht." : "Keine Verbindung. Prüfe Worker-Adresse und Cloudflare-Secrets.";
    else el.calendarStatus.textContent = "Kalender konnte nicht aktualisiert werden. Gespeicherte Termine bleiben sichtbar.";
    return false;
  }
}
function unfoldIcs(text) { return text.replace(/\r?\n[ \t]/g, ""); }
function parseIcsDate(raw) {
  const value = raw.split(":").slice(1).join(":").trim();
  const allDay = /^\d{8}$/.test(value);
  if (allDay) return { value:`${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}`, allDay:true };
  const m = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?$/);
  if (!m) return {value,allDay:false};
  const iso = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]||"00"}${m[7]?"Z":""}`;
  return {value:iso,allDay:false};
}
function unescapeIcs(value="") { return value.replace(/\\n/gi,"\n").replace(/\\,/g,",").replace(/\\;/g,";").replace(/\\\\/g,"\\"); }
function parseIcsEvents(text) {
  const source = unfoldIcs(text); const blocks = source.split("BEGIN:VEVENT").slice(1).map(x=>x.split("END:VEVENT")[0]);
  return blocks.map((block,index)=>{
    const lines=block.split(/\r?\n/); const find=prefix=>lines.find(line=>line.startsWith(prefix));
    const startLine=find("DTSTART"); const endLine=find("DTEND"); const titleLine=find("SUMMARY:");
    if(!startLine||!titleLine)return null;
    const start=parseIcsDate(startLine); const end=endLine?parseIcsDate(endLine):null;
    return normalizeCalendarEvent({id:(find("UID:")||`UID:import-${index}`).slice(4),title:unescapeIcs(titleLine.slice(8)),start:start.value,end:end?.value||"",allDay:start.allDay,location:unescapeIcs((find("LOCATION:")||"LOCATION:").slice(9)),notes:unescapeIcs((find("DESCRIPTION:")||"DESCRIPTION:").slice(12))});
  }).filter(Boolean);
}

function renderTasks(data) {
  el.taskList.innerHTML = "";
  const sorted = [...data.tasks].sort((a,b) => Number(a.done)-Number(b.done) || (a.time||"99:99").localeCompare(b.time||"99:99"));
  sorted.forEach(task => {
    const node = el.taskTemplate.content.cloneNode(true);
    const article = node.querySelector(".task-item"); article.classList.toggle("done", !!task.done);
    node.querySelector(".task-title").textContent = task.title;
    node.querySelector(".task-meta").textContent = [task.time, categoryLabel(task.category)].filter(Boolean).join(" · ");
    node.querySelector(".check-button").addEventListener("click", () => { task.done = !task.done; saveState(); renderTasks(data); });
    node.querySelector(".edit-button").addEventListener("click", () => openTaskDialog(task));
    node.querySelector(".delete-button").addEventListener("click", () => { data.tasks = data.tasks.filter(item => item.id !== task.id); saveState(); renderTasks(data); });
    el.taskList.appendChild(node);
  });
  const open = data.tasks.filter(task => !task.done).length;
  el.taskCounter.textContent = `${open} offen`;
  el.emptyTasks.hidden = data.tasks.length > 0;
}
function renderHabits(data) {
  el.habitList.innerHTML = "";
  let doneCount = 0, naCount = 0;
  let currentGroup = "";
  HABITS.forEach(habit => {
    if (habit.group !== currentGroup) {
      currentGroup = habit.group;
      const heading = document.createElement("div"); heading.className = "habit-group"; heading.textContent = currentGroup;
      el.habitList.appendChild(heading);
    }
    const status = habitStatus(data.habits?.[habit.id]);
    if (status === "done") doneCount++;
    if (status === "na") naCount++;
    const item = document.createElement("div");
    item.className = `habit-item ${status}`;
    item.innerHTML = `<div class="habit-copy"><strong>${escapeHtml(habit.label)}</strong><small>${escapeHtml(habit.hint)}</small></div><div class="habit-actions"><button type="button" class="habit-action done-action" aria-label="${escapeHtml(habit.label)} erledigt" aria-pressed="${status === "done"}">✓</button><button type="button" class="habit-action na-action" aria-label="${escapeHtml(habit.label)} heute nicht relevant" aria-pressed="${status === "na"}">–</button></div>`;
    item.querySelector(".done-action").addEventListener("click", () => {
      data.habits = data.habits || {};
      data.habits[habit.id] = status === "done" ? "open" : "done";
      saveState(); renderHabits(data); renderSupport(data);
    });
    item.querySelector(".na-action").addEventListener("click", () => {
      data.habits = data.habits || {};
      data.habits[habit.id] = status === "na" ? "open" : "na";
      saveState(); renderHabits(data); renderSupport(data);
    });
    el.habitList.appendChild(item);
  });
  const openCount = HABITS.length - doneCount - naCount;
  el.habitCounter.textContent = `${doneCount} erledigt · ${openCount} offen`;
}
function categoryLabel(category) {
  return {schule:"Schule",termin:"Termin",privat:"Privat",gesundheit:"Gesundheit",erholung:"Erholung"}[category] || "";
}
function openTaskDialog(task=null) {
  el.taskForm.reset(); el.taskDialogTitle.textContent = task ? "Aufgabe bearbeiten" : "Neue Aufgabe";
  el.taskId.value = task?.id || ""; el.taskTitle.value = task?.title || ""; el.taskTime.value = task?.time || ""; el.taskCategory.value = task?.category || "schule";
  el.taskDialog.showModal(); setTimeout(() => el.taskTitle.focus(), 50);
}
function switchView(view) { currentView = view; render(); }
function navigate(direction) { selectedDate = addDays(selectedDate, currentView === "week" ? direction*7 : direction); render(); }

function normalize(text) { return text.toLocaleLowerCase("de-DE").normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
function countMatches(text, patterns) {
  const source = normalize(text);
  return patterns.reduce((total, pattern) => {
    const needle = normalize(pattern); let pos=0, count=0;
    while ((pos = source.indexOf(needle, pos)) !== -1) { count++; pos += Math.max(needle.length,1); }
    return total + count;
  }, 0);
}
function sentenceSplit(text) {
  return text.replace(/\s+/g," ").trim().split(/(?<=[.!?])\s+|\n+/).map(s=>s.trim()).filter(Boolean);
}
function emotionScores(text, context={}) {
  const checkin = context.checkin || context;
  const scores = EMOTIONS.map(emotion => ({...emotion, score: countMatches(text, emotion.patterns)}));
  if ((checkin.regulation || checkin.mood || 5) <= 2) { const stress=scores.find(x=>x.id==="stress"); if(stress) stress.score += 1; }
  if ((checkin.sensory || checkin.calm || 5) <= 2) { const stress=scores.find(x=>x.id==="stress"); if(stress) stress.score += 1; }
  if ((checkin.energy || 5) <= 2 || (checkin.activation || 5) <= 2 || (checkin.sleep || 5) <= 2) { const over=scores.find(x=>x.id==="ueberforderung"); if(over) over.score += 1; }
  return scores.sort((a,b)=>b.score-a.score);
}
function extractiveSummary(text, emotions) {
  const sentences = sentenceSplit(text);
  if (!sentences.length) return "";
  if (sentences.length <= 2) return sentences.join(" ");
  const emotionWords = emotions.flatMap(e => e.patterns).map(normalize);
  const scored = sentences.map((sentence,index) => {
    const n = normalize(sentence); let score = 0;
    emotionWords.forEach(word => { if (n.includes(word)) score += 2; });
    if (sentence.length >= 45 && sentence.length <= 220) score += 1;
    if (index === 0 || index === sentences.length-1) score += .5;
    if (/ich (habe|bin|fühle|fuehle|merke|will|brauche)/i.test(sentence)) score += 1;
    return {sentence,index,score};
  }).sort((a,b)=>b.score-a.score || a.index-b.index);
  const selected = scored.slice(0, Math.min(3, sentences.length)).sort((a,b)=>a.index-b.index).map(x=>x.sentence);
  return selected.join(" ");
}
function detectPatterns(text, context={}) {
  const found = PATTERNS.filter(pattern => pattern.test(normalize(text))).map(pattern => pattern.label);
  const c = context.checkin || context;
  if ((c.activation || 5) <= 2) found.push("deutliche Startbarriere");
  if ((c.focus || 5) <= 2) found.push("erschwerte Fokussteuerung");
  if ((c.sensory || c.calm || 5) <= 2) found.push("hohe Reizbelastung");
  if ((c.regulation || c.mood || 5) <= 2) found.push("Gefühle waren schwerer steuerbar");
  if ((c.sleep || 5) <= 2) found.push("geringe Schlaf-Erholung als möglicher Belastungsfaktor");
  return [...new Set(found)].slice(0,5);
}
function reflectionContext(data) {
  return { checkin:data.checkin || {}, bottleneck:data.bottleneck || "", sleepHours:data.sleepHours || "", medicationState:data.medicationState || "", care:data.habits || {} };
}
function localReflection(text, context={}) {
  const ranked = emotionScores(text, context);
  let emotions = ranked.filter(item => item.score > 0).slice(0,3);
  if (!emotions.length) emotions = [{id:"unklar",label:"noch nicht eindeutig benennbare Gefühle",score:1,patterns:[]}];
  const patterns = detectPatterns(text, context);
  const top = emotions[0]?.id;
  const question = QUESTION_BY_EMOTION[top] || "Welcher Moment aus deinem Eintrag verdient noch etwas mehr Aufmerksamkeit – und was brauchst du dabei?";
  return {
    mode: "local",
    createdAt: new Date().toISOString(),
    summary: extractiveSummary(text, emotions),
    emotions: emotions.map(e=>e.label),
    patterns: patterns.length ? patterns : ["Im Text ist noch kein eindeutiges wiederkehrendes Muster erkennbar."],
    question
  };
}
async function createReflection() {
  const data = getDayData(selectedDate); const text = (data.journal || "").trim();
  if (text.length < 20) { alert("Schreib bitte zunächst ein paar vollständige Gedanken auf."); return; }
  setReflectionLoading(true);
  try {
    let reflection;
    const context = reflectionContext(data);
    if (state.settings.aiEnabled && state.settings.aiEndpoint) {
      reflection = await requestAiReflection(text, context);
      reflection.mode = "ai"; reflection.createdAt = new Date().toISOString();
    } else {
      await new Promise(resolve => setTimeout(resolve, 300));
      reflection = localReflection(text, context);
    }
    data.reflection = reflection; saveState(); renderReflection(reflection);
  } catch (error) {
    console.error(error);
    const fallback = localReflection(text, reflectionContext(data));
    fallback.notice = "Der KI-Endpunkt war nicht erreichbar. Deshalb wurde die private Offline-Auswertung verwendet.";
    data.reflection = fallback; saveState(); renderReflection(fallback);
  } finally { setReflectionLoading(false); }
}
async function requestAiReflection(entry, checkin) {
  const endpoint = state.settings.aiEndpoint.replace(/\/$/, "");
  const response = await fetch(endpoint, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({entry,checkin,date:isoDate(selectedDate)}) });
  if (!response.ok) throw new Error(`KI-Endpunkt: ${response.status}`);
  const result = await response.json();
  if (!result || typeof result.summary !== "string" || !Array.isArray(result.emotions) || typeof result.question !== "string") throw new Error("Ungültige Antwort des KI-Endpunkts");
  return { summary: result.summary, emotions: result.emotions.slice(0,5), patterns: Array.isArray(result.patterns)?result.patterns.slice(0,5):[], question: result.question };
}
function setReflectionLoading(loading) {
  el.createReflectionButton.disabled = loading;
  el.createReflectionButton.textContent = loading ? "Reflexion wird erstellt …" : "Gefühlsreflexion erstellen";
  if (loading) el.reflectionOutput.innerHTML = `<span class="loading-line"><span class="loading-dot"></span>Deine Gedanken werden behutsam ausgewertet.</span>`;
}
function renderReflection(reflection) {
  el.clearReflectionButton.hidden = !reflection;
  if (!reflection) {
    el.reflectionOutput.className = "reflection-placeholder";
    el.reflectionOutput.textContent = "Nach der Auswertung siehst du eine kurze Zusammenfassung, mögliche Gefühle, erkannte Muster und eine Reflexionsfrage.";
    return;
  }
  const mode = reflection.mode === "ai" ? "KI-Auswertung über deinen eigenen Endpunkt" : "Private Offline-Auswertung";
  const emotions = (reflection.emotions || []).map(e=>`<span class="emotion-chip">${escapeHtml(e)}</span>`).join("");
  const patterns = (reflection.patterns || []).map(p=>`<li>${escapeHtml(p)}</li>`).join("");
  el.reflectionOutput.className = "reflection-box";
  el.reflectionOutput.innerHTML = `
    ${reflection.notice?`<div class="reflection-section"><strong>Hinweis:</strong> ${escapeHtml(reflection.notice)}</div>`:""}
    <div class="reflection-section"><h3>Kurze Zusammenfassung</h3><div>${escapeHtml(reflection.summary || "Keine Zusammenfassung verfügbar.")}</div></div>
    <div class="reflection-section"><h3>Mögliche Gefühle</h3><div class="emotion-chips">${emotions}</div></div>
    <div class="reflection-section"><h3>Erkennbare Muster oder Bedürfnisse</h3><ul class="pattern-list">${patterns}</ul></div>
    <div class="reflection-section"><h3>Eine Frage für dich</h3><div class="question-box">${escapeHtml(reflection.question)}</div></div>
    <div class="reflection-section"><small>${escapeHtml(mode)}</small></div>`;
}
function averageMetric(entries, id, legacyId="") {
  const values = entries.map(x => x.data.checkin?.[id] ?? (legacyId ? x.data.checkin?.[legacyId] : null)).filter(v => Number.isFinite(Number(v))).map(Number);
  return values.length ? (values.reduce((a,b)=>a+b,0)/values.length).toFixed(1) : null;
}
function createWeeklyReflection() {
  const monday = mondayOf(selectedDate); const entries = [];
  for (let i=0;i<7;i++) {
    const date=addDays(monday,i); const data=getDayData(date);
    const hasCheckin = Object.values(data.checkin || {}).some(Boolean);
    if ((data.journal||"").trim() || data.tasks.length || hasCheckin) entries.push({date,data});
  }
  if (!entries.length) { alert("In dieser Woche sind noch keine Einträge vorhanden."); return; }
  const taskTotal = entries.reduce((n,x)=>n+x.data.tasks.length,0);
  const taskDone = entries.reduce((n,x)=>n+x.data.tasks.filter(t=>t.done).length,0);
  const energyAverage = averageMetric(entries,"energy");
  const activationAverage = averageMetric(entries,"activation");
  const regulationAverage = averageMetric(entries,"regulation","mood");
  const sleepAverage = averageMetric(entries,"sleep");
  let careDone=0, careRelevant=0;
  entries.forEach(x => HABITS.forEach(h => { const s=habitStatus(x.data.habits?.[h.id]); if(s!=="na") careRelevant++; if(s==="done") careDone++; }));
  const bottleneckCounts = {};
  entries.forEach(x => { if(x.data.bottleneck && x.data.bottleneck!=="none") bottleneckCounts[x.data.bottleneck]=(bottleneckCounts[x.data.bottleneck]||0)+1; });
  const topBottleneckId = Object.entries(bottleneckCounts).sort((a,b)=>b[1]-a[1])[0]?.[0];
  const topBottleneck = BOTTLENECKS.find(x=>x.id===topBottleneckId)?.label;
  const emotionCounts = {};
  entries.forEach(x => (x.data.reflection?.emotions || []).forEach(e => emotionCounts[e]=(emotionCounts[e]||0)+1));
  const common = Object.entries(emotionCounts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0]);
  const summaries = entries.map(x=>x.data.reflection?.summary).filter(Boolean).slice(-3);
  const parts = [];
  if (energyAverage) parts.push(`Energie Ø ${energyAverage}/5`);
  if (activationAverage) parts.push(`Startfähigkeit Ø ${activationAverage}/5`);
  if (regulationAverage) parts.push(`Emotionsregulation Ø ${regulationAverage}/5`);
  if (sleepAverage) parts.push(`Schlaf-Erholung Ø ${sleepAverage}/5`);
  const reflection = {
    createdAt:new Date().toISOString(),
    text:`Diese Woche hast du ${taskDone} von ${taskTotal} eingetragenen Aufgaben erledigt.${parts.length?` Im Check-in: ${parts.join(" · ")}.`:""}${careRelevant?` Bei der Grundversorgung waren ${careDone} von ${careRelevant} relevanten Punkten als erledigt markiert.`:""}${topBottleneck?` Am häufigsten genannt: ${topBottleneck}.`:""}${common.length?` In den Journalreflexionen tauchten wiederholt ${joinGerman(common)} auf.`:""}`,
    summaries,
    question: topBottleneck ? `Was hat den Engpass „${topBottleneck}“ verstärkt – und welche Unterstützung hat an besseren Tagen einen Unterschied gemacht?` : "Welche Kombination aus Umgebung, Grundversorgung und Aufgabe hat dir an einem guten Tag geholfen?"
  };
  getWeekData(selectedDate).reflection = reflection; saveState(); renderWeekReflection(reflection);
}
function renderWeekReflection(reflection) {
  if (!reflection) { el.weekReflection.className="reflection-placeholder"; el.weekReflection.textContent="Am Ende der Woche kannst du Energie, Startfähigkeit, Reizlast, Grundversorgung und Journalreflexionen gemeinsam betrachten."; return; }
  el.weekReflection.className="reflection-box";
  el.weekReflection.innerHTML = `<div class="reflection-section"><h3>Wochenbild</h3><div>${escapeHtml(reflection.text)}</div></div>${reflection.summaries?.length?`<div class="reflection-section"><h3>Prägende Gedanken</h3><ul class="pattern-list">${reflection.summaries.map(s=>`<li>${escapeHtml(s)}</li>`).join("")}</ul></div>`:""}<div class="reflection-section"><h3>Frage für den Rückblick</h3><div class="question-box">${escapeHtml(reflection.question)}</div></div>`;
}
function joinGerman(items) { if(items.length<=1) return items[0]||""; return items.slice(0,-1).join(", ")+" und "+items.at(-1); }

el.homeOpenDay.addEventListener("click",()=>{selectedDate=startOfToday();switchView("day");});
el.homeQuickTask.addEventListener("click",()=>{selectedDate=startOfToday();openTaskDialog();});
el.homeOpenJournal.addEventListener("click",()=>{selectedDate=startOfToday();switchView("day");setTimeout(()=>el.journalText.focus(),80);});
el.homeRefreshCalendar.addEventListener("click",()=>syncCalendar(false));
el.weatherButton.addEventListener("click",()=>refreshWeather(true));
el.previousButton.addEventListener("click",()=>navigate(-1));
el.nextButton.addEventListener("click",()=>navigate(1));
el.dateButton.addEventListener("click",()=>{selectedDate=startOfToday();render();});
el.homeTab.addEventListener("click",()=>switchView("home"));
el.weekTab.addEventListener("click",()=>switchView("week"));
el.dayTab.addEventListener("click",()=>switchView("day"));
el.weeklyFocus.addEventListener("input",()=>{getWeekData(selectedDate).focus=el.weeklyFocus.value;saveState();});
el.dayPriority.addEventListener("input",()=>{getDayData(selectedDate).priority=el.dayPriority.value;saveState();});
el.sleepHours.addEventListener("input",()=>{const data=getDayData(selectedDate);data.sleepHours=el.sleepHours.value;saveState();});
el.medicationState.addEventListener("change",()=>{const data=getDayData(selectedDate);data.medicationState=el.medicationState.value;if(data.medicationState!=="side_effects")data.sideEffects="";el.sideEffectsWrap.hidden=data.medicationState!=="side_effects";el.sideEffectsText.value=data.sideEffects||"";saveState();renderSupport(data);});
el.sideEffectsText.addEventListener("input",()=>{const data=getDayData(selectedDate);data.sideEffects=el.sideEffectsText.value;saveState();});
el.refreshCalendarButton.addEventListener("click",()=>syncCalendar(false));
el.journalText.addEventListener("input",()=>{const data=getDayData(selectedDate);data.journal=el.journalText.value;data.reflection=null;renderReflection(null);markJournalSaving();});
el.createReflectionButton.addEventListener("click",createReflection);
el.clearReflectionButton.addEventListener("click",()=>{const data=getDayData(selectedDate);data.reflection=null;saveState();renderReflection(null);});
el.createWeekReflection.addEventListener("click",createWeeklyReflection);
el.addTaskButton.addEventListener("click",()=>openTaskDialog());
el.closeTaskDialog.addEventListener("click",()=>el.taskDialog.close());
el.taskForm.addEventListener("submit",event=>{
  event.preventDefault(); const title=el.taskTitle.value.trim(); if(!title)return;
  const data=getDayData(selectedDate); const existing=data.tasks.find(t=>t.id===el.taskId.value);
  if(existing){existing.title=title;existing.time=el.taskTime.value;existing.category=el.taskCategory.value;}
  else data.tasks.push({id:crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`,title,time:el.taskTime.value,category:el.taskCategory.value,done:false});
  saveState();el.taskDialog.close();renderTasks(data);
});

el.settingsButton.addEventListener("click",()=>{el.calendarEnabled.checked=!!state.settings.calendarEnabled;el.calendarEndpoint.value=state.settings.calendarEndpoint||"";el.calendarAccessKey.value=localStorage.getItem(CALENDAR_KEY_STORAGE)||"";el.calendarTestResult.textContent="";el.aiEnabled.checked=!!state.settings.aiEnabled;el.aiEndpoint.value=state.settings.aiEndpoint||"";el.aiTestResult.textContent="";el.settingsDialog.showModal();});
el.closeSettingsDialog.addEventListener("click",()=>el.settingsDialog.close());

el.calendarEnabled.addEventListener("change",()=>{state.settings.calendarEnabled=el.calendarEnabled.checked;saveState();});
el.calendarEndpoint.addEventListener("change",()=>{state.settings.calendarEndpoint=el.calendarEndpoint.value.trim();saveState();});
el.calendarAccessKey.addEventListener("change",()=>{localStorage.setItem(CALENDAR_KEY_STORAGE,el.calendarAccessKey.value.trim());});
el.testCalendarButton.addEventListener("click",async()=>{state.settings.calendarEnabled=el.calendarEnabled.checked;state.settings.calendarEndpoint=el.calendarEndpoint.value.trim();localStorage.setItem(CALENDAR_KEY_STORAGE,el.calendarAccessKey.value.trim());saveState();await syncCalendar(true);});
el.calendarImportInput.addEventListener("change",async event=>{const file=event.target.files?.[0];if(!file)return;try{const events=parseIcsEvents(await file.text());state.calendarEvents=events;state.calendarLastSync=new Date().toISOString();saveState();el.calendarTestResult.textContent=`${events.length} Termine aus der ICS-Datei importiert.`;render();}catch(error){el.calendarTestResult.textContent="Die ICS-Datei konnte nicht gelesen werden.";}finally{event.target.value="";}});
el.aiEnabled.addEventListener("change",()=>{state.settings.aiEnabled=el.aiEnabled.checked;saveState();});
el.aiEndpoint.addEventListener("change",()=>{state.settings.aiEndpoint=el.aiEndpoint.value.trim();saveState();});
el.testAiButton.addEventListener("click",async()=>{
  state.settings.aiEndpoint=el.aiEndpoint.value.trim(); state.settings.aiEnabled=el.aiEnabled.checked; saveState();
  if(!state.settings.aiEndpoint){el.aiTestResult.textContent="Bitte zuerst einen Endpunkt eintragen.";return;}
  el.aiTestResult.textContent="Verbindung wird getestet …";
  try { const response=await fetch(state.settings.aiEndpoint.replace(/\/$/,"")+"/health"); if(!response.ok)throw new Error(); el.aiTestResult.textContent="Verbindung erfolgreich."; }
  catch { el.aiTestResult.textContent="Keine Verbindung. Die Offline-Auswertung bleibt weiterhin nutzbar."; }
});
window.addEventListener("beforeinstallprompt",event=>{event.preventDefault();deferredInstallPrompt=event;el.installButton.hidden=false;});
el.installButton.addEventListener("click",async()=>{if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;el.installButton.hidden=true;});
el.exportButton.addEventListener("click",()=>{
  saveState(); const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}); const url=URL.createObjectURL(blob); const link=document.createElement("a");
  link.href=url;link.download=`tageskompass-backup-${isoDate(startOfToday())}.json`;link.click();URL.revokeObjectURL(url);
});
el.importInput.addEventListener("change",async event=>{
  const file=event.target.files?.[0];if(!file)return;
  try { const imported=JSON.parse(await file.text()); if(!imported.days||!imported.weeks)throw new Error(); Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,defaultState(),imported);saveState();render();el.settingsDialog.close(); }
  catch { alert("Die Backup-Datei konnte nicht gelesen werden."); }
  finally { event.target.value=""; }
});
el.clearButton.addEventListener("click",()=>{if(!confirm("Wirklich alle Aufgaben, Check-ins und Journaleinträge auf diesem Gerät löschen?"))return;localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(CALENDAR_KEY_STORAGE);location.reload();});

if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(console.warn));}
render();
if (weatherIsStale()) setTimeout(()=>refreshWeather(false),450);
if (state.settings.calendarEnabled && state.settings.calendarEndpoint) syncCalendar(false);

function calendarIsStale(){if(!state.calendarLastSync)return true;const last=new Date(state.calendarLastSync).getTime();return !Number.isFinite(last)||Date.now()-last>15*60*1000;}
function refreshLiveData(){if(weatherIsStale())refreshWeather(false);if(state.settings.calendarEnabled&&state.settings.calendarEndpoint&&calendarIsStale())syncCalendar(false);}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")refreshLiveData();});
window.addEventListener("focus",refreshLiveData);
window.addEventListener("online",refreshLiveData);
