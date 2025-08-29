const content = document.querySelector(".content");
const textModeBtn = document.querySelector(".text-mode");
const inputBox = document.getElementById("textInput");
const inputArea = document.getElementById("inputArea");

let recognitionTimeout;
let isTextMode = false; // Track if user manually switched to text

// 🎤Text-to-Speech
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.volume = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

// Greet User on Load
window.addEventListener("load", () => {
  speak("Initializing Nexa...");
  wishMe();
});

// Greet Based on Time
function wishMe() {
  const hour = new Date().getHours();
  if (hour < 12) speak("Good Morning! Ready to conquer the day?");
  else if (hour < 17) speak("Good Afternoon! Hope you're doing well.");
  else speak("Good Evening! Let’s wrap the day strong.");
}

// Speech Recognition Setup
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-IN";

recognition.onresult = (event) => {
  clearTimeout(recognitionTimeout);
  const transcript = event.results[0][0].transcript;
  content.textContent = transcript;
  takeCommand(transcript.toLowerCase());
};

recognition.onerror = () => {
  clearTimeout(recognitionTimeout);
  if (!isTextMode) {
    speak(
      "Sorry, I couldn't catch that. You may try again or use the keyboard."
    );
  }
  showTextInput();
};

// Voice Trigger (Main Button)
inputArea.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("text-mode") ||
    e.target.id === "textInput" ||
    e.target.tagName === "INPUT" ||
    e.target.closest(".text-mode")
  )
    return;

  hideTextInput();
  content.textContent = "Listening...";
  recognition.start();

  recognitionTimeout = setTimeout(() => {
    if (!isTextMode) {
      speak("Sorry, I didn't catch that. Try again or use text input.");
    }
    showTextInput();
  }, 5000);
});

//Typed Input (Enter Key)
inputBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const message = inputBox.value.trim();
    if (message) {
      content.textContent = message;
      takeCommand(message.toLowerCase());
      inputBox.value = "";
    }
  }
});

//Switch to Text Mode
textModeBtn.addEventListener("click", () => {
  isTextMode = true;
  showTextInput();
  speak("You can type your command now.");
  inputBox.focus();
});

//Show/Hide Input
function showTextInput() {
  inputBox.style.display = "inline-block";
  content.textContent = "";
}

function hideTextInput() {
  inputBox.style.display = "none";
  content.textContent = "Click here to speak";
}

//Command Handler
function takeCommand(message) {
  if (message.includes("hello") || message.includes("hey")) {
    speak("Hello! How can I assist you today?");
  } else if (message.includes("open google")) {
    speak("Opening Google...");
    window.open("https://google.com", "_blank");
  } else if (message.includes("open youtube")) {
    speak("Launching YouTube...");
    window.open("https://www.youtube.com", "_blank");
  } else if (message.includes("open facebook")) {
    speak("Opening Facebook...");
    window.open("https://www.facebook.com", "_blank");
  } else if (message.includes("open instagram")) {
    speak("Opening Instagram...");
    window.open("https://www.instagram.com", "_blank");
  } else if (message.includes("time")) {
    const time = new Date().toLocaleTimeString();
    speak("The current time is " + time);
  } else if (message.includes("date")) {
    const date = new Date().toDateString();
    speak("Today's date is " + date);
  } else if (message.includes("calculator") || message.includes("calci")) {
    speak("Opening Calculator...");
    window.open("Calculator:///", "_blank");
  } else if (message.includes("joke")) {
    speak("Why don't programmers like nature? It has too many bugs!");
  } else if (message.includes("motivation")) {
    speak("Believe in yourself! Every expert was once a beginner.");
  } else if (message.includes("open weather")) {
    speak("Fetching the latest weather update...");
    window.open("https://www.google.com/search?q=current+weather", "_blank");
  } else if (message.includes("weather")) {
    speak("Fetching the latest weather update...");
    getWeatherAndSpeak();
  } else if (message.includes("news")) {
    speak("Opening latest headlines...");
    window.open("https://news.google.com", "_blank");
  } else if (message.includes("wikipedia")) {
    const query = message.replace("wikipedia", "").trim();
    speak("Searching Wikipedia for " + query);
    window.open(`https://en.wikipedia.org/wiki/${query}`, "_blank");
  } else if (
    message.includes("what is") ||
    message.includes("who is") ||
    message.includes("how to") ||
    message.includes("define")
  ) {
    speak("Let me find that for you.");
    window.open(
      `https://www.google.com/search?q=${message.replace(/ /g, "+")}`,
      "_blank"
    );
  } else {
    speak("Here's what I found online.");
    window.open(
      `https://www.google.com/search?q=${message.replace(/ /g, "+")}`,
      "_blank"
    );
  }

  //Reset for next interaction
  hideTextInput();
  isTextMode = false;
}
