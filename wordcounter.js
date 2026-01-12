const wordcounter = document.getElementById("inputword");
const totalwords = document.getElementById("totalwords");
const totalcharsspace = document.getElementById("totalcharsspace");
const totalcharsnospace = document.getElementById("totalcharsnospace");
const totalspecialchars = document.getElementById("totalspecialchars");
const totalreadtime = document.getElementById("totalreadtime");

const resetBtn = document.getElementById("reset");
const saveBtn = document.getElementById("save");
const history = document.getElementById("history");
const textname = document.getElementById("name");
const errorMsg = document.getElementById("error");

let textHistory = [];

/* ======================
   LOAD ON START
====================== */
document.addEventListener("DOMContentLoaded", () => {
    const storedText = localStorage.getItem("texts");
    if (storedText) {
        wordcounter.value = storedText;
        updateCounters(storedText);
    }

    textHistory = JSON.parse(localStorage.getItem("history")) || [];
    renderHistory();
});

/* ======================
   ERROR HANDLING
====================== */
function showError(msg, input) {
    errorMsg.innerText = msg;
    errorMsg.style.display = "block";
    if (input) input.classList.add("input-error");
}

function clearError() {
    errorMsg.innerText = "";
    errorMsg.style.display = "none";
    wordcounter.classList.remove("input-error");
    textname.classList.remove("input-error");
}

/* ======================
   INPUT EVENT
====================== */
wordcounter.addEventListener("input", e => {
    updateCounters(e.target.value);
    localStorage.setItem("texts", e.target.value);
});

/* ======================
   COUNTERS
====================== */
function gettotalwords(str) {
    return str.trim() ? str.trim().split(/\s+/).length : 0;
}

function gettotalcharsspace(str) {
    return str.length;
}

function gettotalcharsnospace(str) {
    return str.replace(/\s/g, "").length;
}

function gettotalspecialchars(str) {
    const spchars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return [...str].filter(c => spchars.test(c)).length;
}

function gettotalreadtime(str) {
    return Math.ceil(gettotalwords(str) / 200);
}

function updateCounters(text) {
    totalwords.innerText = gettotalwords(text);
    totalcharsspace.innerText = gettotalcharsspace(text);
    totalcharsnospace.innerText = gettotalcharsnospace(text);
    totalspecialchars.innerText = gettotalspecialchars(text);
    totalreadtime.innerText = gettotalreadtime(text);
}

/* ======================
   RESET
====================== */
resetBtn.addEventListener("click", () => {
    if (!confirm("Reset all text?")) return;

    wordcounter.value = "";
    textname.value = "";
    localStorage.removeItem("texts");
    updateCounters("");
    clearError();
});

/* ======================
   SAVE TO HISTORY
====================== */
saveBtn.addEventListener("click", () => {
    clearError();

    if (!wordcounter.value.trim()) {
        showError("Text cannot be empty", wordcounter);
        return;
    }

    if (!textname.value.trim()) {
        showError("Text name cannot be empty", textname);
        return;
    }

    textHistory.push({
        id: Date.now(),
        name: textname.value,
        text: wordcounter.value,
        date: new Date().toLocaleString("id-ID")
    });

    localStorage.setItem("history", JSON.stringify(textHistory));
    renderHistory();
});

/* ======================
   RENDER HISTORY (FIXED)
====================== */
function renderHistory() {
    history.innerHTML = "";

    if (textHistory.length === 0) {
        history.innerHTML = "<li>No saved texts</li>";
        return;
    }

    textHistory.forEach(item => {
        const li = document.createElement("li");
        li.className = "history-item";

        li.innerHTML = `
            <span class="history-title">${item.name}</span>
            <small>${item.date}</small>
            <div class="history-actions">
                <button onclick="openText(${item.id})">
                    <i class="fa-solid fa-folder-open"></i>
                </button>
                <button onclick="deleteText(${item.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        history.appendChild(li);
    });
}


/* ======================
   OPEN SAVED TEXT
====================== */
function openText(id) {
    const selected = textHistory.find(t => t.id === id);
    if (!selected) return;

    wordcounter.value = selected.text;
    textname.value = selected.name;
    updateCounters(selected.text);
    localStorage.setItem("texts", selected.text);
}

function deleteText(id) {
    if (!confirm("Delete this saved text?")) return;

    textHistory = textHistory.filter(t => t.id !== id);
    localStorage.setItem("history", JSON.stringify(textHistory));
    renderHistory();
}
