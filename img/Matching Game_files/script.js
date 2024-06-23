let counters = {
  flips: 0,
  matches: 0
};

let lastCardFlipped = null;
let gameMode = 'regular'; // Default mode

function createNewCard() {
  const cardElement = document.createElement("div");
  cardElement.className = "card";
  cardElement.innerHTML = `
    <div class="card-down"></div>
    <div class="card-up"></div>
  `;
  return cardElement;
}

function appendNewCard(parentElement) {
  const cardElement = createNewCard();
  parentElement.appendChild(cardElement);
  return cardElement;
}

function shuffleCardImageClasses() {
  const cardClasses = [
    "image-1", "image-1", "image-2", "image-2", "image-3", "image-3",
    "image-4", "image-4", "image-5", "image-5", "image-6", "image-6",
    "image-7", "image-7", "image-8", "image-8", "image-9", "image-9",
    "image-10", "image-10"
  ];
  return _.shuffle(cardClasses).slice(0, getCardCount());
}

function getCardCount() {
  if (gameMode === 'easy') return 12;
  if (gameMode === 'hard') return 24;
  return 18;
}

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

function doCardsMatch(cardObject1, cardObject2) {
  return cardObject1.imageClass === cardObject2.imageClass;
}

function incrementCounter(counterName, parentElement) {
  counters[counterName] = (counters[counterName] || 0) + 1;
  parentElement.innerText = counters[counterName];
}

function onCardFlipped(newlyFlippedCard) {
  incrementCounter("flips", document.getElementById("flip-count"));

  if (!lastCardFlipped) {
    lastCardFlipped = newlyFlippedCard;
  } else {
    if (doCardsMatch(lastCardFlipped, newlyFlippedCard)) {
      incrementCounter("matches", document.getElementById("match-count"));
      newlyFlippedCard.element.classList.add("glow");
      lastCardFlipped.element.classList.add("glow");
      if (counters.matches === getCardCount() / 2) {
        winAudio.play();
      } else {
        matchAudio.play();
      }
    } else {
      newlyFlippedCard.element.classList.remove("flipped");
      lastCardFlipped.element.classList.remove("flipped");
    }
    lastCardFlipped = null;
  }
}

function resetGame() {
  const cardContainer = document.getElementById("card-container");
  while (cardContainer.firstChild) {
    cardContainer.removeChild(cardContainer.firstChild);
  }
  document.getElementById("flip-count").innerText = "0";
  document.getElementById("match-count").innerText = "0";
  counters = { flips: 0, matches: 0 };
  lastCardFlipped = null;
  showStartPage();
}

function showStartPage() {
  document.getElementById("start-page").style.display = 'block';
  document.getElementById("game-container").style.display = 'none';
  document.getElementById("reset-container").style.display = 'none';
}

function startGame(mode) {
  gameMode = mode;
  document.getElementById("start-page").style.display = 'none';
  document.getElementById("game-container").style.display = 'block';
  document.getElementById("reset-container").style.display = 'block';
  setUpGame();
}

function setUpGame() {
  const cardContainer = document.getElementById("card-container");
  const cardObjects = createCards(cardContainer, shuffleCardImageClasses());
  cardObjects.forEach(cardObject => {
    flipCardWhenClicked(cardObject);
  });
}

document.addEventListener("DOMContentLoaded", showStartPage);
