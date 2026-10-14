const records = [
  {title:"Field observation report", date:"18 SEPTEMBER 2026", tag:"FIELD REPORT"},
  {title:"Radar tracking summary", date:"12 SEPTEMBER 2026", tag:"RADAR DATA"},
  {title:"Photographic evidence", date:"04 SEPTEMBER 2026", tag:"IMAGE RECORD"},
  {title:"Witness statement", date:"29 AUGUST 2026", tag:"TESTIMONY"},
  {title:"Flight path analysis", date:"21 AUGUST 2026", tag:"FLIGHT ANALYSIS"},
  {title:"Technical memorandum", date:"18 SEPTEMBER 2026", tag:"MEMORANDUM"}
];
let selected = 0;
const filmstrip = document.querySelector("#filmstrip");
const progress = document.querySelector("#recordProgress");
const page = document.querySelector("#documentPage");
const dialog = document.querySelector("#recordDialog");

function drawGallery() {
  filmstrip.innerHTML = "";
  records.forEach((record, i) => {
    const b = document.createElement("button");
    b.className = "thumb" + (i === selected ? " selected" : "");
    b.setAttribute("aria-label", `Select record ${i + 1}: ${record.title}`);
    b.innerHTML = `<span class="mini-doc">${"<i></i>".repeat(5)}</span>`;
    b.addEventListener("click", () => selectRecord(i));
    filmstrip.appendChild(b);
  });
  progress.innerHTML = "";
  records.forEach((record, i) => {
    const b = document.createElement("button");
    b.className = i === selected ? "active" : "";
    b.setAttribute("aria-label", `Go to record ${i + 1}`);
    b.addEventListener("click", () => selectRecord(i));
    progress.appendChild(b);
  });
  page.querySelector(".doc-top").textContent = `U.S. GOVERNMENT • ${records[selected].tag}`;
  page.querySelector(".doc-paragraph").innerHTML = `REPORT OF OBSERVATION<br>REFERENCE: UAP / FIELD ARCHIVE<br>DATE: ${records[selected].date}`;
}
function selectRecord(i) {
  selected = (i + records.length) % records.length;
  drawGallery();
}
document.querySelector("#prevRecord").addEventListener("click", () => selectRecord(selected - 1));
document.querySelector("#nextRecord").addEventListener("click", () => selectRecord(selected + 1));
document.querySelector("#openRecord").addEventListener("click", openRecord);
function openRecord() {
  document.querySelector("#dialogNumber").textContent = `RECORD ${String(selected + 1).padStart(2,"0")} / 06`;
  document.querySelector("#dialogTitle").textContent = records[selected].title;
  const doc = document.querySelector("#dialogDocument");
  doc.innerHTML = `<div style="text-align:center;margin-bottom:20px">UNITED STATES GOVERNMENT<br>DECLASSIFIED RECORD</div><div class="doc-line wide"></div><div class="doc-line"></div><div class="doc-line mid"></div><div class="doc-paragraph">RECORD TYPE: ${records[selected].tag}<br>ARCHIVE DATE: ${records[selected].date}<br>REFERENCE: PURSUE / UAP</div><div class="doc-line wide"></div><div class="doc-line"></div><div class="doc-line wide"></div><div class="doc-line mid"></div><div class="doc-line wide"></div><div class="doc-line"></div><div class="doc-line mid"></div><div style="margin-top:auto;text-align:right">PUBLIC RELEASE COPY</div>`;
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}
document.querySelector("#closeDialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });
document.querySelectorAll("[data-record]").forEach(b => b.addEventListener("click", () => {
  selectRecord(Number(b.dataset.record));
  openRecord();
}));
document.querySelector("#downloadRecord").addEventListener("click", () => {
  const r = records[selected];
  const summary = `PURSUE — EDUCATIONAL SAMPLE RECORD\nRecord: ${selected + 1} / 6\nTitle: ${r.title}\nDate: ${r.date}\nType: ${r.tag}\n\nThis fictional record is part of a local front-end recreation. It is not an actual government document.`;
  const blob = new Blob([summary], {type:"text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `pursue-record-${String(selected+1).padStart(2,"0")}.txt`; a.click();
  URL.revokeObjectURL(url);
});
document.querySelector("#govToggle").addEventListener("click", () => {
  const info = document.querySelector("#govInfo");
  info.hidden = !info.hidden;
});
document.querySelector("#searchToggle").addEventListener("click", () => {
  const panel = document.querySelector("#searchPanel");
  panel.hidden = !panel.hidden;
  if (!panel.hidden) document.querySelector("#searchInput").focus();
});
document.querySelector("#closeSearch").addEventListener("click", () => document.querySelector("#searchPanel").hidden = true);
document.querySelector("#searchPanel").addEventListener("submit", e => {
  e.preventDefault();
  const q = document.querySelector("#searchInput").value.trim().toLowerCase();
  const found = records.map((r,i) => ({...r,i})).filter(r => (r.title + " " + r.tag + " " + r.date).toLowerCase().includes(q));
  const status = document.querySelector("#searchStatus");
  if (!q) { status.textContent = "Enter a term to search the sample archive."; return; }
  if (found.length) {
    selectRecord(found[0].i);
    status.textContent = `${found.length} matching record${found.length===1?"":"s"} found. Showing: ${found[0].title}.`;
    document.querySelector("#records").scrollIntoView({behavior:"smooth",block:"center"});
  } else status.textContent = "No matching records in this sample archive.";
});
document.querySelector("#menuToggle").addEventListener("click", () => document.querySelector(".main-nav").classList.toggle("open"));
document.addEventListener("keydown", e => {
  if (dialog.open) return;
  if (e.key === "ArrowLeft") selectRecord(selected - 1);
  if (e.key === "ArrowRight") selectRecord(selected + 1);
});
function updateClock() {
  document.querySelector("#clock").textContent = new Intl.DateTimeFormat("en-US", {timeZone:"America/New_York",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date());
}
drawGallery(); updateClock(); setInterval(updateClock, 30000);
