// Initialize EmailJS (replace with your EmailJS credentials)
emailjs.init("YOUR_EMAILJS_USER_ID"); // Replace with your Public Key from EmailJS dashboard

// Form submission
document.getElementById("capsule-form").addEventListener("submit", function(event) {
  event.preventDefault();
  console.log("Form submitted"); // Debug log
  const unlockDate = new Date(document.getElementById("unlock-date").value);
  const content = document.getElementById("letter-content").value;

  // Validate inputs
  if (!content) {
    alert("Please enter a letter!");
    console.error("Validation failed: Empty letter content");
    return;
  }
  if (unlockDate <= new Date()) {
    alert("Please choose a future date (e.g., Myriam’s 80th birthday in 2070)!");
    console.error("Validation failed: Invalid date", unlockDate);
    return;
  }

  // Reset previous letters
  localStorage.setItem("letters", JSON.stringify([]));
  console.log("Previous letters cleared");

  // Save new letter to localStorage
  const letter = {
    id: Date.now(),
    email: "myriamc08@hotmail.com", // Hardcoded email
    unlockDate: unlockDate.toISOString(),
    content
  };
  localStorage.setItem("letters", JSON.stringify([letter]));
  console.log("Letter saved:", letter);

  // Show countdown and email button
  startCountdown(letter);
  document.getElementById("letter-form").style.display = "none";
  document.getElementById("countdown-section").style.display = "block";
  document.getElementById("send-email").style.display = "block";
});

// Start countdown
let currentLetterId;
function startCountdown(letter) {
  currentLetterId = letter.id;
  const countdownElement = document.getElementById("countdown");
  const letterText = document.getElementById("letter-text");
  const letterDisplay = document.getElementById("letter-display");
  console.log("Starting countdown for letter:", letter.id); // Debug log
  const interval = setInterval(() => {
    const now = new Date();
    const diff = new Date(letter.unlockDate) - now;
    if (diff <= 0) {
      clearInterval(interval);
      countdownElement.textContent = "Myriam’s 80th Birthday! The letter is ready!";
      letterText.textContent = letter.content;
      letterDisplay.style.display = "block";
      console.log("Letter revealed");
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}

// Manual email reminder
document.getElementById("send-email").addEventListener("click", function() {
  const letters = JSON.parse(localStorage.getItem("letters") || "[]");
  const letter = letters.find(l => l.id === currentLetterId);
  if (!letter) {
    alert("No letter found! Create one first.");
    console.error("No letter found for email");
    return;
  }

  const templateParams = {
    to_email: "myriamc08@hotmail.com", // Hardcoded email
    message: `Myriam, my love, our time capsule letter is ready!`,
    unlock_date: new Date(letter.unlockDate).toLocaleDateString(),
    site_url: window.location.href
  };

  console.log("Attempting to send email to myriamc08@hotmail.com with params:", templateParams); // Debug log

  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams) // Replace IDs
    .then((response) => {
      console.log("Email sent successfully!", response.status, response.text);
      alert("Email sent to myriamc08@hotmail.com! Check her inbox/spam.");
    })
    .catch((err) => {
      console.error("EmailJS Error:", err); // Detailed error
      alert("Failed to send email: " + (err.text || err.message || "Check console for details."));
    });
});

// Load existing letter on page load
window.onload = () => {
  console.log("Page loaded, checking for existing letter"); // Debug log
  const letters = JSON.parse(localStorage.getItem("letters") || "[]");
  if (letters.length > 0) {
    currentLetterId = letters[0].id;
    startCountdown(letters[0]);
    document.getElementById("letter-form").style.display = "none";
    document.getElementById("countdown-section").style.display = "block";
    document.getElementById("send-email").style.display = "block";
    console.log("Loaded existing letter:", letters[0]);
  }
};
