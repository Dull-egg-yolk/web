<template>
  <div class="profile-detail" :class="{ other: !isMyProfile, my: isMyProfile }" @click="clickHander($event)">
    <div class="fd-wrap">

          <!-- 更多 -->
      <div class="header-setting" v-if="isMobile">

          <div class="header-more fx-c" @click.stop="showSetting" v-if="showSettingIcon">
            <span class="icon-setting"></span>
          </div>
          <div class="header-backpack fx-c" @click.stop="toBackpack" v-if="isMyProfile && backpackConf.backpackEntrance">
            <div class="header-backpack__con fx-c">
              <span class="icon-backpack"></span>
              <span>{{ $t('webChat.backpack.beibaoTitle') }}</span>
            </div>
          </div>

          <div class="header-more hover fx-c" @click.stop="setMore()" v-if="!isMyProfile">
            <span class="icon-more"></span>
          </div>

          <div class="header-close hover fx-c" @click.stop="setClose()">
            <span class="icon-arrow" v-if="isMobile"></span>
            <span class="icon-cross" v-else></span>
          </div>
      </div>
      <!-- 个人封面 -->
      <div class="main-info">
        <!-- 头像 -->
        <div class="main-header">
          <div class="avatar avatar-img" @click="viewImgs(profileData, 0)">
            <span class="icon-edit fx-c" v-if="isMobile && isMyProfile" @click="userEdit()"></span>
            <div class="avatar-wrap">
              <fitimg :headImg="profileData.headImg" type="bigimg"></fitimg>
            </div>
          </div>
          <!-- 背包 -->
          <div class="header-backpack fx-c" @click.stop="toBackpack" v-if="isMyProfile && backpackConf.backpackEntrance">
            <div class="header-backpack__con fx-c">
              <span class="icon-backpack"></span>
              <span>{{ $t('webChat.backpack.beibaoTitle') }}</span>
            </div>
          </div>
          <!-- 更多 -->
          <div class="header-setting" v-if="!isMobile">

            <div class="header-more fx-c" @click.stop="showSetting" v-if="showSettingIcon">
              <span class="icon-setting"></span>
            </div>

            <div class="header-more hover fx-c" @click.stop="setMore()" v-if="!isMyProfile">
              <span class="icon-more"></span>
            </div>
            <div class="header-close hover fx-c" @click.stop="setClose()">
              <span class="icon-arrow" v-if="isMobile"></span>
              <span class="icon-cross" v-else></span>
            </div>

          </div>
        </div>

        <div class="base-intro">
          <!-- 用户名 -->
          <div class="user-title">
            <div class="user-left">
              <div class="user-id">
                <span id="user-id">ID: {{profileData.id | otherIdFilter}}</span>
                <img class="copy-img hover" @click="copyId" src="../../assets/img/copy.png" alt />
              </div>
              <div class="user-box">
                <h2 class="user-name">{{ userName }},</h2>
                <h2 class="user-other">{{ profileData.birthday | calculateAge }}</h2>
                <div class="status-txt-tag" v-if="onlineStatus !== undefined" :class="stateCode[onlineStatus]">{{$t(`base.${stateCode[onlineStatus]}`)}}</div>
              </div>
              <div class="location-box">
                <div style="display: flex; justify-content: center;salign-items: center;">
                   <div class="user-country"><country :countryId="profileData.countryId"></country><span class="line"> | </span></div>
                  <div class="horoscope">{{getGender(profileData.gender)}}<span class="line"> | </span></div>
                  <div class="horoscope">{{getHoroscope(profileData.birthday)}}</div>
                </div>
                <div class="location-main" v-if="profileData.languageNames.length > 0"><span  class="user-location">{{ ((profileData.languageNames).toString()).replace(/,/g,' / ') }}</span></div>
              </div>
            </div>

            <!-- 我的主页操作项 -->
            <template v-if="!isMobile">

              <div class="user-right" v-if="isMyProfile">
                <!-- 喜欢 -->
                <!-- <div class="btn-like" :class="{ liked: profileData.like }"> -->
                <div class="btn-like" :class="{ 'liked': isLike }">
                  <div class="fx-c hover"><img src="../../assets/img/tumile/icon-ding-2.png" /></div>
                  <span class="txt small-font">{{ profileData.likedCount }}</span>
                </div>
                <div class="user-edit hover" @click="userEdit()">{{$t('base.edit')}}</div>
              </div>
              <!-- friend 主页操作 -->
              <div class="user-right" v-else>
                <div class="btn-like flex-col-vc" :class="{ 'liked': isLike }" @click="clickLike">
                  <div class="icon-heart fx-c hover" style="margin-top: 4px;"></div>
                  <span class="txt small-font">{{ profileData.likedCount }}</span>
                </div>
                <div class="user-icon icon-message" @click.stop="toChat(profileData)"></div>
                <div class="user-icon icon-video2" @click="sendCall(profileData)"></div>
              </div>
            </template>
          </div>
          <!-- 标签 -->
          <div class="tag-box" v-if="profileData.interestLabels && profileData.interestLabels.length">
            <div class="h-tag " v-for="(item, index) in profileData.interestLabels" :key="index">{{ $t(`interest.${item}`) }}</div>
          </div>
          <!-- 自我介绍 -->
          <div class="autograph" v-if="profileData.introduce">{{ profileData.introduce }}</div>
          <div class="like" v-if="isMyProfile"><div class="thumb-up"></div><span>{{ profileData.likedCount }}</span></div>
        </div>
        <div class="sort-title" v-if="picList && picList.length">
          {{ $t('app.gallery_image_all') }}
        </div>
        <div class="scroll-vt-box picture-list" v-if="picList && picList.length">
          <div class="scroll-wrap">
            <div class="the-list scroll-inner flex-row-vc" ref="imgList" @mouseenter="mouseenter('imgList')" @mouseleave="mouseleave('imgList')" @mousedown="mousedown" @mouseup="mouseup">
              <div class="oimg common-img hover" v-for="(item, index) in picList" :key="index"
                @click="viewPhotos(item, index)">
                <div class="img-wrap">
                  <img :src="item.pic" alt draggable="false" :data-begin="Date.now()" @load="loadImg($event,'img')"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="sort-title" v-if="videoList.length">
          {{ $t('app.gallery_video_all') }}
        </div>
        <div class="scroll-vt-box picture-list story" v-if="videoList.length">
          <div class="scroll-wrap">
            <div class="scroll-inner the-list" ref="videoList" @mouseenter="mouseenter('videoList')" @mouseleave="mouseleave('videoList')" @mousedown.capture="mousedown" @mouseup.capture="mouseup">
              <div class="oimg common-img hover" v-for="(item, index) in videoList" :key="index"
                @click="viewVideos(item, index)">
                <div class="img-wrap">
                  <img :src="item.videoPic" alt draggable="false" :data-begin="Date.now()"  @load="loadImg($event,'video')"/>
                  <span class="ico icon-drop-down"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 我的主页操作项 -->
      <template v-if="isMobile">

        <div class="user-right mobile-user-right" v-if="isMyProfile">
          <!-- 喜欢 -->
          <!-- <div class="btn-like" :class="{ liked: profileData.like }"> -->
          <div class="btn-like" :class="{ 'liked': isLike }">
            <div class="fx-c hover"><img src="../../assets/img/tumile/icon-ding-2.png" /></div>
            <span class="txt small-font">{{ profileData.likedCount }}</span>
          </div>
          <div class="user-edit hover" @click="userEdit()">{{$t('base.edit')}}</div>
        </div>
        <!-- friend 主页操作 -->
        <div class="user-right mobile-user-right" v-else>
          <div class="btn-like flex-col-vc" :class="{ 'liked': isLike }" @click="clickLike">
            <div class="icon-heart fx-c hover" style="margin-top: 4px;"></div>
            <span class="txt small-font">{{ profileData.likedCount }}</span>
          </div>
          <div class="user-icon icon-message" @click.stop="toChat(profileData)"></div>
          <div class="user-icon icon-video2" @click="sendCall(profileData)"></div>
        </div>
      </template>
      <!-- 更多 -->
      <user-menu :friendData.sync="profileData" v-if="showMore" :show.sync="showMore" :userName.sync="userName"
        @reportData="getReportData" class="user-set-pop" v-clickoutside:click="hideUserHandler" @changeUserName="changeUserName" />
      <!-- report -->
      <report-menu class="user-report-pop" :friendData="profileData" :reportVideo="reportVideo" v-if="showReport"
        @show="getShow" v-clickoutside:click="hideReportHandler" />
      <!-- <img-list v-if="showHostView" :showVideo="showVideo" :showImg="showImg" :showLeft="showBtnPrv" :showRight="showBtnNext"
        :inviteImgInfo="inviteImgInfo" :inviteVideoInfo="inviteVideoInfo" :inviteHeadImgInfo="inviteHeadImgInfo" @close="getStatus"
        @switchHost="switchHostAction" :list="picList" :curHostIndex="curHostIndex" :curVideoIndex="curVideoIndex" :videos="videoList"></img-list> -->
      <banner v-if="showHostView" :list="infos" :curHostIndex="curHostIndex" :isProfile="true" @close="getStatus" />
      <down-load v-if="showDownload" v-clickoutside:click="hideDownHandler" @close="closeDown"></down-load>
      <!-- 给移动端的setting -->
      <transition name="sitefade">
        <pop-setting v-if="showSetUp" @cancelSetup="cancelSetUp" @showDown="getSHowDown"></pop-setting>
      </transition>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import { logReport } from '@/util/logReport';
