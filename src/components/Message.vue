<template>
  <div>
    <div
      class="message-block"
      :class="[isSelf ? 'message-block-self' : '', isFirst ? '' : 'message-block-next']"
      :id="message.id"
    >
      <div class="message-content">
        <div class="message-avatar">
          <img :src="message.sender.avatar" alt="avatar">
        </div>

        <div class="message-bubble">
          <div class="message-head">
            <span class="message-sender">{{ usernameArranged }}</span>
            <span class="message-timestamp">{{ messageStatusText }}</span>
          </div>
          <div class="message-body" v-html="sanitizedMessage"></div>
        </div>
      </div>

      <div v-cloak v-if="message.failed" class="message-resend">
        Error while sending message.
        <a
          @click="$emit('resend', message)"
          href="javascript:void(0)"
        >Resend</a>.
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import sanitizeHtml from "sanitize-html";

const EMOJI_REGEX = /((?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff]))/g;

export default {
  data() {
    return {};
  },
  props: ["username", "message", "isFirst"],
  computed: {
    senderId() {
      return this.message.sender.id
        ? this.message.sender.id
        : this.message.sender;
    },
    senderName() {
      return this.message.sender.name
        ? this.message.sender.name
        : this.message.sender;
    },
    isSelf() {
      return this.senderId === this.username;
    },

    usernameArranged() {
      if (this.isSelf) {
        return "Me";
      }

      return this.senderName;
    },

    messageStatusText() {
      if (this.message.pending) {
        return "sending...";
      }

      return this.formatTime(this.message.sentAt);
    },

    sanitizedMessage() {
      let sanitizedBody = sanitizeHtml(this.message.text, {
        allowedTags: ["a", "img"],
        allowedAttributes: {
          a: ["href"],
          img: ["src"]
        }
      });
      sanitizedBody = this.formatEmoji(sanitizedBody);
      sanitizedBody = this.formatLineBreak(sanitizedBody);

      return sanitizedBody;
    }
  },
  methods: {
    formatTime(timestamp) {
      return moment.unix(timestamp).format("HH:mm");
    },
    formatEmoji(str) {
      return str.replace(EMOJI_REGEX, '<span class="emoji">$1</span>');
    },
    formatLineBreak(str) {
      return str.replace(/\n/g, "<br/>");
    }
  }
};
</script>

<style lang='scss' scoped>
$border-radius: 20px;

img {
  max-width: 100%;
}

.message-block {
  display: block;
  text-align: start;

  .message-content {
    display: block;

    .message-avatar {
      display: inline-block;
      vertical-align: top;
      margin: 0 10px 0 0;

      img {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 50%;
        border: solid 1px white;
      }
    }

    .message-bubble {
      max-width: 80%;
      text-align: start;
      display: inline-block;
      margin: 0 0 2px 0;
      border-radius: 0 $border-radius $border-radius $border-radius;
      background-color: white;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.07);

      .message-head {
        margin: 7px 10px 5px 15px;

        .message-sender {
          margin: 0 5px 0 0;
          color: #333333;
          font-size: 0.8em;
          font-weight: 600;
          line-height: 15px;
        }

        .message-timestamp {
          margin: 0 5px 0 0;
          color: #a8b8cb;
          font-size: 12px;
          line-height: 15px;
        }
      }

      .message-body {
        display: block;
        margin: 0 15px 7px;
        color: #333333;
        line-height: 19px;

        .preview-icon {
          display: inline-block;
          height: 55px;
          width: 55px;
          margin-right: 0.6em;
          object-fit: contain;
          vertical-align: middle;
        }

        .preview-message {
          display: inline-block;
          vertical-align: middle;
        }
      }

      a.message-body {
        cursor: pointer;
        color: #2d63f7;
      }
    }
  }

  .message-resend {
    margin: 0 0 1px 0;
    color: #b94a48;
  }
}

.message-block-next {
  .message-content {
    .message-avatar {
      display: none;
    }

    .message-bubble {
      margin-left: 56px;
      border-radius: $border-radius $border-radius $border-radius $border-radius;
    }
  }
}

.message-block-self {
  text-align: end;

  .message-content {
    .message-avatar {
      display: none;
    }

    .message-bubble {
      border-radius: $border-radius 0 $border-radius $border-radius;
      background-color: #319bdc;

      .message-head {
        .message-sender {
          color: white;
        }

        .message-timestamp {
          color: white;
        }
      }

      .message-body {
        color: white;
      }
    }
  }
}

.message-block-self.message-block-next {
  .message-content {
    .message-bubble {
      border-radius: $border-radius $border-radius $border-radius $border-radius;
    }
  }
}
</style>
