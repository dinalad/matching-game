// Define audio objects for different game events
let clickAudio = new Audio('audio/click.wav');
let matchAudio = new Audio('audio/match.wav');
let winAudio = new Audio('audio/win.wav');

// Function to handle flipping a card when clicked
function flipCardWhenClicked(cardObject) {
  cardObject.element.onclick = function() {
    // Check if the card is already flipped
    if (cardObject.element.classList.contains("flipped")) {
      return; // Exit function if already flipped
    }
    clickAudio.play(); // Play click sound
    cardObject.element.classList.add("flipped"); // Mark card as flipped
    // Call onCardFlipped after a delay
    setTimeout(function() {
      onCardFlipped(cardObject);
    }, 500);
  };
}

// Function to set up the game initially
function setUpGame() {
  let cardObjects = createCards(document.getElementById("card-container"), shuffleCardImageClasses());
  // Attach click event to each card object
  for (let i = 0; i < cardObjects.length; i++) {
    flipCardWhenClicked(cardObjects[i]);
  }
}

// Object to store game counters
let counters = {
  flips: 0,
  matches: 0
};

let lastCardFlipped = null; // Keep track of the last flipped card
let gameMode = 'regular'; // Default game mode

// Function to create a new card element
function createNewCard() {
  const cardElement = document.createElement("div");
  cardElement.className = "card";
  cardElement.innerHTML = `
    <div class="card-down"></div>
    <div class="card-up"></div>
  `;
  return cardElement;
}

// Function to append a newly created card to a parent element
function appendNewCard(parentElement) {
  const cardElement = createNewCard();
  parentElement.appendChild(cardElement);
  return cardElement;
}

// Function to shuffle and retrieve card image classes based on game mode
function shuffleCardImageClasses() {
  let cardClasses;
  if (gameMode === 'easy') {
    cardClasses = ["image-1", "image-1", "image-2", "image-2", "image-3", "image-3", "image-4", "image-4", "image-5", "image-5", "image-6", "image-6"];
  } else if (gameMode === 'hard') {
    cardClasses = ["image-1", "image-1", "image-2", "image-2", "image-3", "image-3", "image-4", "image-4", "image-5", "image-5", "image-6", "image-6", "image-7", "image-7", "image-8", "image-8", "image-9", "image-9", "image-10", "image-10", "image-11", "image-11", "image-12", "image-12"];
  } else {
    cardClasses = ["image-1", "image-1", "image-2", "image-2", "image-3", "image-3", "image-4", "image-4", "image-5", "image-5", "image-6", "image-6", "image-7", "image-7", "image-8", "image-8", "image-9", "image-9"];
  }
  return _.shuffle(cardClasses); // Shuffle card classes using lodash
}

// Function to determine the number of cards based on game mode
function getCardCount() {
  if (gameMode === 'easy') return 12;
  if (gameMode === 'hard') return 24;
  return 18;
}

// Function to create card objects based on shuffled image classes
function createCards(parentElement, shuffledImageClasses) {
  const cardObjects = [];
  for (let i = 0; i < shuffledImageClasses.length; i++) {
    const cardElement = appendNewCard(parentElement);
    cardElement.classList.add(shuffledImageClasses[i]);
    const cardObject = {
      index: i,
      element: cardElement,
      imageClass: shuffledImageClasses[i]
    };
    cardObjects.push(cardObject);
  }
  return cardObjects;
}

// Function to check if two flipped cards match
function doCardsMatch(cardObject1, cardObject2) {
  return cardObject1.imageClass === cardObject2.imageClass;
}

// Function to increment a specified counter and update the DOM element
function incrementCounter(counterName, parentElement) {
  counters[counterName] = (counters[counterName] || 0) + 1;
  parentElement.innerText = counters[counterName];
}

// Function called when a card is flipped
function onCardFlipped(newlyFlippedCard) {
  incrementCounter("flips", document.getElementById("flip-count")); // Increment flips counter

  if (!lastCardFlipped) {
    lastCardFlipped = newlyFlippedCard; // Store the first flipped card
  } else {
    if (doCardsMatch(lastCardFlipped, newlyFlippedCard)) {
      incrementCounter("matches", document.getElementById("match-count")); // Increment matches counter
      newlyFlippedCard.element.classList.add("glow"); // Add visual effect to matched cards
      lastCardFlipped.element.classList.add("glow");
      if (counters.matches === getCardCount() / 2) {
        winAudio.play(); // Play win sound if all matches found
      } else {
        matchAudio.play(); // Play match sound if cards match
      }
    } else {
      newlyFlippedCard.element.classList.remove("flipped"); // Flip cards back if no match
      lastCardFlipped.element.classList.remove("flipped");
    }
    lastCardFlipped = null; // Reset last flipped card
  }
}

// Function to reset the game state
function resetGame() {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = ''; // Clear card container
  document.getElementById("flip-count").innerText = "0"; // Reset flip count display
  document.getElementById("match-count").innerText = "0"; // Reset match count display
  counters = { flips: 0, matches: 0 }; // Reset counters object
  lastCardFlipped = null; // Reset last flipped card
  cardContainer.className = ''; // Clear game mode class from card container
  showStartPage(); // Show initial start page
}

// Function to display the initial start page and hide other game elements
function showStartPage() {
  const elements = ['start-page', 'game-container', 'reset-container'];
  elements.forEach(id => document.getElementById(id).style.display = 'none');
  document.getElementById('initial-start-page').style.display = 'block';
}

// Function to show level choices and hide initial start page
function showLevelChoices() {
  document.getElementById('initial-start-page').style.display = 'none';
  document.getElementById('start-page').style.display = 'block';
}

// Function to start the game with a specified mode
function startGame(mode) {
  gameMode = mode; // Set game mode
  const cardContainer = document.getElementById("card-container");
  cardContainer.className = mode; // Apply game mode class to card container
  document.getElementById("start-page").style.display = 'none'; // Hide start page
  document.getElementById("game-container").style.display = 'block'; // Show game container
  document.getElementById("reset-container").style.display = 'block'; // Show reset container
  setUpGame(); // Set up the game
}

// Event listener to show the initial start page when the DOM content is loaded
document.addEventListener("DOMContentLoaded", showStartPage);