import { calculateAge, otherIdFilter } from '@/filters';
import { mapState } from 'vuex';
import agoraMixin from '@/mixin/agoraMixin';
import imAddFriendMixin from '@/mixin/imAddFriendMixin';
import { apiAddFriend, apiGetUserPics, apiGetUserVideo } from '@/api/friend';
import { apiGetGoddessStatus } from '@/api/goddess';
import Clickoutside from '@/util/clickoutside.js';
import UserMenu from '@/components/PopFiles/UserMenu.vue';
import ReportMenu from '@/components/PopFiles/ReportMenu.vue';
// import ImgList from './img-list.vue';
import PopSetting from '@/components/PopFiles/PopSetting.vue';
import DownLoad from '@/components/PopFiles/DownLoad';
import Banner from '@/components/Banner/index.vue';
import { getDiscountCoin } from '@/components/messageBox/htmlData';

export default {
  name: 'FriendDetail',
  data () {
    return {
      showDownload: false,
      showMore: false,
      showReport: false,
      isMyProfile: false,
      userName: '',
      picList: [],
      videoList: [],
      friendData: {},
      stateCode: {},
      reportVideo: null,
      showHostView: false,
      showBtnPrv: true,
      showBtnNext: true,
      curHostIndex: null,
      curVideoIndex: null,
      showVideo: false,
      showImg: false,
      isLike: false,
      count: 0,
      onlineStatus: this.$route.query.online,
      showSetUp: false,
      userId: '',
      pageX: 0,
      scrollLeft: 0,
      clickTime: 0,
      infos: []
    };
  },
  filters: {
    calculateAge,
    otherIdFilter
  },
  directives: { Clickoutside },
  props: {
    profileData: {
      type: Object,
      default: () => {
        return {};
      }
    },
  },
  components: {
    UserMenu,
    ReportMenu,
    PopSetting,
    DownLoad,
    Banner,
  },
  mixins: [agoraMixin, imAddFriendMixin],
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
      isMobile: (state) => state.app.isMobile,
      userInfo: (state) => state.app.userInfo,
      unReadCount: (state) => state.agora.unReadCount,
      imPanelConfig: (state) => state.app.imPanelConfig,
      backpackConf: (state) => state.app.backpackConf,
      payStatus: (state) => state.app.userInfo.payStatus,
    }),
    inviteImgInfo () {
      return this.picList[this.curHostIndex];
    },
    inviteVideoInfo () {
      return this.videoList[this.curVideoIndex];
    },
    inviteHeadImgInfo () {
      return this.profileData;
    },
    showSettingIcon () {
      if (this.isMobile) {
        return this.isMyProfile && !this.imPanelConfig.show;
      }
      return false;
    }
  },
  watch: {
    // curHostIndex (n) {
    //   this.showBtnPrv = n !== 0;
    //   this.showBtnNext = n !== (this.picList.length - 1);
    // },
    // curVideoIndex (n) {
    //   this.showBtnPrv = n !== 0;
    //   this.showBtnNext = n !== (this.videoList.length - 1);
    // },
    imPanelConfig: {
      handler (o) {
        if (o.show) {
          this.showSetUp = false;
        }
      },
      deep: true
    },
    'backpackConf.backpackEntrance': {
      handler (val) {
        if (val) {
          logReport({
            eventId: '106-1-7-6', // bag入口曝光
            freeName2: window.$mObj.adData || {},
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    loadImg (e, type) {
      const begin = e.target.getAttribute('data-begin');

      logReport({
        eventId: '106-1-6-24',
        free_name2: {
          loadTime: Date.now() - begin,
          url: e.target.src,
          type
        },
        target_user_id: this.profileData.id
      });
    },
    viewPhotos (data, index) {
      const date = new Date();
      if (date - this.clickTime > 300) return;
      logReport({
        eventId: '106-1-6-5',
        target_user_id: this.profileData.id,
        free_name2: { pic: data.pic, index: index }
      });
      // this.showImg = true;
      // this.showVideo = false;
      this.curHostIndex = index;
      this.infos = this.picList;
      this.showHostView = true;
    },
    viewVideos (data, index) {
      const date = new Date();
      if (date - this.clickTime > 300) return;

      logReport({
        eventId: '106-1-6-6',
        target_user_id: this.profileData.id,
        free_name2: { video_url: data.pic, index: index }
      });
      // this.showVideo = true;
      // this.showImg = false;
      // this.curVideoIndex = index;
      this.infos = this.videoList;
      this.curHostIndex = index;
      this.showHostView = true;
    },
    viewImgs (data, index) {
      logReport({
        eventId: '106-1-6-1',
        target_user_id: this.profileData.id
      });
      // this.showBtnPrv = false;
      // this.showBtnNext = false;
      // this.showVideo = false;
      // this.showImg = false;
      const head = {
        pictureUrl: data.headImg
      };
      this.infos = [head];
      this.curHostIndex = index;
      this.showHostView = true;
    },
    // 向好友发私信
    toChat () {
      logReport({
        eventId: '106-1-6-3',
        target_user_id: this.profileData.id
      });
      this.imChatCheck(this.profileData);
    },
    // 向好友发送电话邀请
    sendCall (data) {
      logReport({
        eventId: '106-1-6-4',
        target_user_id: this.profileData.id
      });
      if (!this.payStatus) {
        const disCoin = getDiscountCoin();
        logReport({
          eventId: '106-1-3-35',
          target_user_id: this.profileData.id,
          payStatus: this.payStatus,
          callLocation: 26,
          coin: disCoin && disCoin.totalCoinNum,
        });
        let con = this.$t('webChat.callFreeTips');
        if (disCoin) {
          con = `<p>${con}</p>${disCoin.con}`;
        }
        this.$message({
          confirmBtnTxt: this.$t('webChat.becomeVIP'), // '充值',
          noCancelBtn: true,
          className: 'become-vip',
          html: `<div class='pop-gold-message'>${con}</div>`,
        }).then(() => {
          logReport({
            eventId: '106-1-3-36',
            target_user_id: this.profileData.id,
            payStatus: this.payStatus,
            callLocation: 26,
            coin: disCoin && disCoin.totalCoinNum,
          });
          // if (disCoin) {
          //   this.$store.commit('setDisCoinIframe', true);
          // } else {
          // }
          this.$router.push({ name: 'CoinPage' });
        });
        return;
      }
      this.$store.commit('setHomeHost', false);
      this.callAction(data, 26);
    },
    // 加好友
    addFriend (id) {
      apiAddFriend({
        addWay: 101,
        friendUserId: id
      }).then(res => {
        console.log(res);
      });
    },
    setMore () {
      logReport({
        eventId: '106-1-6-7',
        target_user_id: this.profileData.id
      });
      this.showMore = true;
    },
    setClose () {
      logReport({
        eventId: '106-1-6-19',
        target_user_id: this.profileData.id
      });
      this.$router.go(-1);
    },
    hideUserHandler () {
      this.showMore = false;
    },
    hideDownHandler () {
      this.showDownload = false;
    },
    hideReportHandler () {
      this.showReport = false;
    },
    getShow () {
      this.showReport = false;
    },
    closeDown () {
      this.showDownload = false;
    },
    modifyRemarks () {

    },
    userOnline () {

    },
    userAccoubts () {

    },
    userDelete () {

    },
    getReportData (data) {
      this.showReport = true;
      this.showMore = false;
      this.reportVideo = 1;
      this.$nextTick(() => {
        this.showReport = true;
        this.showMore = false;
        this.reportVideo = 1;
      });
      console.log(data, 123456789, this.showReport);
    },
    getSHowDown () {
      this.$nextTick(() => {
        this.showDownload = true;
      });
    },
    userEdit () {
      this.$router.push({ name: 'EditProfile' });
    },
    getUserPV () {
      apiGetUserPics({
        searchUserId: this.profileData.id
      }).then(({ code, data }) => {
        if (data && data.picList && data.picList.length) {
          data.picList.map((item) => {
            item.pictureUrl = item.pic;
          });
          this.picList = [...data.picList];
        }
      });

      apiGetUserVideo({
        page: 1,
        size: 10,
        targetUserId: this.profileData.id
      }).then(({ code, data }) => {
        const { list } = data;

        if (list && list.length) {
          list.map(item => {
            item.videoUrl = item.video;
          });
          this.videoList = list;
        }
      });

      this.pollCheckStatus();
    },
    // switchHostAction (type) {
    //   if (type === 'prv') {
    //     if (this.showVideo) {
    //       this.curVideoIndex -= 1;
    //     } else {
    //       this.curHostIndex -= 1;
    //     }
    //   } else {
    //     if (this.showVideo) {
    //       this.curVideoIndex += 1;
    //     } else {
    //       this.curHostIndex += 1;
    //     }
    //   }
    // },
    getStatus (status) {
      this.showHostView = status;
    },
    // 获取星座
    getHoroscope (birthday) {
      const date = new Date(birthday);
      const horoscopes = ['capricorn', 'aquarius', 'pisces', 'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn'];
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const startMonth = month - (day - 14 < '865778999988'.charAt(month));
      const con = horoscopes[startMonth];
      return this.$t(`constellation.${con}`);
    },
    getGender (data) {
      if (data === 1) {
        return this.$t('base.male');
      } else if (data === 2) {
        return this.$t('base.female');
      }
    },
    // 点赞
    clickLike () {
      logReport({
        eventId: '106-1-6-2',
        target_user_id: this.profileData.id
      });
      this.count++;
      if (this.count % 2 === 0) {
        this.isLike = false;
        this.profileData.likedCount--;
      } else {
        this.isLike = true;
        this.profileData.likedCount++;
      }
    },
    // 在线状态
    pollCheckStatus () {
      if (this.profileData.id === this.userInfo.id) return;
      clearTimeout(this.statusTime);
      this.getUserStatus();
      this.statusTime = setTimeout(() => {
        this.pollCheckStatus();
      }, 2 * 1000);
    },

    getUserStatus () {
      apiGetGoddessStatus({ userIds: this.profileData.id }).then(({ code, data }) => {
        if (data && data.length) {
          this.$nextTick(() => {
            this.onlineStatus = data[0].status;
          });
        }
      });
    },
    clickHander (e) {
      if (this.isMobile) {
        e.stopPropagation();
        this.showReport = false;
        this.showMore = false;
        this.reportVideo = null;
        this.showSetUp = false;
      }
    },
    showSetting () {
      logReport({
        eventId: '106-1-1-11', // 设置点击
        target_user_id: this.profileData.id
      });
      this.showSetUp = true;
    },
    cancelSetUp () {
      this.showSetUp = false;
    },
    copyId () {
      navigator && navigator.clipboard && navigator.clipboard.writeText(otherIdFilter(this.profileData.id));
      // this.$message({
      //   desc: {
      //     txt: 'ID copied'
      //   }
      // });

      this.$toast({
        mshow: true,
        html: 'ID copied',
        time: 2000
      });
    },
    changeUserName (name) {
      this.profileData.userName = name;
    },
    mouseenter (type) {
      this.type = type;
      if (!this.$refs[type]) return;
      this.$refs[type].addEventListener('wheel', this.mousewheel) || this.$refs[type].addEventListener('DOMMouseScroll', this.mousewheel);
    },
    mouseleave (type) {
      if (!this.$refs[type]) return;
      this.$refs[type].removeEventListener('wheel', this.mousewheel) || this.$refs[type].removeEventListener('DOMMouseScroll', this.mousewheel);
    },
    mousedown (e) {
      this.clickTime = new Date();
      this.scrollLeft = this.$refs[this.type].scrollLeft;
      this.pageX = e.pageX;
      this.$refs[this.type].addEventListener('mousemove', this.mouseover);
    },
    mouseover (e) {
      const move = this.pageX - e.pageX;
      this.$refs[this.type].scrollLeft = this.scrollLeft + move;
    },
    mouseup (e) {
      this.$refs[this.type].removeEventListener('mousemove', this.mouseover);
    },
    mousewheel (e) {
      if (e.wheelDelta && e.wheelDelta % 240 === 0) { // 谷歌
        if (e.wheelDelta > 0) {
          this.$refs[this.type].scrollLeft += 40;
        } else {
          this.$refs[this.type].scrollLeft -= 40;
        }
      }
    },
    toBackpack () {
      logReport({
        eventId: '106-1-7-7', // bag入口点击
        freeName2: window.$mObj.adData || {},
      });
      this.$router.push({ name: 'Backpack' });
    }
  },
  mounted () {
    this.getUserPV();
    // this.pollCheckStatus();
    this.isMyProfile = this.profileData.id === this.userInfo.id;

    if (this.isMyProfile) {
      const myEnter = document.querySelector('#myEnter');
      if (myEnter) {
        myEnter.style.top = '-100px';
      }
    }

    this.userName = this.profileData.userName;
    this.userId = Number(Cookies.get('userId'));
    // 页面曝光
    logReport({
      eventId: '106-1-6-0',
      target_user_id: this.profileData.id
    });
    console.log(this.profileData, 'friend-data-----');
  },
  created () {
    // this.pollCheckStatus();
    this.stateCode = window.$mObj.userStatus;
  },
  beforeDestroy () {
    if (this.isMyProfile) {
      const myEnter = document.querySelector('#myEnter');
      if (myEnter) {
        myEnter.style.top = '-5px';
      }
    }

    clearTimeout(this.statusTime);
    this.statusTime = null;
  }
};
</script>

<style lang="less">
@import url("./index.less");
</style>
