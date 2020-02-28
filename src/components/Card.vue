<template>
  <div @click="flipCard" class="card" :class="{ isFlipped: card.flipped }">
    <div class="card-front">
      <img src="../assets/cards/blue_back.jpg" />
    </div>
    <div class="card-back">
      <img v-bind:src="image" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["card"],
  data: function() {
    return {};
  },
  computed: {
    image: function() {
      return require("../assets/cards/" + this.card.value + ".jpg");
    }
  },
  methods: {
    flipCard: function() {
      this.$emit("cardClick", this.$attrs.position);
    }
  }
};
</script>

<style>
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
</style>
