<template>
  <div class="txt" :class="{ 'msg-img-box': msg.type === 'img', [msg.type]: true }">
    <template v-if="['txt'].includes(msg.type)">
      <div class="origin-txt">
        <div class="msg-txt" v-html="msg.html.source"></div>
      </div>

      <div class="translate-txt" v-if="msg.html.translation">
        <div class="msg-txt" v-html="msg.html.translation"></div>
      </div>
    </template>

    <!-- todo 收到和发送的礼物 -->
    <template v-if="['gift', 'friend'].includes(msg.type)">
      <div class="origin-txt" v-html="msg.html.source"></div>
    </template>

    <!-- 索要礼物 -->
    <template v-if="['giftAsk'].includes(msg.type)">
      <div class="origin-txt">
        <div class="msg-txt" v-html="msg.html.source"></div>
      </div>
      <div class="translate-txt" v-if="msg.html.translation">
        <div class="msg-txt" v-html="msg.html.translation"></div>
      </div>
    </template>

    <template v-if="['img', 'video'].includes(msg.type)">
      <div class="origin-txt" ref="imgBox" v-html="msg.html.source" @click="itemClick(msg)">
      </div>
    </template>

    <template v-if="['system'].includes(msg.type)">
      <div class="system-box" @click="itemClick(msg)">
        <div class="msg-img" v-if="msg.html.image"><img :src="msg.html.image" alt="" srcset=""></div>
        <div class="msg-txt" v-html="msg.html.source"></div>
        <div class="msg-link" v-if="msg.html.target"><a>{{$t('app.view_detail')}}</a></div>
      </div>
    </template>
  </div>
</template>

<script>
import { decodeMessage, parseShowMsg, parseShowMsgInVideo } from '@/util/process';

export default {
  name: 'MsgItem',
  data () {
    return {
      isOblong: false
    };
  },
  props: {
    message: {
      type: Object,
      default () {
        return {};
      }
    },
    isInVideo: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    msg () {
      const { content: data } = this.message;
      const jsonMsg = decodeMessage(data);

      if (this.isInVideo) {
        const { content } = jsonMsg;

        // todo 视频内消息处理
        try {
          const jsonContent = JSON.parse(content);
          if (typeof jsonContent === 'object') {
            return parseShowMsgInVideo(jsonMsg);
          }
        } catch (error) {

        }
      }
      return parseShowMsg(jsonMsg);
    }
  },
  methods: {
    itemClick (msg) {
      const message = {
        msg,
        isOblong: this.isOblong
      };
      this.$emit('click', message);
    },
    setScrollHeight () {
      if (this.msg.type !== 'img') return;
      const img = new Image();
      img.src = this.msg.html.url;
      img.onload = () => {
        const scale = (img.width / 152).toFixed(2);
        const height = parseInt(img.height / scale);
        this.$refs.imgBox && (this.$refs.imgBox.style.height = height + 'px');
        const dom = document.querySelector('.dialog-list');
        dom.scrollTop = dom.scrollHeight + height;
        this.isOblong = img.width > img.height;
      };
    }
  },
  mounted () {
    this.setScrollHeight();
  }

};

</script>
