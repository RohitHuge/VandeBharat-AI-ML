const API = "";  // same origin — Flask serves both frontend and API

// ── State ─────────────────────────────────────────────────────────────────────
let activeTab = "image";
let selectedFile = null;

// ── Elements ──────────────────────────────────────────────────────────────────
const tabs           = document.querySelectorAll(".tab");
const panels         = { image: document.getElementById("panel-image"), video: document.getElementById("panel-video") };
const imageInput     = document.getElementById("image-input");
const videoInput     = document.getElementById("video-input");
const imageDrop      = document.getElementById("image-drop");
const videoDrop      = document.getElementById("video-drop");
const imagePreview   = document.getElementById("image-preview");
const previewWrap    = document.getElementById("image-preview-wrap");
const videoOptions   = document.getElementById("video-options");
const btnRun         = document.getElementById("btn-run");
const resultSection  = document.getElementById("result");
const numberDisplay  = document.getElementById("number-display");
const detectTbody    = document.querySelector("#detections-table tbody");
const detectionsWrap = document.getElementById("detections-wrap");
const votesWrap      = document.getElementById("votes-wrap");
const votesTbody     = document.querySelector("#votes-table tbody");
const videoStats     = document.getElementById("video-stats");
const spinner        = document.getElementById("spinner");
const spinnerMsg     = document.getElementById("spinner-msg");
const errorBox       = document.getElementById("error-box");

// ── Tab switching ─────────────────────────────────────────────────────────────
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    activeTab = tab.dataset.tab;
    tabs.forEach(t => t.classList.toggle("active", t === tab));
    Object.entries(panels).forEach(([k, el]) => el.classList.toggle("hidden", k !== activeTab));
    resetUI();
  });
});

// ── File selection ─────────────────────────────────────────────────────────────
imageInput.addEventListener("change", e => handleFile(e.target.files[0]));
videoInput.addEventListener("change", e => handleFile(e.target.files[0]));

function handleFile(file) {
  if (!file) return;
  selectedFile = file;
  errorBox.classList.add("hidden");
  resultSection.classList.add("hidden");
  btnRun.classList.remove("hidden");

  if (activeTab === "image") {
    const url = URL.createObjectURL(file);
    imagePreview.src = url;
    previewWrap.classList.remove("hidden");
  } else {
    videoOptions.classList.remove("hidden");
  }
}

// ── Drag & drop ───────────────────────────────────────────────────────────────
[imageDrop, videoDrop].forEach(zone => {
  zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("drag-over"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", e => {
    e.preventDefault();
    zone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });
  zone.addEventListener("click", () => {
    (activeTab === "image" ? imageInput : videoInput).click();
  });
});

// ── Run OCR ───────────────────────────────────────────────────────────────────
btnRun.addEventListener("click", async () => {
  if (!selectedFile) return;

  setLoading(true, activeTab === "video" ? "Processing video… this may take a while" : "Running OCR…");
  resultSection.classList.add("hidden");
  errorBox.classList.add("hidden");

  try {
    const fd = new FormData();
    fd.append("file", selectedFile);

    let url, data;

    if (activeTab === "image") {
      url = `${API}/api/ocr/image`;
      const res = await fetch(url, { method: "POST", body: fd });
      data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      renderImageResult(data);

    } else {
      fd.append("frame_skip",     document.getElementById("frame-skip").value);
      fd.append("vote_threshold", document.getElementById("vote-threshold").value);
      url = `${API}/api/ocr/video`;
      const res = await fetch(url, { method: "POST", body: fd });
      data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      renderVideoResult(data);
    }

  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
});

// ── Render image result ────────────────────────────────────────────────────────
function renderImageResult(data) {
  const best = data.best;

  numberDisplay.textContent = best || "Not detected";
  numberDisplay.className = "number" + (best ? "" : " none");

  detectTbody.innerHTML = "";
  (data.detections || []).forEach((d, i) => {
    const isMatch = data.train_number_candidates.includes(d.text.replace(/\s/g, ""));
    const pct = Math.round(d.confidence * 100);
    detectTbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${esc(d.text)}</strong></td>
        <td>
          <div class="conf-bar">
            <span>${pct}%</span>
            <div class="conf-track"><div class="conf-fill" style="width:${pct}%"></div></div>
          </div>
        </td>
        <td>${isMatch ? '<span class="match-yes">✓ Train No.</span>' : '<span class="match-no">—</span>'}</td>
      </tr>`;
  });

  detectionsWrap.classList.remove("hidden");
  votesWrap.classList.add("hidden");
  resultSection.classList.remove("hidden");
}

// ── Render video result ────────────────────────────────────────────────────────
function renderVideoResult(data) {
  const best = data.best;

  numberDisplay.textContent = best || "Not detected";
  numberDisplay.className = "number" + (best ? "" : " none");

  // Votes table
  votesTbody.innerHTML = "";
  const votes = data.votes || {};
  Object.entries(votes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([num, count]) => {
      const highlight = num === best ? ' style="color:var(--green);font-weight:700"' : "";
      votesTbody.innerHTML += `<tr><td${highlight}>${esc(num)}</td><td${highlight}>${count}</td></tr>`;
    });

  videoStats.textContent =
    `Frames read: ${data.frames_read}  ·  Frames processed: ${data.frames_processed}  ·  Detection events: ${(data.detection_log || []).length}`;

  detectionsWrap.classList.add("hidden");
  votesWrap.classList.remove("hidden");
  resultSection.classList.remove("hidden");
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function setLoading(on, msg = "Running OCR…") {
  spinner.classList.toggle("hidden", !on);
  spinnerMsg.textContent = msg;
  btnRun.disabled = on;
}

function showError(msg) {
  errorBox.textContent = "Error: " + msg;
  errorBox.classList.remove("hidden");
}

function resetUI() {
  selectedFile = null;
  btnRun.classList.add("hidden");
  resultSection.classList.add("hidden");
  errorBox.classList.add("hidden");
  previewWrap.classList.add("hidden");
  videoOptions.classList.add("hidden");
  imagePreview.src = "";
}

function esc(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
