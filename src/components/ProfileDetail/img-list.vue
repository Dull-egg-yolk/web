<template>
  <div class="seeImg-box">
    <div class="seeImg-content"  @touchstart.stop="startTouch" @touchmove.stop.prevent="justMove" @touchend.stop="endTouch">
      <div class="cover">
        <!-- <div class="icon-load" v-if="showLoad">
          <span class="icon"></span>
          <span class="txt">{{$t('base.loading')}}</span>
        </div>
        <video ref="videoPlayer" :src="inviteVideoInfo.video" autoplay playsinline
        webkit-playsinline v-if="showVideo" loop :poster="inviteVideoInfo.videoPic"></video>
        <img :src="inviteImgInfo.pic" v-else-if="showVideo == false && showImg" alt="" />
        <img :src="inviteHeadImgInfo.headImg" v-else alt="" /> -->
        <div class="prv-box">
          <div class="icon-load" v-if="showLoad">
            <span class="icon"></span>
            <span class="txt">{{$t('base.loading')}}</span>
          </div>
          <video ref="videoPlayer" :src="prvInfoVideo.video" autoplay playsinline
          webkit-playsinline v-if="showVideo" loop :poster="prvInfoVideo.videoPic"></video>
          <img :src="prvInfo.pic" v-else-if="showVideo == false && showImg" alt="" />
          <img :src="inviteHeadImgInfo.headImg" v-else alt="" />
          </div>
          <div class="cur-box">
            <div class="icon-load" v-if="showLoad">
              <span class="icon"></span>
              <span class="txt">{{$t('base.loading')}}</span>
            </div>
            <video ref="videoPlayer" :src="inviteVideoInfo.video" autoplay playsinline
            webkit-playsinline v-if="showVideo" loop :poster="inviteVideoInfo.videoPic"></video>
            <img :src="inviteImgInfo.pic" v-else-if="showVideo == false && showImg" alt="" />
            <img :src="inviteHeadImgInfo.headImg" v-else alt="" />
          </div>
          <div class="next-box">
            <div class="icon-load" v-if="showLoad">
              <span class="icon"></span>
              <span class="txt">{{$t('base.loading')}}</span>
            </div>
            <video ref="videoPlayer" :src="nextInfoVideo.video" autoplay playsinline
            webkit-playsinline v-if="showVideo" loop :poster="nextInfoVideo.videoPic"></video>
            <img :src="nextInfo.pic" v-else-if="showVideo == false && showImg" alt="" />
            <img :src="inviteHeadImgInfo.headImg" v-else alt="" />
          </div>
      </div>
      <div class="inner">
        <div class="header">
          <div class="header-info">
            <div class="user-right">
            </div>
          </div>
          <div class="user-sett">
            <div class="user-icon icon-cross" @click.self="closeBtn()"></div>
          </div>
        </div>
        <div class="btn-arrow btn-prv" v-if="showLeft" @click="switchHost('prv')">
          <span class="icon-drop-down fx-c hover"></span>
          <span class="txt ">{{$t('app.flop_recommend_hint_previous')}}</span>
        </div>
        <div class="btn-arrow btn-next" v-if="showRight" @click="switchHost('next')">
          <span class="icon-drop-down fx-c hover"></span>
          <span class="txt">{{$t('app.flop_recommend_hint_next')}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import agoraMixin from '@/mixin/agoraMixin';
import imAddFriendMixin from '@/mixin/imAddFriendMixin';
import Clickoutside from '@/util/clickoutside.js';
import { logReport } from '@/util/logReport';
export default {
  data () {
    return {
      stateCode: {},
      showReport: false,
      reportVideo: null,
      showLoad: true,
      pageStartY: 0,
      prvDom: null,
      curDom: null,
      nextDom: null,
      num: 0
    };
  },
  props: {
    inviteImgInfo: {
      type: Object,
      default: () => { }
    },
    inviteVideoInfo: {
      type: Object,
      default: () => { }
    },
    inviteHeadImgInfo: {
      type: Object,
      default: () => { }
    },
    showVideo: {
      type: Boolean,
      default: true
    },
    showImg: {
      type: Boolean,
      default: true
    },
    showLeft: {
      type: Boolean,
      default: true
    },
    showRight: {
      type: Boolean,
      default: true
    },
    list: {
      type: Array,
      require: true,
    },
    curHostIndex: {
      type: Number,
      require: true,
    },
    curVideoIndex: {
      type: Number,
      require: true,
    },
    videos: {
      type: Array,
      require: true,
    }
  },
  mixins: [agoraMixin, imAddFriendMixin],
  directives: { Clickoutside },
  components: {
  },
  watch: {
    inviteVideoInfo (o) {
      console.log('change');
      this.$nextTick(() => {
        this.playerListener();
      });
    },
  },
  computed: {
    prvInfo () {
      console.log(this.curHostIndex, 22);
      if (this.curHostIndex === 0) return {};
      return this.list[this.curHostIndex - 1];
    },
    nextInfo () {
      if (this.curHostIndex === this.list.length - 1) return {};
      return this.list[this.curHostIndex + 1];
    },
    prvInfoVideo () {
      if (this.curVideoIndex === 0) return {};
      return this.videos[this.curVideoIndex - 1];
    },
    nextInfoVideo () {
      if (this.curVideoIndex === this.videos.length - 1) return {};
      return this.videos[this.curVideoIndex + 1];
    }
  },

  methods: {
    closeBtn () {
      this.$emit('close', false);
    },
    switchHost (type) {
      this.$emit('switchHost', type);
      this.$nextTick(() => {
        logReport({
          eventId: '106-1-6-6',
          target_user_id: this.inviteVideoInfo.id,
          free_name2: { video_url: this.inviteVideoInfo.video, index: this.curVideoIndex }
        });
      });
    },
    hideLoad () {
      this.showLoad = false;
      console.log('ddd');
    },
    playerListener () {
      if (this.showVideo) {
        this.showLoad = true;
      } else {
        this.showLoad = false;
      }
      if (!this.$refs.videoPlayer) return;
      this.$refs.videoPlayer.removeEventListener('playing', this.hideLoad);
      this.$refs.videoPlayer.addEventListener('playing', this.hideLoad);
      this.$nextTick(() => {
        if (this.num === 0) {
          logReport({
            eventId: '106-1-6-6',
            target_user_id: this.inviteVideoInfo.userId,
            free_name2: { video_url: this.inviteVideoInfo.video, index: this.curVideoIndex }
          });
        }
        this.num++;
      });
      // logReport({
      //   eventId: '106-1-6-6',
      //   target_user_id: this.prvInfoVideo.id,
      //   free_name2: { video_url: this.prvInfoVideo.video }
      // });
    },
    startTouch (e) {
      this.pageStartY = e.changedTouches[0].pageY;
    },
    justMove (e) {
      const pageY = this.pageStartY - e.changedTouches[0].pageY;
      if ((this.showRight && pageY > 0) || (this.showLeft && pageY < 0)) {
        this.setTransForm(-pageY + 'px');
      }
    },
    setTransForm (pageY) {
      this.curDom.setAttribute('style', `transform: translateY(${pageY})`);
      this.prvDom.setAttribute('style', `transform: translateY(${pageY})`);
      this.nextDom.setAttribute('style', `transform: translateY(${pageY})`);
    },
    endTouch (e) {
      const pageY = e.changedTouches[0].pageY;
      // 下一个
      if (this.pageStartY === pageY) return;
      if (this.pageStartY - pageY > 40) {
        if (this.showRight) {
          this.setTransForm('-100%');
          this.switchHost('next');
          this.setTransForm('0');
        }
      } else if (this.pageStartY - pageY < -40) {
        if (this.showLeft) {
          this.setTransForm('100%');
          this.switchHost('prv');
          this.setTransForm('0');
        }
      } else {
        this.setTransForm('0');
      }
    },
    // startTouch (e) {
    //   this.pageStartY = e.changedTouches[0].pageY;
    // },
    // endTouch (e) {
    //   const pageY = e.changedTouches[0].pageY;
    //   // 下一个
    //   if (this.pageStartY > pageY) {
    //     if (this.showRight) this.switchHost('next');
    //   } else {
    //     if (this.showLeft) this.switchHost('prv');
    //   }
    // }
  },
  created () {
    this.stateCode = window.$mObj.userStatus;
  },
  mounted () {
    this.$nextTick(() => {
      this.playerListener();
    });
    this.prvDom = document.getElementsByClassName('prv-box')[0];
    this.curDom = document.getElementsByClassName('cur-box')[0];
    this.nextDom = document.getElementsByClassName('next-box')[0];
  },
};
</script>
<style lang="less">
@import url("./index.less");
</style>
