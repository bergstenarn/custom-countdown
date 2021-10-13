const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdownForm");
const dateElem = document.getElementById("date-picker");

const countdownElem = document.getElementById("countdown");
const countdownElemTitle = document.getElementById("countdown-title");
const countdownBtn = document.getElementById("countdown-button");
const timeElements = document.querySelectorAll("span");

const completeElem = document.getElementById("complete");
const completeElemInfo = document.getElementById("complete-info");
const completeBtn = document.getElementById("complete-button");

let countdownTitle = "";
let countdownDate = "";
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set date input min with today's date
const today = new Date().toISOString().split("T")[0];
dateElem.setAttribute("min", today);

// Populate countdown / Complete UI
function updateDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    // Hide input
    inputContainer.hidden = true;

    // If the countdown has ended, show complete
    if (distance < 0) {
      countdownElem.hidden = true;
      clearInterval(countdownActive);
      completeElemInfo.textContent = `${countdownTitle} ended on ${countdownDate}`;
      completeElem.hidden = false;
    } else {
      countdownElemTitle.textContent = countdownTitle;
      timeElements[0].textContent = days;
      timeElements[1].textContent = hours;
      timeElements[2].textContent = minutes;
      timeElements[3].textContent = seconds;
      completeElem.hidden = true;
      countdownElem.hidden = false;
    }
  }, second);
}

// Take values from form input
function updateCountdown(e) {
  e.preventDefault();
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };
  localStorage.setItem("countdown", JSON.stringify(savedCountdown));
  // Check for valid date
  if (countdownTitle === "") {
    alert("Please enter a title for the countdown.");
  } else if (countdownDate === "") {
    alert("Please select a date for the countdown.");
  } else {
    // Get number version of current date and update DOM
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Reset all values
function reset() {
  // Hide countdowns and show input
  countdownElem.hidden = true;
  completeElem.hidden = true;
  inputContainer.hidden = false;
  // Stop the countdown
  clearInterval(countdownActive);
  // Reset values
  countdownTitle = "";
  countdownDate = "";
  localStorage.removeItem("countdown");
}

function restorePreviousCountdown() {
  // Get countdown from local storage if available
  if (localStorage.getItem("countdown")) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem("countdown"));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Event listeners
countdownForm.addEventListener("submit", updateCountdown);
countdownBtn.addEventListener("click", reset);
completeBtn.addEventListener("click", reset);

// On load check local storage
restorePreviousCountdown();
