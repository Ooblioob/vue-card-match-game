import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";

Vue.use(Vuex);

export const state = {
  cards: []
};

export const getters = {
  cardsSelected: state => state.cards.filter(v => v.flipped && !v.matched),
  cardsMatched: state => state.cards.filter(v => v.matched),
  hasMatchingPair: state => index =>
    state.cards.some(
      (card, i) => card.value === state.cards[index].value && i !== index
    )
};

export const mutations = {
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
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  modules: {}
});
