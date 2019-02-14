import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Chat from "@/components/Chat";

const localVue = createLocalVue();
localVue.use(Chat);
localVue.use(Vuex);

const MESSAGE_TEXT = "Message text";

describe("Chat", () => {
  let wrapper;
  const $route = {
    path: "/",
    hash: "",
    params: {}
  };

  let store = new Vuex.Store({
    getters: {
      currentUser: () => () => ({
        id: 1
      })
    },
    actions: {}
  });

  describe("Messaging", () => {
    beforeEach(() => {
      wrapper = shallowMount(Chat, {
        localVue,
        sync: false,
        store,
        mocks: { $route }
      });
    });

    it("should send a message", async () => {
      wrapper.vm.sendMessage = jest.fn(() => {
        let message = wrapper.vm.makeMessage(wrapper.vm.currentMessage);
        wrapper.vm.putMessage(message);
      });

      await wrapper.setData({
        currentMessage: MESSAGE_TEXT
      });

      wrapper
        .find("textarea")
        .trigger("keydown", { key: "Enter", keyCode: 13 });

      expect(wrapper.vm.sendMessage).toHaveBeenCalled();
      expect(wrapper.vm.messages.length).toBe(4);
      expect(wrapper.vm.messages[3].text).toBe(MESSAGE_TEXT);
    });
  });
});
