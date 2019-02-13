<template>
  <div class="content">
    <div class="content-layout">
      <div class="main-content">
        <MessageList
          class="height-100"
          :lang="'en-US'"
          :username="userId"
          :messages="messages"
          :moreHistoryMessagesToLoad="moreHistoryMessages"
          @load-history="loadMoreMessages()"
          @resend="message => resendMessage(message)"
        />

        <div class="message-input-form-holder">
          <form class="message-input-form input-flex-holder">
            <div class="message-input-holder">
              <textarea
                class="message-input-area"
                type="text"
                autofocus="true"
                :placeholder="'Type your message... (press Enter to send, Shift+Enter to add a new line)'"
                v-model="currentMessage"
                @keydown.shift.enter.prevent="addNewLine"
                @keydown.enter.exact.prevent="sendMessage"
              ></textarea>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MessageList from "./MessageList.vue";

export default {
  data() {
    return {
      userId: "user",
      channelId: 1,
      msgId: 4,
      messages: [
        {
          id: 1,
          sender: {
            id: 1,
            name: "Chat creator",
            avatar: require("../assets/avatar-default.jpg")
          },
          receiver: this.channelId,
          text: "Hi! This message has been sent yesterday",
          sentAt: Math.floor(Date.now() / 1000) - 86400,
          pending: false,
          failed: false,
          read: false
        },
        {
          id: 2,
          sender: {
            id: 1,
            name: "Chat creator",
            avatar: require("../assets/avatar-default.jpg")
          },
          receiver: this.channelId,
          text: "This message has been posted just an hour ago",
          sentAt: Math.floor(Date.now() / 1000) - 3600,
          pending: false,
          failed: false,
          read: false
        },
        {
          id: 3,
          sender: {
            id: 1,
            name: "Chat creator",
            avatar: require("../assets/avatar-default.jpg")
          },
          receiver: this.channelId,
          text: "And this one too.\n\nNow type yours 😃",
          sentAt: Math.floor(Date.now() / 1000) - 3600,
          pending: false,
          failed: false,
          read: false
        }
      ],
      moreHistoryMessages: false,
      currentMessage: ""
    };
  },
  components: { MessageList },
  methods: {
    sendMessage() {
      if (!this.currentMessage || this.currentMessage === "") return;
      this.messages.splice(
        this.messages.length,
        0,
        this.makeMessage(this.currentMessage)
      );
      this.currentMessage = "";
    },

    makeMessage(text) {
      return {
        id: this.msgId++,
        sender: {
          id: this.userId,
          name: this.userId,
          avatar: require("../assets/avatar-default.jpg")
        },
        receiver: this.channelId,
        text: text,
        sentAt: Math.floor(Date.now() / 1000), // in seconds
        pending: false,
        failed: false,
        read: false
      };
    },

    addNewLine() {
      this.insertAtCursor("\n");
    },

    insertAtCursor(value) {
      let field = document.querySelector("textarea.message-input-area");
      //IE
      if (document.selection) {
        field.focus();
        let sel = document.selection.createRange();
        sel.text = value;
        this.currentMessage = field.value;
      }
      //Mozilla and others
      else if (field.selectionStart || field.selectionStart === 0) {
        let startPos = field.selectionStart;
        let endPos = field.selectionEnd;
        field.value =
          field.value.substring(0, startPos) +
          value +
          field.value.substring(endPos, field.value.length);
        field.selectionStart = startPos + value.length;
        field.selectionEnd = startPos + value.length;
        this.currentMessage = field.value;
      } else {
        field.value += value;
        this.currentMessage = field.value;
      }
    },

    resendMessage(message) {
      //...
    },

    loadMoreMessages() {
      //...
    }
  }
};
</script>

<style lang='scss' scoped>
.height-100 {
  height: 100%;
}

.content {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 1px;
  background-color: #f4f4f9;
  overflow-y: hidden;
  height: 100%;
}

.content-layout {
  background: #f4f4f9;
  display: flex;
  flex: 1 auto;
  height: calc(100% - 90px);
}

.main-content {
  margin: 0;
  position: relative;
  display: flex;
  justify-content: flex-end;
  flex: 1;
  flex-direction: column;
  min-width: 1px;
  overflow-y: hidden;
  justify-content: normal;
}

.message-input-form-holder {
  display: block;
  width: 100%;
  background-color: white;
}

.message-input-area {
  display: block;
  background-color: #ffffff;
  resize: none;
  font-size: 16px;
  margin: 15px;
  padding: 4px;
  outline: 0;
  border: 1px solid #ddd;
  line-height: 20px;
  box-shadow: none;
  width: calc(100% - 41px);
  height: 2.5em;
}
</style>
