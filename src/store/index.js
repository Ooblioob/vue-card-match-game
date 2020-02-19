import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cards: []
  },
  getters: {
    cardsSelected: state => state.cards.filter(v => v.flipped && !v.matched),
    cardsMatched: state => state.cards.filter(v => v.matched),
    getCard: state => index => state.cards[index]
  },
  mutations: {
    addCard(state, payload) {
      state.cards.push({
        id: payload.id,
        value: payload.value,
        matched: payload.matched,
        flipped: payload.flipped
      });
    },
    flipCard(state, payload) {
      state.cards[payload.index].flipped = !state.cards[payload.index].flipped;
    },
    shuffle(state) {
      state.cards = _.shuffle(state.cards);
    },
    matchSelectedCards(state) {
      state.cards
        .filter(v => v.flipped && !v.matched)
        .forEach(v => (v.matched = true));
    },
    removeAllCards(state) {
      state.cards = [];
    },
    unflipUnmatchedCards(state) {
      state.cards
        .filter(v => v.flipped && !v.matched)
        .forEach(v => (v.flipped = false));
    },
    unflipAllCards(state) {
      state.cards.forEach(v => (v.flipped = false));
    }
  },
  modules: {}
});
