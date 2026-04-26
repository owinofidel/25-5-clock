// ========== DOM Elements ==========
const DOM = {
  timeLeft: document.getElementById('time-left'),
  label: document.getElementById('timer-label'),
  session: document.getElementById('session-length'),
  restValue: document.getElementById('break-length'),
  sessionIncrement: document.getElementById('session-increment'),
  sessionDecrement: document.getElementById('session-decrement'),
  restIncrement: document.getElementById('break-increment'),
  restDecrement: document.getElementById('break-decrement'),
  playPause: document.getElementById('start_stop'),
  reset: document.getElementById('reset'),
  audio: document.getElementById('beep'),
  timer: document.getElementById('timer').classList
};

// ========== State Management ==========
let state = {
  restTime: Number(DOM.restValue.textContent),
  sessionTime: Number(DOM.session.textContent),
  toggle: false,
  intervalId: null
};

// ========== Constants ==========
const MIN_TIME = 1;
const MAX_TIME = 60;
const TIME_THRESHOLD = 300000; // 5 minutes in ms
const SESSION_LABEL = 'Session';
const BREAK_LABEL = 'Break';

// ========== Utility Functions ==========

/**
 * Formats time to MM:SS format with leading zeros
 */
const formatTime = (minutes, seconds = 0) => {
  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = seconds < 10 ? `0${seconds}` : seconds;
  return `${m}:${s}`;
};

/**
 * Increments time value with bounds checking
 */
const incrementTime = (currentTime, max = MAX_TIME) => {
  return currentTime < max ? currentTime + 1 : currentTime;
};

/**
 * Decrements time value with bounds checking
 */
const decrementTime = (currentTime, min = MIN_TIME, max = MAX_TIME) => {
  return currentTime > min ? currentTime - 1 : currentTime;
};

/**
 * Updates the display for the given time type
 */
const updateDisplay = (timeType) => {
  if (timeType === 'rest') {
    DOM.restValue.innerHTML = state.restTime;
    if (DOM.label.textContent === BREAK_LABEL) {
      DOM.timeLeft.innerHTML = formatTime(state.restTime, 0);
    }
  } else if (timeType === 'session') {
    DOM.session.innerHTML = state.sessionTime;
    DOM.timeLeft.innerHTML = formatTime(state.sessionTime, 0);
  }
};

/**
 * Toggles event listeners on/off for increment/decrement buttons
 */
const toggleEventListeners = (shouldAdd) => {
  const action = shouldAdd ? 'addEventListener' : 'removeEventListener';
  
  DOM.restIncrement[action]('click', restIncrementFunction);
  DOM.restDecrement[action]('click', restDecrementFunction);
  DOM.sessionIncrement[action]('click', sessionIncrementFunction);
  DOM.sessionDecrement[action]('click', sessionDecrementFunction);
};

// ========== Increment/Decrement Functions ==========

const restIncrementFunction = () => {
  state.restTime = incrementTime(state.restTime);
  updateDisplay('rest');
};

const restDecrementFunction = () => {
  state.restTime = decrementTime(state.restTime);
  updateDisplay('rest');
};

const sessionIncrementFunction = () => {
  state.sessionTime = incrementTime(state.sessionTime);
  updateDisplay('session');
};

const sessionDecrementFunction = () => {
  state.sessionTime = decrementTime(state.sessionTime);
  updateDisplay('session');
};

// ========== Timer Functions ==========

/**
 * Main countdown timer function
 */
const counter = (countDownDate, currentSession) => {
  const now = new Date().getTime();
  const distance = countDownDate - now;
  
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  // Update display
  DOM.timeLeft.innerHTML = formatTime(minutes, seconds);
  
  // Add danger class when less than 5 minutes remain
  if (distance <= TIME_THRESHOLD) {
    DOM.timer.add('danger');
  } else {
    DOM.timer.remove('danger');
  }
  
  // Handle timer completion
  if (distance < 100) {
    handleSessionComplete(currentSession);
  }
};

/**
 * Handles the transition when a session completes
 */
const handleSessionComplete = (currentSession) => {
  const isSessionComplete = currentSession === SESSION_LABEL;
  const nextLabel = isSessionComplete ? BREAK_LABEL : SESSION_LABEL;
  const nextDuration = isSessionComplete ? state.restTime : state.sessionTime;
  
  DOM.timer.remove('danger');
  clearInterval(state.intervalId);
  DOM.audio.play();
  DOM.label.textContent = nextLabel;
  DOM.timeLeft.innerHTML = formatTime(nextDuration, 0);
  
  // Start next session after delay
  setTimeout(() => {
    const countDownDate = new Date().getTime() + (nextDuration * 60 * 1000);
    state.intervalId = setInterval(counter, 100, countDownDate, nextLabel);
  }, 2000);
};

/**
 * Starts the countdown timer
 */
const startTimer = (timeInMs) => {
  if (!state.intervalId) {
    const countDownDate = new Date().getTime() + timeInMs;
    state.intervalId = setInterval(counter, 100, countDownDate, SESSION_LABEL);
  }
};

/**
 * Stops the countdown timer
 */
const stopTimer = () => {
  clearInterval(state.intervalId);
  state.intervalId = null;
};

// ========== Event Handlers ==========

/**
 * Handles play/pause button click
 */
const playPauseFunction = () => {
  state.toggle = !state.toggle;
  toggleEventListeners(!state.toggle);
  
  const [minutes, seconds] = DOM.timeLeft.innerHTML.split(':').map(Number);
  const timeInMs = (minutes * 60 * 1000) + (seconds * 1000);
  
  state.toggle ? startTimer(timeInMs) : stopTimer();
};

/**
 * Resets the timer to default state
 */
const resetFunction = () => {
  DOM.timer.remove('danger');
  state.toggle = false;
  state.sessionTime = 25;
  state.restTime = 5;
  
  stopTimer();
  toggleEventListeners(true);
  
  DOM.label.textContent = SESSION_LABEL;
  DOM.session.innerHTML = state.sessionTime;
  DOM.restValue.innerHTML = state.restTime;
  DOM.timeLeft.innerHTML = formatTime(state.sessionTime, 0);
  DOM.audio.load();
};

// ========== Event Listeners ==========

DOM.restIncrement.addEventListener('click', restIncrementFunction);
DOM.restDecrement.addEventListener('click', restDecrementFunction);
DOM.sessionIncrement.addEventListener('click', sessionIncrementFunction);
DOM.sessionDecrement.addEventListener('click', sessionDecrementFunction);
DOM.playPause.addEventListener('click', playPauseFunction);
DOM.reset.addEventListener('click', resetFunction);

// ========== Initialize ==========

DOM.timeLeft.innerHTML = formatTime(state.sessionTime, 0);
