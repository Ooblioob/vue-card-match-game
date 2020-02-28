import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Card from "@/components/Card.vue";

describe("Card.vue", () => {
  it("Image property should get set based on value property", () => {
    const wrapper = shallowMount(Card, {
      propsData: {
        card: {
          id: 0,
          value: "2C",
          matched: false,
          flipped: false
        }
      },
      attrs: {
        position: 0
      }
    });
    expect(wrapper.vm.image).to.contain("2C");
  });

  it("Flip card should emit a cardClick event", async () => {
    const wrapper = shallowMount(Card, {
      propsData: {
        card: {
          id: 0,
          value: "2C",
          matched: false,
          flipped: false
        }
      },
      attrs: {
        position: 0
      }
    });

    wrapper.trigger("click");

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().cardClick).to.exist;
    expect(wrapper.emitted().cardClick[0][0]).to.equal(0);
  });

  it("Card has the class isFlipped when flipped is true", () => {
    const wrapper = shallowMount(Card, {
      propsData: {
        card: {
          id: 0,
          value: "2C",
          matched: false,
          flipped: true
        }
      },
      attrs: {
        position: 0
      }
    });

    expect(wrapper.classes("isFlipped")).to.be.true;
  });
});
