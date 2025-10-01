// Initialize EmailJS (replace with your EmailJS user ID after signing up)
emailjs.init("myriamc08@hotmail.com"); // Replace with your Public Key from EmailJS dashboard

// Motivational messages
const messages = [
  "Myriam, our love is eternal, growing stronger every day.",
  "Together, we’ll share a lifetime of joy and memories.",
  "You are my heart, now and forever.",
  "Every moment with you is a gift I cherish.",
  "Here’s to our love, shining bright until 2070 and beyond."
];

// Display random motivational message
document.getElementById("motivational-message").textContent = messages[Math.floor(Math.random() * messages.length)];

// Form submission
document.getElementById("capsule-form").addEventListener("submit", function(event) {
  event.preventDefault();
  const unlockDate = new Date(document.getElementById("unlock-date").value);
  const content = document.getElementById("letter-content").value;
  const password = document.getElementById("password").value;

  // Validate date
  if (unlockDate <= new Date()) {
    alert("Please choose a future date (e.g., Myriam’s 80th birthday in 2070)!");
    return;
  }

  // Reset previous letters
  localStorage.setItem("letters", JSON.stringify([]));

  // Save new letter to localStorage
  const letter = {
    id: Date.now(),
    email: "myriamc08@hotmail.com", // Hardcoded email
    unlockDate: unlockDate.toISOString(),
    content,
    password
  };
  let letters = JSON.parse(localStorage.getItem("letters") || "[]");
  letters.push(letter);
  localStorage.setItem("letters", JSON.stringify(letters));

  // Show countdown and reminder button
  startCountdown(letter);
  document.getElementById("letter-form").style.display = "none";
  document.getElementById("countdown-section").style.display = "block";
  document.getElementById("send-reminder").style.display = "block";
});

// Start countdown
let currentLetterId;
function startCountdown(letter) {
  currentLetterId = letter.id;
  const countdownElement = document.getElementById("countdown");
  const letterText = document.getElementById("letter-text");
  const letterDisplay = document.getElementById("letter-display");
  const passwordSection = document.getElementById("password-section");
  const interval = setInterval(() => {
    const now = new Date();
    const diff = new Date(letter.unlockDate) - now;
    if (diff <= 0) {
      clearInterval(interval);
      countdownElement.textContent = "Myriam’s 80th Birthday! The letter is ready!";
      if (letter.password) {
        passwordSection.style.display = "block";
      } else {
        letterText.textContent = letter.content;
        letterDisplay.style.display = "block";
        confetti({ particleCount: 100, spread: 70, colors: ["#ff69b4", "#ffffff"] });
      }
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}

// Unlock letter with password
function unlockLetter() {
  const inputPassword = document.getElementById("unlock-password").value;
  const letters = JSON.parse(localStorage.getItem("letters") || "[]");
  const letter = letters.find(l => l.id === currentLetterId);
  if (letter.password === inputPassword) {
    document.getElementById("letter-text").textContent = letter.content;
    document.getElementById("letter-display").style.display = "block";
    document.getElementById("password-section").style.display = "none";
    confetti({ particleCount: 100, spread: 70, colors: ["#ff69b4", "#ffffff"] });
  } else {
    alert("Incorrect password!");
  }
}

// Manual email reminder
document.getElementById("send-reminder").addEventListener("click", function() {
  const letters = JSON.parse(localStorage.getItem("letters") || "[]");
  const letter = letters.find(l => l.id === currentLetterId);
  if (!letter) {
    alert("No letter found! Create one first.");
    return;
  }

  // Template params with site URL
  const templateParams = {
    to_email: "myriamc08@hotmail.com", // Hardcoded email
    message: `Myriam, my love, our time capsule letter is ready!`,
    unlock_date: new Date(letter.unlockDate).toLocaleDateString(),
    site_url: window.location.href
  };

  console.log("Sending email with params:", templateParams); // Debug log

  emailjs.send("myriamc08@hotmail.com", "myriamc08@hotmail.com", templateParams) // Replace IDs
    .then((response) => {
      console.log("Email sent successfully!", response.status, response.text);
      alert("Reminder email sent to myriamc08@hotmail.com! Check her inbox/spam.");
    })
    .catch((err) => {
      console.error("EmailJS Error Details:", err); // Full error in console
      alert("Failed to send email: " + (err.text || err.message || "Unknown error. Check console for details."));
    });
});

// Load existing letter on page load
window.onload = () => {
  const letters = JSON.parse(localStorage.getItem("letters") || "[]");
  if (letters.length > 0) {
    currentLetterId = letters[letters.length - 1].id;
    startCountdown(letters[letters.length - 1]);
    document.getElementById("letter-form").style.display = "none";
    document.getElementById("countdown-section").style.display = "block";
    document.getElementById("send-reminder").style.display = "block";
  }
};

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
