import { createClient } from
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Supabase project details
const SUPABASE_URL =
  'https://jhwrqiavorsmcqubqlug.supabase.co'

(const Supabase_ key ='<sb_publishable_AKtgJINJcfimlas-1bUE0w_3XM_ Zjc3>'

// Tengeneza Supabase client
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
)

// Tengeneza sehemu ya Auth ndani ya index.html
const authContainer = document.getElementById(
  'auth-container'
)

if (!authContainer) {
  console.error(
    'Hujaweka <div id="auth-container"></div> kwenye index.html'
  )
} else {
  authContainer.innerHTML = `
    <div id="auth-box">
      <h2 id="auth-title">Login</h2>

      <form id="auth-form">
        <input
          id="auth-email"
          type="email"
          placeholder="Email"
          autocomplete="email"
          required
        />

        <input
          id="auth-password"
          type="password"
          placeholder="Password"
          autocomplete="current-password"
          minlength="6"
          required
        />

        <button id="auth-submit" type="submit">
          Login
        </button>
      </form>

      <button id="switch-auth" type="button">
        Huna account? Sign Up
      </button>

      <p id="auth-message"></p>
    </div>

    <div id="account-box" hidden>
      <h2>Account yako</h2>

      <p>
        Umeingia kama:
        <strong id="account-email"></strong>
      </p>

      <button id="logout-button" type="button">
        Logout
      </button>

      <p id="account-message"></p>
    </div>
  `

  const authBox = document.getElementById('auth-box')
  const accountBox = document.getElementById('account-box')

  const authTitle = document.getElementById('auth-title')
  const authForm = document.getElementById('auth-form')
  const authEmail = document.getElementById('auth-email')
  const authPassword = document.getElementById(
    'auth-password'
  )
  const authSubmit = document.getElementById('auth-submit')
  const switchAuth = document.getElementById('switch-auth')
  const authMessage = document.getElementById('auth-message')

  const accountEmail = document.getElementById(
    'account-email'
  )
  const logoutButton = document.getElementById(
    'logout-button'
  )
  const accountMessage = document.getElementById(
    'account-message'
  )

  let isSignupMode = false

  function showAuthMessage(message, isError = false) {
    authMessage.textContent = message
    authMessage.style.color = isError ? 'red' : 'green'
  }

  function showAccountMessage(message, isError = false) {
    accountMessage.textContent = message
    accountMessage.style.color = isError ? 'red' : 'green'
  }

  function setSignupMode() {
    isSignupMode = true

    authTitle.textContent = 'Sign Up'
    authSubmit.textContent = 'Create Account'
    switchAuth.textContent = 'Una account? Login'

    authPassword.autocomplete = 'new-password'
    showAuthMessage('')
  }

  function setLoginMode() {
    isSignupMode = false

    authTitle.textContent = 'Login'
    authSubmit.textContent = 'Login'
    switchAuth.textContent = 'Huna account? Sign Up'

    authPassword.autocomplete = 'current-password'
    showAuthMessage('')
  }

  function showLoggedInUser(user) {
    authBox.hidden = true
    accountBox.hidden = false

    accountEmail.textContent = user.email
    showAccountMessage('')
  }

  function showLoggedOutUser() {
    authBox.hidden = false
    accountBox.hidden = true

    accountEmail.textContent = ''
    authPassword.value = ''
  }

  // Badilisha kati ya Login na Sign Up
  switchAuth.addEventListener('click', () => {
    if (isSignupMode) {
      setLoginMode()
    } else {
      setSignupMode()
    }
  })

  // Login au Sign Up
  authForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const email = authEmail.value.trim()
    const password = authPassword.value

    authSubmit.disabled = true

    if (isSignupMode) {
      authSubmit.textContent = 'Inatengeneza account...'
    } else {
      authSubmit.textContent = 'Inaingia...'
    }

    showAuthMessage('')

    try {
      if (isSignupMode) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          showAuthMessage(error.message, true)
          return
        }

        if (!data.session) {
          showAuthMessage(
            'Account imetengenezwa. Kagua email yako ili kuthibitisha account.'
          )
        } else if (data.user) {
          showLoggedInUser(data.user)
        }
      } else {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          })

        if (error) {
          showAuthMessage(error.message, true)
          return
        }

        if (data.user) {
          showLoggedInUser(data.user)

          // Kama una dashboard, unaweza ku-redirect hapa:
          // window.location.href = './dashboard.html'
        }
      }
    } catch (error) {
      showAuthMessage(
        'Kuna tatizo. Jaribu tena.',
        true
      )

      console.error(error)
    } finally {
      authSubmit.disabled = false

      if (isSignupMode) {
        authSubmit.textContent = 'Create Account'
      } else {
        authSubmit.textContent = 'Login'
      }
    }
  })

  // Logout
  logoutButton.addEventListener('click', async () => {
    logoutButton.disabled = true
    logoutButton.textContent = 'Inatoka...'

    const { error } = await supabase.auth.signOut()

    if (error) {
      showAccountMessage(error.message, true)
      logoutButton.disabled = false
      logoutButton.textContent = 'Logout'
      return
    }

    showLoggedOutUser()
    showAuthMessage('Umetoka kwenye account.')

    logoutButton.disabled = false
    logoutButton.textContent = 'Logout'
  })

  // Kagua kama user tayari yupo logged in
  async function checkCurrentSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
      showLoggedInUser(session.user)
    } else {
      showLoggedOutUser()
    }
  }

  // Fuatilia mabadiliko ya login/logout
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      showLoggedInUser(session.user)
    } else {
      showLoggedOutUser()
    }
  })

  checkCurrentSession()
}
