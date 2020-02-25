/// <reference types="Cypress" />
// https://docs.cypress.io/api/introduction/api.html

describe("Card Flipping", () => {
  beforeEach(function() {
    cy.visit("/", {
      onBeforeLoad: win => {
        cy.stub(win.Math, "random").returns(0);
      }
    });
    cy.get(".card").as("cards");
    cy.get("@cards")
      .first()
      .as("firstCard");
  });

  it("Flip a card when clicked on", () => {
    cy.get("@firstCard")
      .click()
      .should("have.class", "isFlipped");
  });

  it("Don't flip other cards when flipping a card", () => {
    cy.get("@firstCard")
      .click()
      .should("have.class", "isFlipped");

    cy.get("@cards")
      .next() // skip first card
      .each(el => {
        cy.wrap(el).should("not.have.class", "isFlipped");
      });
  });

  it("Confirm the card backside shows and is a valid image (stubbed to value 2C)", () => {
    cy.get("@firstCard").click();

    // confirm the image src returns a 200
    cy.get("@firstCard")
      .find(".card-back img")
      .then(el => {
        cy.request(el.prop("src"));
      });

    // confirm src renders with the stubbed value we want
    cy.get("@firstCard")
      .find(".card-back img")
      .should("be.visible")
      .and("have.attr", "src")
      .and("contain", "2C");
  });
});
