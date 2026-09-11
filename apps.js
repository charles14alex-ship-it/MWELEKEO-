// ======================================================
// MWELEKEO APP - Supabase Connection
// ======================================================

import { createClient } from
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ------------------------------------------------------
// 1. WEKA TAARIFA ZA SUPABASE HAPA
// ------------------------------------------------------

const SUPABASE_URL = "WEKA_SUPABASE_PROJECT_URL_HAPA";
const SUPABASE_KEY = "WEKA_SUPABASE_PUBLISHABLE_KEY_HAPA";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// Make Supabase available to the app
window.supabaseClient = supabase;


// ======================================================
// 2. MWELEKEO - CONNECTION TEST
// ======================================================

async function testSupabaseConnection() {
  const { error } = await supabase
    .from("feedback")
    .select("id")
    .limit(1);

  if (error) {
    console.log("Supabase connection:", error.message);
    return false;
  }

  console.log("MWELEKEO imeunganishwa na Supabase.");
  return true;
}


// ======================================================
// 3. SANDBUKU LA MAONI
// ======================================================

async function sendFeedback() {

  const nameInput = document.querySelector("#feedbackName");
  const messageInput = document.querySelector("#feedbackMessage");

  if (!messageInput) {
    alert("Sanduku la maoni halijapatikana.");
    return;
  }

  const name = nameInput
    ? nameInput.value.trim()
    : "Mwanachuo";

  const message = messageInput.value.trim();

  if (!message) {
    alert("Tafadhali andika maoni yako kwanza.");
    return;
  }

  const { error } = await supabase
    .from("feedback")
    .insert([
      {
        name: name || "Mwanachuo",
        message: message
      }
    ]);

  if (error) {
    console.error(error);
    alert("Maoni hayajatumwa. Hakikisha Supabase table ipo.");
    return;
  }

  messageInput.value = "";

  if (nameInput) {
    nameInput.value = "";
  }

  alert("Asante! Maoni yako yametumwa kwa MWELEKEO.");
}


// ======================================================
// 4. KUTENGENEZA SANDBUKU LA MAONI
// ======================================================

function createFeedbackBox() {

  if (document.querySelector("#mwelekeoFeedbackBox")) {
    return;
  }

  const box = document.createElement("section");

  box.id = "mwelekeoFeedbackBox";

  box.innerHTML = `
    <div style="
      max-width:600px;
      margin:30px auto;
      padding:20px;
      border-radius:18px;
      background:#ffffff;
      box-shadow:0 4px 20px rgba(0,0,0,.10);
      font-family:Arial,sans-serif;
    ">

      <h2>💬 Sanduku la Maoni</h2>

      <p>
        Una maoni, tatizo au unataka mabadiliko ndani ya
        MWELEKEO? Tuambie hapa.
      </p>

      <input
        id="feedbackName"
        type="text"
        placeholder="Jina lako"
        style="
          width:100%;
          padding:12px;
          margin:8px 0;
          box-sizing:border-box;
          border:1px solid #ddd;
          border-radius:10px;
        "
      >

      <textarea
        id="feedbackMessage"
        placeholder="Andika maoni au mabadiliko unayotaka..."
        rows="5"
        style="
          width:100%;
          padding:12px;
          margin:8px 0;
          box-sizing:border-box;
          border:1px solid #ddd;
          border-radius:10px;
          resize:vertical;
        "
      ></textarea>

      <button
        id="sendFeedbackButton"
        style="
          width:100%;
          padding:13px;
          border:0;
          border-radius:10px;
          cursor:pointer;
          font-size:16px;
          font-weight:bold;
        "
      >
        Tuma Maoni
      </button>

      <p id="feedbackStatus"></p>

    </div>
  `;

  document.body.appendChild(box);

  document
    .querySelector("#sendFeedbackButton")
    .addEventListener("click", sendFeedback);
}


// ======================================================
// 5. RATIBA
// ======================================================

async function saveTimetable(subject, day, time) {

  const { error } = await supabase
    .from("timetable")
    .insert([
      {
        subject: subject,
        day: day,
        time: time
      }
    ]);

  if (error) {
    console.error("Ratiba error:", error);
    return false;
  }

  return true;
}

window.saveTimetable = saveTimetable;


// ======================================================
// 6. MASWALI
// ======================================================

async function saveQuestion(question, answer = null) {

  const { data, error } = await supabase
    .from("questions")
    .insert([
      {
        question: question,
        answer: answer
      }
    ])
    .select();

  if (error) {
    console.error("Question error:", error);
    return null;
  }

  return data;
}

window.saveQuestion = saveQuestion;


// ======================================================
// 7. KUSOMA NOTES KUTOKA SUPABASE
// ======================================================

async function getNotes() {

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Notes error:", error);
    return [];
  }

  return data || [];
}

window.getNotes = getNotes;


// ======================================================
// 8. KUANZA APP
// ======================================================

document.addEventListener("DOMContentLoaded", async () => {

  console.log("MWELEKEO App imeanza.");

  createFeedbackBox();

  await testSupabaseConnection();

});
