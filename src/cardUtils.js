export const CARD_VALUES = (function() {
  let deck = [];
  for (let i = 2; i <= 14; i++) {
    let num = 0;
    switch (i) {
      case 11:
        num = "J";
        break;
      case 12:
        num = "Q";
        break;
      case 13:
        num = "K";
        break;
      case 14:
        num = "A";
        break;
      default:
        num = i;
    }
    deck.push(num + "C");
    deck.push(num + "S");
    deck.push(num + "D");
    deck.push(num + "H");
  }
  return deck;
})();
