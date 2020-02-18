<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <button @click="unflipAndReset">Start Over?</button>
    <button @click="shuffle">Shuffle</button>
    <button @click="unflip">Unflip</button>

    <transition-group name="card" tag="div" class="container">
      <div
        v-for="(n, i) in deckSize"
        v-bind:key="cards[i].index"
        class="card"
        @click="flipCard(i)"
        :class="{ isFlipped: cards[i].flipped }"
      >
        <div class="card-front">
          <img src="./assets/cards/blue_back.jpg" />
        </div>
        <div class="card-back">
          <img v-bind:src="cards[i].image" />
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import _ from "lodash";
import { CARD_VALUES } from "./cardUtils.js";

export default {
  name: "App",
  components: {},
  data: function() {
    return {
      cards: [],
      deckSize: 9,
      msg: "Match the pairs"
    };
  },
  created: function() {
    this.reset();
  },
  computed: {
    cardsSelected: function() {
      return this.cards.filter(i => i.flipped && !i.matched);
    },
    cardsMatched: function() {
      return this.cards.filter(i => i.matched);
    }
  },
  methods: {
    flipCard: function(n) {
      if (!this.cards[n].flipped) {
        if (this.cardsSelected.length < 2) {
          this.cards[n].flipped = !this.cards[n].flipped;
        }
        this.checkForMatch();
        this.checkForWin();
      }
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
      this.cardsSelected.forEach(i => (i.matched = true));
    },
    unsuccessfulMatch: function() {
      let vm = this;
      setTimeout(() => vm.cardsSelected.map(i => (i.flipped = false)), 1000);
    },
    checkForWin: function() {
      if (this.cardsMatched.length === Math.floor(this.deckSize / 2)) {
        this.msg = "You Win!";
      }
    },
    reset: function() {
      this.cards = [...new Array(this.deckSize)];
      for (let i = 0; i < this.cards.length; i++) {
        let value =
          i % 2 === 0
            ? CARD_VALUES[_.random(CARD_VALUES.length)]
            : this.cards[i - 1].value;
        this.cards[i] = {
          index: i,
          flipped: false,
          value: value,
          image: require("./assets/cards/" + value + ".jpg"),
          matched: false
        };
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
    shuffle: function() {
      this.cards = _.shuffle(this.cards);
    },
    unflip: function() {
      this.cards.forEach(v => ((v.flipped = false), (v.matched = false)));
    }
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

.card {
  height: 30%;
  width: 30%;
  margin-top: auto;
  margin-bottom: auto;

  /* animation stuff */
  position: relative;
  transition: transform 1s;
  transform-style: preserve-3d;
}

.card-front {
  position: absolute;
  height: 100%;
  width: 100%;

  /* only needed if using a non-image block */
  /* backface-visibility: hidden; */
}

.card-front img,
.card-back img {
  height: inherit;
}

.card-back {
  transform: rotateY(180deg);
  height: 100%;
  width: 100%;
}

.card.isFlipped {
  transform: rotateY(180deg);
}

.card-move {
  transition: transform 1s;
}
</style>
