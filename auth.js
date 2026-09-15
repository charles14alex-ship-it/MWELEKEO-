// MWELEKEO - SUPABASE AUTH

const SUPABASE_URL = "https://jhwrqiavorsmcqubqlug.supabase.co";

// WEKA PUBLISHABLE/ANON KEY YAKO HAPA
const SUPABASE_KEY = "WEKA_KEY_YAKO_HAPA";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// USAJILI
async function sajili() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Weka email na password.");
    return;
  }

  const { error } = await supabaseClient.auth.signUp({
    email: email,
    password: password
  });

  if (error) {
    alert("Kosa la usajili: " + error.message);
    return;
  }

  alert("Usajili umefanikiwa! Angalia email yako kama uthibitisho unahitajika.");
}

// INGIA
async function ingia() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Weka email na password.");
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    alert("Kosa la kuingia: " + error.message);
    return;
  }

  alert("Umeingia kwenye Mwelekeo!");
}

// TOKA
async function toka() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("Kosa: " + error.message);
    return;
  }

  alert("Umetoka kwenye akaunti.");
}

// ANGALIA MTUMIAJI
async function angaliaMtumiaji() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

// SESSION
supabaseClient.auth.onAuthStateChange((event, session) => {
  console.log("Mwelekeo Auth:", event);

  if (session) {
    console.log("Mtumiaji ameingia:", session.user.email);
  }
});
