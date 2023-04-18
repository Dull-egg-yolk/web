<template>
    <div class="seeImg-box" @touchmove.stop.prevent>
        <div class="mb-title flex-row-vc" v-if="!isProfile">
            <div class="actions l fx-c" @click="closeBtn()">
                <span class="icon-arrow"></span>
            </div>
            <div class="title l fx-v">{{sortTypeName}}</div>
            <div class="actions r fx-c"></div>
        </div>
        <div class="swiper swiperOne">
            <div class="swiper-wrapper" ref="swiper">
                <div class="swiper-slide" v-if="infos[0]">
                    <div class="seeImg-content">
                        <div class="cover">
                            <div class="icon-load" v-if="showLoad">
                            <span class="icon"></span>
                            <span class="txt">{{$t('base.loading')}}</span>
                            </div>
                            <video :src="infos[0].videoUrl" webkit-playsinline="true" playsinline="true" v-show="infos[0].videoUrl" loop :poster="infos[0].pictureUrl || infos[0].headImg" :id="'videoPlayer'+infos[0].id"></video>
                            <img :src="infos[0].pictureUrl" v-show="!infos[0].videoUrl && infos[0].pictureUrl" :data-begin="Date.now()" @load="loadImg($event, infos[0])" alt="">
                            <img :src="infos[0].headImg" v-show="!(infos[0].videoUrl || infos[0].pictureUrl)" :data-begin="Date.now()" @load="loadImg($event, infos[0])" alt="">
                        </div>
                        <div class="inner">
                            <div class="header" :class="isProfile && 'close-right'">
                                <div class="header-info" v-if="!isProfile" @click="jumpToProfile(infos[0])">
                                    <div class="avatar-img">
                                            <div class="avatar-wrap">
                                            <img :src="infos[0].headImg" alt />
                                        </div>
                                    </div>
                                    <div class="user-right">
                                        <div class="user-name"> {{ infos[0].name }} </div>
                                        <div class="user-country"> <country :countryId="infos[0].countryId"></country></div>
                                    </div>
                                </div>
                                <div class="user-sett">
                                    <div class="user-icon icon-saft" v-if="!isProfile" @click.stop="reportBtn()"></div>
                                    <div class="user-icon icon-cross" @click="closeBtn()"></div>
                                </div>
                            </div>
                            <div class="user-online" v-if="!isProfile">
                                <div class="status-txt-tag" :class="stateCode[infos[0].onlineStatus]">{{
                                    $t(`base.${stateCode[infos[0].onlineStatus]}`)
                                }}</div>
                            </div>
                            <div class="footer" v-if="!isProfile">
                                <div class="user-like" >
                                    <div class="user-icon icon-heart" :class="{'liked': isFav}" @click="favBtn"></div>
                                </div>
                                <div class="user-message">
                                    <div class="user-icon icon-message" @click.stop="messageBtn(infos[0])"></div>
                                </div>
                                <div class="user-video flex-row-vc">
                                    <div class="user-call" @click="callBtn(infos[0])"><span class="icon-video2"></span>{{$t('app.chat_now')}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="swiper-slide"  v-if="infos[1]">
                    <div class="seeImg-content">
                        <div class="cover">
                            <div class="icon-load" v-if="showLoad">
                            <span class="icon"></span>
                            <span class="txt">{{$t('base.loading')}}</span>
                            </div>
                            <video :src="infos[1].videoUrl" webkit-playsinline="true" playsinline="true" v-show="infos[1].videoUrl" loop :poster="infos[1].pictureUrl || infos[1].headImg" :id="'videoPlayer'+infos[1].id"></video>
                            <img :src="infos[1].pictureUrl" v-show="!infos[1].videoUrl && infos[1].pictureUrl"  :data-begin="Date.now()" @load="loadImg($event, infos[1])" alt="">
                            <img :src="infos[1].headImg" v-show="!(infos[1].videoUrl || infos[1].pictureUr)"  :data-begin="Date.now()" @load="loadImg($event, infos[1])" alt="">

                        </div>
                        <div class="inner">
                            <div class="header" :class="isProfile && 'close-right'">
                                <div class="header-info" v-if="!isProfile" @click="jumpToProfile(infos[1])">
                                    <div class="avatar-img">
                                            <div class="avatar-wrap">
                                            <img :src="infos[1].headImg" alt />
                                        </div>
                                    </div>
                                    <div class="user-right">
                                        <div class="user-name"> {{ infos[1].name }} </div>
                                        <div class="user-country"> <country :countryId="infos[1].countryId"></country></div>
                                    </div>
                                </div>
                                <div class="user-sett">
                                    <div class="user-icon icon-saft" v-if="!isProfile" @click.stop="reportBtn()"></div>
                                    <div class="user-icon icon-cross" @click="closeBtn()"></div>
                                </div>
                            </div>
                            <div class="user-online" v-if="!isProfile">
                                <div class="status-txt-tag" :class="stateCode[infos[1].onlineStatus]">{{
                                    $t(`base.${stateCode[infos[1].onlineStatus]}`)
                                }}</div>
                            </div>
                            <div class="footer" v-if="!isProfile">
                                <div class="user-like" >
                                    <div class="user-icon icon-heart" :class="{'liked': isFav}" @click="favBtn"></div>
                                </div>
                                <div class="user-message">
                                    <div class="user-icon icon-message" @click.stop="messageBtn(infos[1])"></div>
                                </div>
                                <div class="user-video flex-row-vc">
                                    <div class="user-call" @click="callBtn(infos[1])"><span class="icon-video2"></span>{{$t('app.chat_now')}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div  class="swiper-slide"  v-if="infos[2]">
                    <div class="seeImg-content">
                        <div class="cover">
                            <div class="icon-load" v-if="showLoad">
                            <span class="icon"></span>
                            <span class="txt">{{$t('base.loading')}}</span>
                            </div>
                            <video :src="infos[2].videoUrl" webkit-playsinline="true" playsinline="true" v-show="infos[2].videoUrl" loop :poster="infos[2].pictureUrl || infos[2].headImg" :id="'videoPlayer'+infos[2].id"></video>
                            <img :src="infos[2].pictureUrl" v-show="!infos[2].videoUrl && infos[2].pictureUrl" alt="">
                            <img :src="infos[2].headImg" v-show="!(infos[2].videoUrl || infos[2].pictureUr)" alt="">

                        </div>
                        <div class="inner">
                            <div class="header" :class="isProfile && 'close-right'">
                                <div class="header-info" v-if="!isProfile" @click="jumpToProfile(infos[2])">
                                    <div class="avatar-img">
                                            <div class="avatar-wrap">
                                            <img :src="infos[2].headImg" alt />
                                        </div>
                                    </div>
                                    <div class="user-right">
                                        <div class="user-name"> {{ infos[2].name }} </div>
                                        <div class="user-country"> <country :countryId="infos[2].countryId"></country></div>
                                    </div>
                                </div>
                                <div class="user-sett">
                                    <div class="user-icon icon-saft" v-if="!isProfile" @click.stop="reportBtn()"></div>
                                    <div class="user-icon icon-cross" @click="closeBtn()"></div>
                                </div>
                            </div>
                            <div class="user-online" v-if="!isProfile">
                                <div class="status-txt-tag" :class="stateCode[infos[2].onlineStatus]">{{
                                    $t(`base.${stateCode[infos[2].onlineStatus]}`)
                                }}</div>
                            </div>
                            <div class="footer" v-if="!isProfile">
                                <div class="user-like" >
                                    <div class="user-icon icon-heart" :class="{'liked': isFav}" @click="favBtn"></div>
                                </div>
                                <div class="user-message">
                                    <div class="user-icon icon-message" @click.stop="messageBtn(infos[2])"></div>
                                </div>
                                <div class="user-video flex-row-vc">
                                    <div class="user-call" @click="callBtn(infos[2])"><span class="icon-video2"></span>{{$t('app.chat_now')}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <report-menu class="user-report-pop" :friendData="infos[swiperIndex]" :reportVideo="reportVideo" v-if="showReport && !isProfile" @show="getShow" v-clickoutside:click="hideReportHandler" />
            <div class="btn-arrow btn-prv" v-if="activeIndex !== 0 && !isMobile" @click="switchHost('prv')">
                <span class="icon-drop-down fx-c hover"></span>
                <span class="txt ">{{$t('app.flop_recommend_hint_previous')}}</span>
            </div>
            <div class="btn-arrow btn-next" v-if="activeIndex !== list.length - 1 && !isMobile"  @click="switchHost('next')">
                <span class="icon-drop-down fx-c hover"></span>
                <span class="txt">{{$t('app.flop_recommend_hint_next')}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import Swiper from 'swiper';
import { mapState } from 'vuex';
import agoraMixin from '@/mixin/agoraMixin';
import imAddFriendMixin from '@/mixin/imAddFriendMixin';
import { logReport } from '@/util/logReport';
import ReportMenu from '@/components/PopFiles/ReportMenu.vue';
import Clickoutside from '@/util/clickoutside.js';
export default {
  data () {
    return {
      stateCode: {},
      isFav: false,
      showLoad: true,
      infos: [],
      activeIndex: 0, // 数据index
      swiperIndex: 0, // swiperid
      reportVideo: null,
      showReport: false,
      swiper: null,
      videoPlayer: null,
      num: 0,
    };
  },
  directives: { Clickoutside },
  mixins: [agoraMixin, imAddFriendMixin],
  components: {
    ReportMenu
  },
  computed: {
    ...mapState({
      imChatConfig: (state) => state.app.imChatConfig,
      isMobile: (state) => state.app.isMobile,
    }),
  },
  props: {
    list: {
      type: Array,
      require: true
    },
    curHostIndex: {
      type: Number,
      require: true
    },
    sortTypeName: String,
    isProfile: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  created () {
    this.getUrl();
  },
  mounted () {
    this.activeIndex = this.curHostIndex;
    this.getInfo();
    this.$nextTick(() => {
      this.init();
    });
  },
  beforeDestroy () {
    if (this.videoPlayer) {
      this.videoPlayer.pause();
      this.videoPlayer = null;
    }
  },
  methods: {
    loadImg (e, data) {
      const begin = e.target.getAttribute('data-begin');

      if (this.isProfile) {
        logReport({
          eventId: '106-1-6-25',
          free_name2: {
            loadTime: Date.now() - begin,
            url: e.target.src,
            type: 'img'
          },
          target_user_id: data.id
        });
      } else {
        logReport({
          eventId: '106-1-2-15',
          free_name2: {
            loadTime: Date.now() - begin,
            url: e.target.src,
            type: 'img'
          },
          target_user_id: data.id
        });
      }
    },
    init () {
      this.stateCode = window.$mObj.userStatus;
      const that = this;
      // eslint-disable-next-line no-new
      this.swiper = new Swiper('.swiperOne', {
        allowTouchMove: this.isMobile,
        direction: 'vertical', // 垂直切换选项
        loop: false, // 循环模式选项
        observer: true, // 动态监听
        mousewheel: true, // 鼠标滚轮事件
        on: {
          init: function () {
            console.log(that.infos);
            that.swiperIndex = this.activeIndex;
            if (that.activeIndex !== 0 && that.activeIndex !== that.list.length - 1) {
              this.slideTo(1, 0, false);
              that.swiperIndex = 1;
            } else if (that.activeIndex === that.list.length - 1) {
              this.slideTo(that.activeIndex, 0, false);
              that.swiperIndex = that.infos.length - 1;
            }
            setTimeout(() => {
              that.playerListener(that.list[that.activeIndex]);
            });
          },
          slideChangeTransitionEnd: function (swiper) {
            that.hideReportHandler();
            if (that.videoPlayer) {
              that.videoPlayer.pause();
              that.videoPlayer = null;
            }
            if (this.activeIndex > that.swiperIndex) {
              that.activeIndex += 1;
              that.swiperIndex = this.activeIndex;
              that.getInfo();
              if (that.activeIndex !== that.list.length - 1) {
                this.slideTo(1, 0, false);
                that.swiperIndex = 1;
              }
              that.isProfile && that.report('next');
              !that.isProfile && that.menuLogHandler('next');
            } else if (this.activeIndex < that.swiperIndex) {
              that.activeIndex -= 1;
              that.swiperIndex = this.activeIndex;
              that.getInfo();
              if (that.activeIndex !== 0) {
                this.slideTo(1, 0, false);
                that.swiperIndex = 1;
              }
              that.isProfile && that.report('prv');
              !that.isProfile && that.menuLogHandler('prv');
            }

            that.$nextTick(() => {
              that.playerListener(that.infos[that.swiperIndex]);
            });
          },
        },
      });
      !this.isProfile && this.menuLogHandler('index');
    },
    report (type) {
      if (this.isProfile) {
        let eventId;
        const info = this.infos[this.swiperIndex];
        if (info.videoUrl && this.num) {
          if (type === 'next') {
            eventId = '106-1-6-20';
          } else {
            eventId = '106-1-6-21';
          }
          logReport({
            eventId,
            target_user_id: info.userId,
            free_name2: { video_url: info.video, index: this.activeIndex }
          });
        } else if (info.pictureUrl) {
          if (type === 'next') {
            eventId = '106-1-6-22';
          } else {
            eventId = '106-1-6-23';
          }
          logReport({
            eventId: eventId,
            target_user_id: info.userId,
            free_name2: { pictureUrl: info.pictureUrl, index: this.activeIndex }
          });
        }
      }
    },
    switchHost (type) {
      if (type === 'prv') {
        this.swiper.slidePrev(500, true);
      } else {
        this.swiper.slideNext(500, true);
      }
    },
    getInfo () {
      if (this.list.length > 3) {
        let indexs = [];
        console.log(this.activeIndex);
        if (this.activeIndex === 0) { // 第一项
          indexs = [0, 1, 2];
        } else if (this.activeIndex === this.list.length - 1) { // 最后一项
          indexs = [this.activeIndex - 2, this.activeIndex - 1, this.activeIndex];
        } else { // 中间的
          indexs = [this.activeIndex - 1, this.activeIndex, this.activeIndex + 1];
        }
        this.infos = this.list.filter((item, index) => {
          return indexs.includes(index);
        });
      } else {
        this.infos = this.list;
      }
    },
    callBtn (data) {
      logReport({
        eventId: '106-1-2-3',
        target_user_id: data.id,
        free_name2: { group: data.groupName }
      });
      // if (!this.checkLoginStatus()) return;
      this.callAction(data, 11);
      this.$store.commit('setHomeHost', true);
    },
    hideLoad () {
      this.showLoad = false;
      this.playing = true;
    },
    playerListener (item) {
      console.log(item, 111);
      if (!item.videoUrl) {
        this.showLoad = false;
      } else {
        this.showLoad = true;
      }
      this.videoPlayer = document.getElementById(`videoPlayer${item.id}`);
      if (!this.videoPlayer || !this.videoPlayer.src) return;
      this.videoPlayer.removeEventListener('playing', this.hideLoad);
      this.playing = false;
      this.videoPlayer.addEventListener('playing', this.hideLoad);
      this.videoPlayer.pause();
      const videoLST = new Date().getTime();
      setTimeout(() => {
        this.videoPlayer.play();
      }, 100);
      this.videoPlayer && this.videoPlayer.addEventListener('canplay', () => {
        const vLET = new Date().getTime() - videoLST;
        if (this.num === 0) {
          if (!this.isProfile) {
            logReport({
              eventId: '106-1-2-1',
              target_user_id: item.id,
              free_name2: { video_time: vLET, video_url: item.videoUrl }
            });
            logReport({
              eventId: '106-1-2-15',
              free_name2: {
                loadTime: vLET,
                url: this.videoPlayer.src,
                type: 'video'
              },
              target_user_id: item.id
            });
          } else {
            logReport({
              eventId: '106-1-6-25',
              free_name2: {
                loadTime: vLET,
                url: this.videoPlayer.src,
                type: 'video'
              },
              target_user_id: item.id
            });
          }
        }
        this.num++;
      });
    },
    jumpToProfile (item) {
      if (!this.checkLoginStatus('profile')) return;
      this.$parent.goddessProfile(item.id, item.onlineStatus);
      this.closeBtn('profile');
    },
    closeBtn (type) {
      if (!this.isProfile) {
        this.menuLogHandler('close');
        if (!type) {
          this.$router.go(-1);
        } else {
          this.$emit('close', false);
        }
        return;
      }

      this.$emit('close', false);
    },
    reportBtn () {
      this.menuLogHandler('report');
      if (!this.checkLoginStatus('report')) return;
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
      if (!this.checkLoginStatus('fav')) return;
      this.isFav = true;
    },
    messageBtn (data) {
      this.menuLogHandler('message');
      if (!this.checkLoginStatus('message')) return;
      this.imChatCheck(data);
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
        target_user_id: this.infos[this.swiperIndex].id
      });
    },
    getUrl () {
      this.list.map(res => {
        if (res.videoUrl && /d6d3wha0hetk7/.test(res.videoUrl)) {
          res.videoUrl = res.videoUrl.replace(res.videoUrl.substring(0, res.videoUrl.indexOf('.net')), 'https://d36p65fckqntf2.cloudfront');
        }
        return res;
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index.less");

.swiperOne {
    overflow: hidden;
    width: 100%;
    height: 100%;
    .swiper-wrapper {
        width: 100%;
        height: 100%;
        .swiper-slide {
            width: 100%;
            height: 100%;
        }
    }
}
</style>>
