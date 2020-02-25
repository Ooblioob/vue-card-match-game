/// <reference types="Cypress" />
// https://docs.cypress.io/api/introduction/api.html

function findTwoMatchingCards(cards, hasMatchingPairHandler) {
  // returns indexes of 2 cards that match (that aren't marked as matched)

  let index1 = cards.findIndex(
    (card, i) => hasMatchingPairHandler(i) && !card.matched
  );
  let index2 = cards.findIndex(
    (matchingCard, j) =>
      j !== index1 &&
      cards[index1].value === matchingCard.value &&
      !matchingCard.matched
  );

  return [index1, index2];
}

function findTwoNonMatchingCards(cards) {
  let index1 = cards.findIndex(card => !card.matched);
  let index2 = cards.findIndex(
    (nonMatchingCard, j) =>
      nonMatchingCard.value !== cards[index1].value &&
      !nonMatchingCard.matched &&
      j !== index1
  );

  return [index1, index2];
}

describe("Card Matching Game tests", () => {
  beforeEach(function() {
    cy.visit("/");
    cy.get(".card").as("cards");
  });

  describe("Initial Game Setup", () => {
    it("Displays instructions for the game at the top", () => {
      cy.contains("h1", "Match the pairs");
    });
  });

  describe("Card Matching", () => {
    beforeEach(function() {
      cy.visit("/");
      cy.get(".card").as("cards");
    });

    it("2 matched cards should remain flipped", () => {
      cy.window()
        .its("app.$store")
        .then(store => {
          let [index1, index2] = findTwoMatchingCards(
            store.state.cards,
            store.getters.hasMatchingPair
          );
          expect(index1).to.not.equal(-1);
          expect(index2).to.not.equal(-1);

          cy.get("@cards")
            .eq(index1)
            .click();

          cy.get("@cards")
            .eq(index2)
            .click();

          cy.get("@cards")
            .eq(index1)
            .should("have.class", "isFlipped");

          cy.get("@cards")
            .eq(index2)
            .should("have.class", "isFlipped");
        });
    });

    it("2 unmatched cards should get flipped back over", () => {
      cy.window()
        .its("app.$store")
        .then(store => {
          let [index1, index2] = findTwoNonMatchingCards(store.state.cards);

          cy.get("@cards")
            .eq(index1)
            .click();

          cy.get("@cards")
            .eq(index2)
            .click();

          cy.get("@cards")
            .eq(index1)
            .should("not.have.class", "isFlipped");

          cy.get("@cards")
            .eq(index2)
            .should("not.have.class", "isFlipped");
        });
    });

    it("if 2 cards match, but the next 2 cards don't, unflip ONLY the two unmatchd cards", () => {
      // First, flip 2 matching cards
      cy.window()
        .its("app.$store")
        .then(store => {
          let [index1, index2] = findTwoMatchingCards(
            store.state.cards,
            store.getters.hasMatchingPair
          );

          cy.get("@cards")
            .eq(index1)
            .click();

          cy.get("@cards")
            .eq(index2)
            .click();

          cy.get("@cards")
            .eq(index1)
            .should("have.class", "isFlipped");

          cy.get("@cards")
            .eq(index2)
            .should("have.class", "isFlipped");
        });

      // Now flip 2 unmatching cards
      cy.window()
        .its("app.$store")
        .then(store => {
          let [index3, index4] = findTwoNonMatchingCards(store.state.cards);

          cy.get("@cards")
            .eq(index3)
            .click();

          cy.get("@cards")
            .eq(index4)
            .click();

          cy.get("@cards")
            .eq(index3)
            .should("not.have.class", "isFlipped");

          cy.get("@cards")
            .eq(index4)
            .should("not.have.class", "isFlipped");
        });
    });

    it("if 2 matching pairs are flipped, and then 2 more matching pairs are flipped, all cards stay flipped", () => {
      // First, flip 2 matching cards
      cy.window()
        .its("app.$store")
        .then(store => {
          let [index1, index2] = findTwoMatchingCards(
            store.state.cards,
            store.getters.hasMatchingPair
          );

          cy.get("@cards")
            .eq(index1)
            .click();

          cy.get("@cards")
            .eq(index2)
            .click();

          cy.get("@cards")
            .eq(index1)
            .should("have.class", "isFlipped");

          cy.get("@cards")
            .eq(index2)
            .should("have.class", "isFlipped");
        });

      // Now flip 2 more matching cards
      cy.window()
        .its("app.$store")
        .then(store => {
          let [index3, index4] = findTwoMatchingCards(
            store.state.cards,
            store.getters.hasMatchingPair
          );

          cy.get("@cards")
            .eq(index3)
            .click();

          cy.get("@cards")
            .eq(index4)
            .click();

          cy.get("@cards")
            .eq(index3)
            .should("have.class", "isFlipped");

          cy.get("@cards")
            .eq(index4)
            .should("have.class", "isFlipped");
        });
    });
  });

  describe("Winning the game", () => {
    beforeEach(function() {
      cy.visit("/");
      cy.get(".card").as("cards");
    });

    it("When all matches are found you should see 'You Win'", () => {
      for (let i = 0; i < 4; i++) {
        // Flip a pair of matching cards
        cy.window()
          .its("app.$store")
          .then(store => {
            let [index1, index2] = findTwoMatchingCards(
              store.state.cards,
              store.getters.hasMatchingPair
            );

            cy.get("@cards")
              .eq(index1)
              .click();

            cy.get("@cards")
              .eq(index2)
              .click();

            cy.get("@cards")
              .eq(index1)
              .should("have.class", "isFlipped");

            cy.get("@cards")
              .eq(index2)
              .should("have.class", "isFlipped");
          });
      }
      cy.get("h1").contains("You Win!");
    });
  });

  describe("Start Over button", () => {
    beforeEach(function() {
      cy.visit("/");
      cy.get(".card").as("cards");
      cy.get("button")
        .contains("Start Over")
        .as("startOver");
    });

    it("Clicking Start Over gives new values for all the cards", () => {
      let originalCards;
      cy.window()
        .its("app.$store")
        .then(store => {
          originalCards = store.state.cards;
        });

      cy.get("@startOver").click();

      cy.window()
        .its("app.$store")
        .then(store => {
          expect(store.state.cards).to.not.deep.equal(originalCards);
        });
    });

    it("Clicking Start Over unflips all cards", () => {
      cy.get("@cards")
        .eq(0)
        .click();

      cy.get("@startOver").click();

      cy.get("@cards").each(card => {
        cy.wrap(card).should("not.have.class", "isFlipped");
      });
    });

    it("after winning clicking Start Over should reset the 'You Win' message to the starting instructions", () => {
      for (let i = 0; i < 4; i++) {
        // Flip a pair of matching cards
        cy.window()
          .its("app.$store")
          .then(store => {
            let [index1, index2] = findTwoMatchingCards(
              store.state.cards,
              store.getters.hasMatchingPair
            );

            cy.get("@cards")
              .eq(index1)
              .click();

            cy.get("@cards")
              .eq(index2)
              .click();
          });
      }

      cy.get("@startOver").click();

      cy.contains("h1", "Match the pairs");
    });
  });

  describe("Unflip button", () => {
    beforeEach(function() {
      cy.visit("/");
      cy.get(".card").as("cards");
    });

    it("Unflip a single card that is flipped", () => {
      cy.get("@cards")
        .eq(0)
        .click()
        .as("flippedCard");

      cy.get("button")
        .contains("Unflip")
        .click();

      cy.get("@flippedCard").should("not.have.class", "isFlipped");
    });

    it("Clicking Unflip doesn't cause other unflipped cards to accidentally flip (with no cards flipped)", () => {
      cy.get("button")
        .contains("Unflip")
        .click();

      cy.get("@cards").each(card => {
        cy.wrap(card).should("not.have.class", "isFlipped");
      });
    });

    it("Clicking Unflip doesn't cause other unflipped cards to accidentally flip (with some cards flipped)", () => {
      // Flip the 3rd card
      cy.get("@cards")
        .eq(2)
        .click();

      // Now press unflip
      cy.get("button")
        .contains("Unflip")
        .click();

      // Assert that all cards are returned to unflipped
      cy.get("@cards").each(card => {
        cy.wrap(card).should("not.have.class", "isFlipped");
      });
    });
  });

  describe("Shuffle Button", () => {
    beforeEach(function() {
      cy.visit("/");
      cy.get(".card").as("cards");
      cy.window()
        .its("app.$store")
        .then(store => {
          cy.wrap(store.state.cards).as("originalCards");
        });
    });

    it("Clicking shuffle randomizes the order of cards", () => {
      cy.get("button")
        .contains("Shuffle")
        .click();

      cy.window()
        .its("app.$store")
        .then(store => {
          cy.get("@originalCards").then(originalCards => {
            expect(store.state.cards.map(v => v.id)).to.not.deep.equal(
              originalCards.map(v => v.id)
            );
          });
        });
    });

    it("Clicking shuffle does NOT change the value of cards", () => {
      cy.get("button")
        .contains("Shuffle")
        .click();

      cy.window()
        .its("app.$store")
        .then(store => {
          cy.get("@originalCards").then(originalCards => {
            expect(store.state.cards.sort((a, b) => a.id - b.id)).to.deep.equal(
              originalCards.sort((a, b) => a.id - b.id)
            );
          });
        });
    });

    it("Clicking shuffle causes any flipped cards to stay flipped in their new location", () => {
      cy.get("@cards")
        .eq(0)
        .click();

      cy.get("button")
        .contains("Shuffle")
        .click();

      cy.window()
        .its("app.$store")
        .then(store => {
          cy.get("@originalCards").then(originalCards => {
            let newIndex = store.state.cards.findIndex(
              card => card.id === originalCards[0].id
            );

            // reference to @cards is stale, so get new one
            cy.get(".card")
              .as("cards")
              .eq(newIndex)
              .should("have.class", "isFlipped");
          });
        });
    });
  });
});
