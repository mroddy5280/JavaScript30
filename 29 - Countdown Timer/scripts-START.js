// global variable that lives on the window that will store the setInterval
let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');
function timer(seconds) {
  // Clear any existing timers
  clearInterval(countdown);

  /*
    Used to use a setInterval with a function to just remove a second each time
    but found there to be some bugs.
    1. If tabbed away for to long in the browser the interval would fail to run.
        Could be the browser doing something funky
    2. iOS when scrolling on the page all intervals are paused. Could be done
        for performance reasons and to keep the scrolling smooth
  */
  // setInterval(function () {
  //   seconds--
  // }, 1000);

  const now = Date.now();
  /*
    Because now is in milliseconds and seconds in obviously in seconds we
    multiply by 1000 to get the correct conversion of seconds to milliseconds.
  */
  const then = now + seconds * 1000;
  /*
    By calling the new function displayTimeLeft at this point we resolve the
    issue of the setInterval taking 1 second to start counting. This will
  */
  displayTimeLeft(seconds);
  /*
    Call the function to display the time to be back
  */
  displayEndTime(then);
  /*
   setInterval does not run imediatly it has to wait for the first second to
    elapse
  */
  countdown = setInterval(() => {
    /*
    Then is when it stops, now is the time captured when it ran, then we capture
    the current time again with date but now but we need to have that in seconds
    so we divide by 100
   */
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // check if we should stop it!
    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    // Display it
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  // using floor here makes sure that we round down to whole minutes
  const minutes = Math.floor(seconds / 60);
  // seconds % 60 gives us the remainder of seconds per minute
  const remainderSeconds = seconds % 60;
  /*
    Here we are updating the display based on the time left. We used a ternary
    operator to either display a 0 before the remainder of seconds if it is a
    single integer.
  */
  const display = `${minutes}:${
    remainderSeconds < 10 ? '0' : ''
  }${remainderSeconds}`;
  document.title = display;
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const minutes = end.getMinutes();
  endTime.textContent = `Be back at ${hour > 12 ? hour - 12 : hour}:${
    minutes < 10 ? '0' : ''
  }${minutes}`;
}

function startTimer() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e) {
  // Prevents reloading of the page with a URL of the input value
  e.preventDefault();
  const mins = this.minutes.value;
  // Convert mins into seconds for the timer
  timer(mins * 60);
  // Reset the form element so that the input minutes is cleared out
  this.reset();
});
