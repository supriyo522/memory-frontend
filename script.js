// Array of icon emojis to be used in the memory game
const icons = ["🍎", "🍌", "🍇", "🍉", "🍓", "🥝", "🍍", "🍒"];

// Game state variables
let tiles = [], flippedIndices = [], matched = [];
let timer = 0, intervalId;

// DOM elements
const gameGrid = document.getElementById("game-grid");
const timerDisplay = document.getElementById("timer");
const restartButton = document.getElementById("restart");
const winMessage = document.getElementById("win-message");
const themeToggle = document.getElementById("theme-toggle");

// Shuffle function to randomize tiles
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Initialize and start a new game
function startGame() {
  tiles = shuffle([...icons, ...icons]); // Create a pair of each icon and shuffle
  flippedIndices = [];
  matched = [];
  timer = 0;
  clearInterval(intervalId); // Clear previous timer if any
  intervalId = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Time: ${timer}s`; // Update timer display
  }, 1000);
  winMessage.classList.add("hidden"); // Hide win message if previously shown
  stopConfetti(); // Stop confetti if it was running
  renderGrid(); // Render the game tiles
}

// Create and display the tile grid
function renderGrid() {
  gameGrid.innerHTML = "";
  tiles.forEach((icon, index) => {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.innerHTML = `
      <div class="front">🧠</div> <!-- Hidden side -->
      <div class="back">${icon}</div> <!-- Revealed icon -->
    `;
    tile.addEventListener("click", () => handleTileClick(index, tile)); // Tile click handler
    gameGrid.appendChild(tile);
  });
}

// Handle logic for when a tile is clicked
function handleTileClick(index, tileElement) {
  // Prevent clicking more than two tiles or already matched/flipped tiles
  if (flippedIndices.length === 2 || flippedIndices.includes(index) || matched.includes(index)) return;

  tileElement.classList.add("flipped");
  flippedIndices.push(index);

  // When two tiles are flipped
  if (flippedIndices.length === 2) {
    const [first, second] = flippedIndices;
    if (tiles[first] === tiles[second]) {
      // If tiles match, store their indices
      matched.push(first, second);
      flippedIndices = [];

      // If all tiles are matched, end game
      if (matched.length === tiles.length) {
        clearInterval(intervalId);
        winMessage.classList.remove("hidden"); // Show win message
        startConfetti(); // Start celebration
      }
    } else {
      // If tiles don't match, flip them back after a delay
      setTimeout(() => {
        const tileElements = document.querySelectorAll(".tile");
        tileElements[first].classList.remove("flipped");
        tileElements[second].classList.remove("flipped");
        flippedIndices = [];
      }, 1000);
    }
  }
}

// Toggle light/dark theme
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("light");
});

// Restart game when button is clicked
restartButton.addEventListener("click", startGame);

// ------------------- Confetti Animation ------------------- //
let confettiInterval;

// Start simple confetti animation using canvas
function startConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Create confetti particles
  let confetti = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 6 + 4,
    d: Math.random() * 50 + 10,
    color: `hsl(${Math.random() * 360}, 100%, 70%)`,
    tilt: Math.random() * 10 - 10
  }));

  // Draw confetti particles
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.fill();
      c.y += Math.cos(c.d / 10) + 1; // Falling motion
      c.x += Math.sin(c.d / 10);     // Sideways motion
      if (c.y > canvas.height) c.y = 0; // Reset to top when it goes off-screen
    });
  }

  // Continuously run the draw function
  confettiInterval = setInterval(draw, 30);
}

// Stop confetti animation
function stopConfetti() {
  clearInterval(confettiInterval);
}

// Start the game on initial load
startGame();
