<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <button @click="unflipAndReset">Start Over?</button>
    <button @click="shuffle">Shuffle</button>
    <button @click="unflip">Unflip</button>

    <transition-group name="card" tag="div" class="container">
      <card
        v-for="(card, i) in cards"
        v-bind:key="card.id"
        v-bind:card="card"
        v-bind:position="i"
        v-on:cardClick="onCardClick"
      >
      </card>
    </transition-group>
  </div>
</template>

<script>
import _ from "lodash";
import { CARD_VALUES } from "./cardUtils.js";
import Card from "./components/Card.vue";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    Card
  },
  data: function() {
    return {
      deckSize: 9,
      msg: "Match the pairs"
    };
  },
  created: function() {
    this.initialize();
  },
  computed: {
    ...mapState({
      cards: state => state.cards
    }),
    ...mapGetters(["cardsSelected", "cardsMatched"])
  },
  methods: {
    onCardClick: function(index) {
      this.$store.commit("flipCard", { index });
      this.checkForMatch();
      this.checkForWin();
    },
    checkForMatch: function() {
      if (this.cardsSelected.length == 2) {
        if (this.cardsSelected[0].value === this.cardsSelected[1].value) {
          this.successfulMatch();
        } else {
          this.unsuccessfulMatch();
        }
      }
    },
    successfulMatch: function() {
      this.$store.commit("matchSelectedCards");
    },
    unsuccessfulMatch: function() {
      let vm = this;
      setTimeout(() => vm.$store.commit("unflipUnmatchedCards"), 1000);
    },
    checkForWin: function() {
      if (this.cardsMatched.length === Math.floor(this.deckSize / 2) * 2) {
        this.msg = "You Win!";
      }
    },
    reset: function() {
      this.$store.commit("removeAllCards");
      this.initialize();
    },
    initialize: function() {
      for (let i = 0; i < this.deckSize; i++) {
        let value =
          i % 2 === 0
            ? CARD_VALUES[_.random(CARD_VALUES.length - 1)]
            : this.cards[i - 1].value;
        this.$store.commit("addCard", {
          id: i,
          flipped: false,
          value: value,
          matched: false
        });
      }
      this.msg = "Match the pairs";
      this.shuffle();
    },
    unflipAndReset: function() {
      if (this.cards.some(v => v.flipped)) {
        this.unflip();

        // wait for the animation to complete
        let vm = this;
        setTimeout(() => vm.reset(), 1000);
      } else {
        this.reset();
      }
    },
    unflip: function() {
      this.$store.commit("unflipAllCards");
    },
    shuffle: function() {
      this.$store.commit("shuffle");
    },
    ...mapActions(["shuffleCards"])
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.container {
  border-style: solid;
  border-width: 2px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 600px;
  height: 600px;
  margin-left: auto;
  margin-right: auto;
  /* animation stuff */
  perspective: 600px;
}

.card-move {
  transition: transform 1s;
}
</style>
