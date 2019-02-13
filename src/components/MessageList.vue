<template>
  <div class="conversation-messages-list"
       v-on:scroll="scrolled()">

    <div class="conversation-top-label" v-if="loadingHistoryMessages">
      Loading messages ...
    </div>
    <div class="conversation-top-label" v-else-if="moreHistoryMessagesToLoad">
      There are more messages to load
    </div>
    <div class="conversation-top-label" v-else>
      No messages in history
    </div>

    <div v-for="(message, index) in messagesInternal" :key="message.id">
      <div v-if="messageDateDiffer(message, messagesInternal[index - 1])" class="conversation-date-boundary">
        <span>{{formatDateBoundary(message)}}</span>
      </div>

      <Message :username="username"
                     :message="message"
                     :isFirst="messageDateDiffer(message, messagesInternal[index - 1]) || messageSenderDiffer(message, messagesInternal[index - 1])"
                     @resend="message => $emit('resend', message)"/>
    </div>

  </div>
</template>


<script>
  import Message from './Message.vue';

  export default {
    data() {
      return {
        loadingHistoryMessages: false,
        scrollPositionFromBottom: 0,
      };
    },
    components: { Message },
    props: ['username', 'messages', 'moreHistoryMessagesToLoad', 'lang'],
    computed: {
      messagesInternal() {
        this.saveScrollPosition();
        return this.messages;
      },
    },
    watch: {
      messagesInternal() {
        this.loadingHistoryMessages = false;
        this.$nextTick(() => this.restoreScrollPosition());
      },
      moreHistoryMessagesToLoad() {
        // reset loading indicator
        if (!this.moreHistoryMessagesToLoad) { this.loadingHistoryMessages = false; }
      },
    },
    mounted() {
      this.messagesListEl = document.querySelector('.conversation-messages-list');
      this.scrollPositionFromBottom = this.messagesListEl.scrollHeight - this.messagesListEl.clientHeight - this.messagesListEl.scrollTop;
    },
    methods: {
      saveScrollPosition() {
        if (this.messagesListEl) { this.scrollPositionFromBottom = this.messagesListEl.scrollHeight - this.messagesListEl.clientHeight - this.messagesListEl.scrollTop; }
        if (this.scrollPositionFromBottom < 30) { this.scrollPositionFromBottom = 0; }
      },
      restoreScrollPosition() {
        this.messagesListEl.scroll(0, this.messagesListEl.scrollHeight - this.messagesListEl.clientHeight - this.scrollPositionFromBottom);
      },
      scrolled(evt) {
        if (this.messagesListEl.scrollTop === 0) {
          if (this.moreHistoryMessagesToLoad && !this.loadingHistoryMessages) {
            this.loadingHistoryMessages = true;
            setTimeout(() => {
              this.$emit('load-history');
            }, 300);
          }
        }
      },

      messageSenderDiffer(message1, message2) {
        return !!message1 && !!message2 && message1.sender.id !== message2.sender.id;
      },

      messageDateDiffer(message1, message2) {
        if (!message1 || !message2) { return true; } // change to false to remove boundary before the first message

        const offset = new Date().getTimezoneOffset();
        const seconds1 = message1.sentAt - offset * 60;
        const seconds2 = message2.sentAt - offset * 60;

        return Math.trunc(seconds1 / 86400) !== Math.trunc(seconds2 / 86400);
      },

      formatDateBoundary(message) {
        const date = new Date(message.sentAt * 1000);
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString(this.lang, options);
      },
    },
  };
</script>

<style lang='scss' scoped>
  .conversation-messages-list {
    width: auto;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    padding: 15px;
  }

  .conversation-top-label {
    margin: .8em auto 1em;
    background: none;
    color: #a0aebf;
    text-align: center;
  }

  .conversation-date-boundary {
    margin: 1em;
    color: #a0aebf;
    line-height: 15px;
    text-align: center;

    span {
      display: inline-block;
      position: relative;

      &:before {
        right: 100%;
      }

      &:after {
        left: 100%;
      }
    }
  }
</style>
