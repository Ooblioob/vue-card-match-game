<template>
  <div id="app">
    <div class="container">
      <div
        v-for="(n, i) in 9"
        v-bind:key="i"
        class="card"
        @click="flipCard(i)"
        :class="{ isFlipped: cardsFlipped[i] }"
      >
        <div class="card-front">front</div>
        <div class="card-back">back</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data: function() {
    return {
      cardsFlipped: new Array(9).fill(false),
      flipMe: false
    };
  },
  methods: {
    flipCard: function(n) {
      this.$set(this.cardsFlipped, n, !this.cardsFlipped[n]);
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
  background: blue;
  transform: rotateY(180deg);
}

.card.isFlipped {
  transform: rotateY(180deg);
}
</style>
