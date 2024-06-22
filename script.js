// Declare counters globally to track the game counts
let counters = {
    flips: 0,
    matches: 0
  };
  
  // Variable to keep track of the last card flipped
  let lastCardFlipped = null;
  //hi
  // Create a new card element that is not yet attached to the DOM
  function createNewCard() {
    const cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.innerHTML = `
      <div class="card-down"></div>
      <div class="card-up"></div>
    `;
    return cardElement;
  }
  
  // Append a new card to the specified parent element
  function appendNewCard(parentElement) {
    const cardElement = createNewCard();
    parentElement.appendChild(cardElement);
    return cardElement;
  }
  
  // Generate a shuffled array of card image classes using Underscore.js
  function shuffleCardImageClasses() {
    const cardClasses = [
      "image-1", "image-1", "image-2", "image-2", "image-3", "image-3",
      "image-4", "image-4", "image-5", "image-5", "image-6", "image-6"
    ];
    return _.shuffle(cardClasses);
  }
  
  // Create cards with random images and manage them as objects
  function createCards(parentElement, shuffledImageClasses) {
    const cardObjects = [];
    for (let i = 0; i < 12; i++) {
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
  
  // Check if two card objects match
  function doCardsMatch(cardObject1, cardObject2) {
    return cardObject1.imageClass === cardObject2.imageClass;
  }
  
  // Increment a game counter displayed in the UI
  function incrementCounter(counterName, parentElement) {
    counters[counterName] = (counters[counterName] || 0) + 1;
    parentElement.innerText = counters[counterName];
  }
  
  // Handle game logic when a card is flipped
  function onCardFlipped(newlyFlippedCard) {
    incrementCounter("flips", document.getElementById("flip-count"));
  
    if (!lastCardFlipped) {
      lastCardFlipped = newlyFlippedCard;
    } else {
      if (doCardsMatch(lastCardFlipped, newlyFlippedCard)) {
        incrementCounter("matches", document.getElementById("match-count"));
        newlyFlippedCard.element.classList.add("glow");
        lastCardFlipped.element.classList.add("glow");
        if (counters.matches === 6) {
          winAudio.play();  // Ensure winAudio is defined and loaded correctly
        } else {
          matchAudio.play();  // Ensure matchAudio is defined and loaded correctly
        }
      } else {
        newlyFlippedCard.element.classList.remove("flipped");
        lastCardFlipped.element.classList.remove("flipped");
      }
      lastCardFlipped = null;
    }
  }
  
  // Reset the game to the initial state
  function resetGame() {
    const cardContainer = document.getElementById("card-container");
    while (cardContainer.firstChild) {
      cardContainer.removeChild(cardContainer.firstChild);
    }
    document.getElementById("flip-count").innerText = "0";
    document.getElementById("match-count").innerText = "0";
    counters = { flips: 0, matches: 0 };  // Reinitialize counters
    lastCardFlipped = null;
    setUpGame();  // Ensure setUpGame() is defined and works correctly
  }
  
  // Initial game setup
  setUpGame();
  