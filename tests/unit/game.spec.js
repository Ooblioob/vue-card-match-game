import { expect } from "chai";
import sinon from "sinon";
import { mount } from "@vue/test-utils";
import Game from "@/App.vue";

import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import storeConfig from "./configs/card-store-config";
import { cloneDeep } from "lodash";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Game.vue", () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig));
  });

  describe("Initialize", () => {
    let wrapper;
    let spy;
    beforeEach(() => {
      spy = sinon.spy();
      wrapper = mount(Game, {
        store,
        localVue,
        methods: {
          shuffle: spy
        }
      });
    });

    it("Renders 9 cards by default", () => {
      expect(wrapper.findAll(".card").length).to.equal(9);
    });

    it("Game instructions set to 'Match the pairs'", () => {
      expect(wrapper.find("h1").text()).equals("Match the pairs");
    });

    it("Shuffle the cards into a random order", () => {
      expect(spy.calledOnce).to.be.true;
    });
  });
});
