<template>
  <div class="seeImg-box">

    <!-- mobile 给移动端的页面title -->
    <div class="mb-title flex-row-vc">
      <div class="actions l fx-c" @click="closeBtn">
        <span class="icon-arrow"></span>
      </div>
      <div class="title l fx-v">{{sortTypeName}}</div>
      <div class="actions r fx-c"></div>
    </div>

    <div class="seeImg-content" @touchstart.stop="startTouch" @touchend.stop="endTouch">
      <div class="cover">
        <div class="icon-load" v-if="showLoad">
          <span class="icon"></span>
          <span class="txt">{{$t('base.loading')}}</span>
        </div>
        <video :src="inviteImgInfo.videoUrl" autoplay playsinline
        webkit-playsinline v-if="inviteImgInfo.videoUrl" loop :poster="inviteImgInfo.pictureUrl || inviteImgInfo.headImg" ref="videoPlayer"></video>
        <img :src="inviteImgInfo.pictureUrl" v-else-if="inviteImgInfo.pictureUrl" alt="">
        <img :src="inviteImgInfo.headImg" v-else alt="">

      </div>
      <div class="inner">
        <div class="header">
          <div class="header-info" @click="jumpToProfile">
          <div class="avatar-img">
            <div class="avatar-wrap">
              <img :src="inviteImgInfo.headImg" alt />
            </div>
          </div>
            <div class="user-right">
              <div class="user-name"> {{ inviteImgInfo.name }} </div>
              <div class="user-country"> <country :countryId="inviteImgInfo.countryId"></country>
              </div>
            </div>
          </div>
          <div class="user-sett">
            <div class="user-icon icon-saft" @click.stop="reportBtn()"></div>
            <div class="user-icon icon-cross" @click="closeBtn()"></div>
          </div>
        </div>
        <div class="user-online">
          <div class="status-txt-tag" :class="stateCode[inviteImgInfo.onlineStatus]">{{
              stateCode[inviteImgInfo.onlineStatus]
          }}</div>
        </div>
        <div class="footer">
          <div class="user-like" >
            <div class="user-icon icon-heart" :class="{'liked': isFav}" @click="favBtn"></div>
          </div>
          <div class="user-message">
            <div class="user-icon icon-message" @click.stop="messageBtn(inviteImgInfo)"></div>
          </div>
          <div class="user-video flex-row-vc">
            <div class="user-call" @click="callBtn(inviteImgInfo)"><span class="icon-video2"></span>{{$t('app.chat_now')}}</div>
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
      <report-menu class="user-report-pop" :friendData="inviteImgInfo" :reportVideo="reportVideo" v-if="showReport" @show="getShow" v-clickoutside:click="hideReportHandler" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import agoraMixin from '@/mixin/agoraMixin';
import imAddFriendMixin from '@/mixin/imAddFriendMixin';
import ReportMenu from '@/components/PopFiles/ReportMenu.vue';
import Clickoutside from '@/util/clickoutside.js';
import { logReport } from '@/util/logReport';
export default {
  data () {
    return {
      stateCode: {},
      showReport: false,
      reportVideo: null,
      isFav: false,
      showLoad: true,
      pageStartY: 0,
      num: 0
    };
  },
  props: {
    inviteImgInfo: {
      type: Object,
      default: () => { }
    },
    showLeft: {
      type: Boolean,
      default: true
    },
    showRight: {
      type: Boolean,
      default: true
    },
    sortTypeName: String
  },
  mixins: [agoraMixin, imAddFriendMixin],
  directives: { Clickoutside },
  components: {
    ReportMenu
  },
  watch: {
    inviteImgInfo (o) {
      console.log('change');
      this.$nextTick(() => {
        this.playerListener();
      });
    },
    imChatConfig: {
      handler (o) {
        if (o.show) {
          if (this.isMobile) {
            this.closeBtn();
          }
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      imChatConfig: (state) => state.app.imChatConfig,
      isMobile: (state) => state.app.isMobile,
    }),
  },

  methods: {
    jumpToProfile () {
      if (!this.checkLoginStatus()) return;
      this.$parent.goddessProfile(this.inviteImgInfo.id, this.inviteImgInfo.onlineStatus);
      this.closeBtn();
    },
    callBtn (data) {
      logReport({
        eventId: '106-1-2-3',
        target_user_id: this.inviteImgInfo.id,
        free_name2: { group: this.inviteImgInfo.groupName }
      });
      if (!this.checkLoginStatus()) return;
      this.$store.commit('setHomeHost', true);
      this.callAction(data, 11);
    },
    messageBtn (data) {
      this.menuLogHandler('message');
      if (!this.checkLoginStatus()) return;
      this.imChatCheck(data);
    },
    closeBtn () {
      this.$emit('close', false);
      this.menuLogHandler('close');
    },
    switchHost (type) {
      this.$emit('switchHost', type);
      this.isFav = false;
      this.$nextTick(() => {
        this.menuLogHandler(type);
      });
    },
    reportBtn () {
      this.menuLogHandler('report');
      if (!this.checkLoginStatus()) return;
      this.showReport = !this.showReport;
      this.reportVideo = 1;
    },
    hideReportHandler () {
      this.showReport = false;
    },
    getShow () {
      this.showReport = false;
    },
    favBtn () {
      this.menuLogHandler('like');
      if (!this.checkLoginStatus()) return;
      this.isFav = true;
    },
    hideLoad () {
      this.showLoad = false;
      console.log('ddd');
    },
    playerListener () {
      if (!this.inviteImgInfo.videoUrl) {
        this.showLoad = false;
      } else {
        this.showLoad = true;
      }
      if (!this.$refs.videoPlayer) return;
      this.$refs.videoPlayer.removeEventListener('playing', this.hideLoad);
      this.$refs.videoPlayer.addEventListener('playing', this.hideLoad);
      this.$refs.videoPlayer.pause();
      const videoLST = new Date().getTime();
      setTimeout(() => {
        this.$refs.videoPlayer.play();
      }, 10);
      this.$nextTick(() => {
        this.$refs.videoPlayer && this.$refs.videoPlayer.addEventListener('canplay', () => {
          const vLET = new Date().getTime() - videoLST;
          console.log(this.num, '------------this.num');
          if (this.num === 0) {
            logReport({
              eventId: '106-1-2-1',
              target_user_id: this.inviteImgInfo.id,
              free_name2: { video_time: vLET, video_url: this.inviteImgInfo.videoUrl }
            });
          }
          this.num++;
        });
      });
    },
    startTouch (e) {
      console.log(e);
      this.pageStartY = e.changedTouches[0].pageY;
    },
    endTouch (e) {
      console.log(e);
      const pageY = e.changedTouches[0].pageY;

      // 下一个
      if (this.pageStartY - pageY > 40) {
        if (this.showRight) this.switchHost('next');
      } else if (this.pageStartY - pageY < -40) {
        if (this.showLeft) this.switchHost('prv');
      }
    },
    menuLogHandler (type) {
      const eventId = {
        like: '106-1-2-4',
        message: '106-1-2-5',
        prv: '106-1-2-10',
        next: '106-1-2-11',
        report: '106-1-2-12',
        close: '106-1-2-14',
        index: '106-1-2-0'
      }[type];

      logReport({
        eventId,
        target_user_id: this.inviteImgInfo.id
      });
    },
  },
  mounted () {
    this.menuLogHandler('index');
    this.$nextTick(() => {
      this.playerListener();
    });
  },
  created () {
    console.log(this.inviteImgInfo);
    this.stateCode = window.$mObj.userStatus;
  }
};
</script>
<style lang="less">
@import url("./index.less");
</style>
