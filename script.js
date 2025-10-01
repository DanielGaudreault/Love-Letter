// Initialize EmailJS (replace with your EmailJS user ID after signing up)
emailjs.init("YOUR_EMAILJS_USER_ID");

// Motivational messages
const messages = [
  "Our love grows stronger with every passing day.",
  "Together, we’ll write a lifetime of memories.",
  "You are my forever and always.",
  "Every moment with you is a treasure.",
  "Here’s to our love, timeless and true."
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
    alert("Please choose a future date!");
    return;
  }

  // Save letter to localStorage
  const letter = {
    id: Date.now(),
    email: "myriamc08@hotmail.com",
    unlockDate: unlockDate.toISOString(),
    content,
    password
  };
  let letters = JSON.parse(localStorage.getItem("letters") || "[]");
  letters.push(letter);
  localStorage.setItem("letters", JSON.stringify(letters));

  // Show countdown
  startCountdown(letter);
  document.getElementById("letter-form").style.display = "none";
  document.getElementById("countdown-section").style.display = "block";

  // Schedule email reminder (simulated)
  scheduleEmailReminder(letter);
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
      countdownElement.textContent = "Our letter is ready!";
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

// Schedule email reminder using EmailJS
function scheduleEmailReminder(letter) {
  const now = new Date();
  const delay = new Date(letter.unlockDate) - now;
  if (delay <= 0) return;

  // Simulate scheduling (requires browser to stay open; see notes)
  setTimeout(() => {
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
      to_email: letter.email,
      message: `My love, our time capsule letter is ready! Visit ${window.location.href} to read it.`,
      unlock_date: new Date(letter.unlockDate).toLocaleDateString()
    }).then(() => {
      console.log("Email sent!");
    }).catch(err => {
      console.error("Email failed:", err);
    });
  }, delay);
}

// Load existing letter on page load
window.onload = () => {
  const letters = JSON.parse(localStorage.getItem("letters") || "[]");
  if (letters.length > 0) {
    currentLetterId = letters[letters.length - 1].id;
    startCountdown(letters[letters.length - 1]);
    document.getElementById("letter-form").style.display = "none";
    document.getElementById("countdown-section").style.display = "block";
  }
};

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
