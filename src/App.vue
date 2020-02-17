<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <div class="container">
      <div
        v-for="(n, i) in 9"
        v-bind:key="i"
        class="card"
        @click="flipCard(i)"
        :class="{ isFlipped: cards[i].flipped }"
      >
        <div class="card-front">front</div>
        <div class="card-back" v-bind:style="{ background: cards[i].color }">
          back
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var shuffle = require("shuffle-array");
let colors = [
  "red",
  "red",
  "blue",
  "blue",
  "green",
  "green",
  "purple",
  "purple",
  "brown"
];

export default {
  name: "App",
  components: {},
  data: function() {
    return {
      cards: [...new Array(9)].map(function(_, i) {
        return {
          flipped: false,
          color: colors[i],
          matched: false
        };
      }),
      msg: "Match the pairs"
    };
  },
  created: function() {
    shuffle(this.cards);
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
      if (this.cardsSelected.length < 2) {
        this.cards[n].flipped = !this.cards[n].flipped;
      }
      this.checkForMatch();
      this.checkForWin();
    },
    checkForMatch: function() {
      if (this.cardsSelected.length == 2) {
        if (this.cardsSelected[0].color === this.cardsSelected[1].color) {
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
      if (this.cardsMatched.length === 8) {
        this.msg = "You Win!";
      }
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
  background-color: #b5d2cb;
  line-height: 11;
  font-family: "Arial Black", Gadget, sans-serif;
  color: #ffffff;

  /* animation stuff */
  position: relative;
  transition: transform 1s;
  transform-style: preserve-3d;
}

.card-front {
  position: absolute;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
  height: 100%;
  width: 100%;
}

.card.isFlipped {
  transform: rotateY(180deg);
}
</style>
