<template>
  <div class="goddess-wall page-body" :class="{ init: initPage, notag: !sortList.length }" ref="wrapDom">
    <!-- title -->
    <div class="filter-box" :class="{ blur: scrolled }">
      <div class="inner">
        <!-- 分类tag -->
        <div class="sort-tags scroll-vt-box">
          <div class="scroll-wrap" ref="sortList" @mousedown="mousedown" @mouseup="mouseup" @mouseenter="mouseenter" @mouseleave="mouseleave">
            <ul class="the-list scroll-inner">
              <li class="fx-c" v-if="!sortList.length">
                <span>...</span>
              </li>

              <li v-for="(item, index) of sortList" :key="index" :class="{ cur: item.id === curSortId }" class="fx-c"
                @click="changeSort(item.id, item.languageId, item.name)">
                <span>{{ $t(`language.${item.languageId}`)}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="host-list" ref="hostList">
      <!-- 女神墙列表首次骨架占位 -->
      <div class="goddess-list init" v-if="initPage && !networkError">
        <div class="ogoddess" v-for="(item, index) in 16" :key="index">
          <div class="cover"></div>
          <div class="detail fx-be-vc">
            <!-- 头像 -->
            <div class="avatar-img"></div>
            <!-- 信息 -->
            <div class="info"></div>
            <!-- 在线状态 -->
            <div class="status-txt-tag"></div>
          </div>
          <!-- logo -->
          <div class="logo"></div>
        </div>
      </div>

      <!-- 女神墙列表 -->
      <transition name="fade">
        <div class="goddess-list formal-list"  v-if="!initPage && !showEmpty" ref="goddessList">
          <div class="ogoddess" v-for="(item, index) of goddessList" :key="index" :data-uid="item.id" :data-gender="item.gender"
            @click="mobileCall(item, index)">

            <div class="cover">
              <img :src="item.pictureUrl | thumbImg" v-if="item.pictureUrl" alt  />
              <img :src="item.headImg" v-else alt :data-begin="Date.now()" />
            </div>

            <!-- 用户信息 -->
            <div class="detail fx-be-vc">
              <!-- 头像 -->
              <div class="avatar-img">
                <div class="avatar-wrap">
                  <country :countryId="item.countryId" type="img"></country>
                </div>
              </div>
              <!-- 信息 -->
              <div class="info">
                <country :countryId="item.countryId" type="name"></country>
              </div>
              <!-- 在线状态 -->
              <div class="status-txt-tag online" v-if="item.gender === 1" >online</div>
              <div class="status-txt-tag" v-else :class="stateCode[item.onlineStatus]">{{ $t(`base.${stateCode[item.onlineStatus]}`) }}</div>
            </div>
            <!-- 标签 -->
            <div class="tag-box">
              <div class="h-tag min">{{ groupName }}</div>
            </div>
            <div class="god-name">
              {{ item.name }}
            </div>
            <!-- 头像 -->
            <div class="header-img">
              <div class="avatar-img">
                <div class="avatar-wrap">
                  <fitimg :headImg="item.headImg" type="smailimg"></fitimg>
                </div>
              </div>
              <div class="ico-call2 fx-ic" @click.stop="mobileCall(item, index, 1)">
                  <span class="icon-video2"></span>
              </div>
            </div>
            <!-- 呼叫按钮 -->
            <div class="ico-call fx-ic" @click.stop="mobileCall(item, index, 1)">
              <span class="icon-video2"></span>
            </div>
          </div>
        </div>
      </transition>

      <!-- 无数据样式 -->
      <abnormal type="empty" v-if="showEmpty">
        <p>{{$t('webChat.noContent')}}</p>
      </abnormal>

      <!-- 网络异常样式 -->
      <abnormal type="empty" v-if="networkError">
        <p>{{$t('webChat.noContent')}}</p>
      </abnormal>

      <!-- 加载中 -->
      <div class="load-more" ref="loadMore" v-show="goddessList.length">
        <div class="icon-loading" v-if="!noMorePage"><span class="icon"></span><span>{{$t('base.loading')}}</span></div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import debounce from 'lodash/debounce';
import { apiGetGoddessGroup, apiGetGoddessList, apiVisitorGetGoddessList, apiGetGoddessStatus } from '@/api/goddess';
import Abnormal from '@/components/Abnormal';
import agoraMixin from '@/mixin/agoraMixin';
import { logReport } from '@/util/logReport';
import Searchbox from '@/components/searchBox';
import { endeUserId, thumbImg } from '@/filters';
import { getDiscountCoin } from '@/components/messageBox/htmlData';
// import mockData from './data';

export default {
  name: 'goddessWall',
  data () {
    return {
      checked: false,
      pageNo: 1,
      pageSize: 6,
      curSortId: null,
      curSortCountryCode: null,
      sortTime: null,
      sortList: [],
      countryId: null,
      maxAge: null,
      minAge: null,
      gender: null,
      goddessList: [],
      stateCode: {},
      loadLock: false,
      noMorePage: false,
      inViewPos: [],
      inViewUid: [],
      inViewIdx: [],
      removeScrollEvent: null,
      statusTime: null,
      networkError: false,
      groupName: '',
      showHostView: false,
      showBtnPrv: true,
      showBtnNext: true,
      curHostIndex: null,
      firstV: true,
      scrolled: false,
      scrollTop: 0,
      pageX: 0,
      scrollLeft: 0,
      noPoll: false,
      stopOnScroll: false,
      userCountryId: '',
      bannerSwiper: null,
      showBannerFirstPay: false,
      isShowNewRegisterBanner: false,
      guestList: [],
      scrollBack: false,
      intervalAD: 24 * 60 * 60 * 1000,
    };
  },
  mixins: [agoraMixin],
  filters: {
    thumbImg
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
      showBanned: (state) => state.app.showBanned,
      showRingBell: (state) => state.app.showRingBell,
      isMobile: (state) => state.app.isMobile,
      showVideoPop: (state) => state.app.showVideoPop,
      payStatus: (state) => state.app.userInfo.payStatus
    }),
    initPage () {
      // 初始页面显示加载骨架屏
      return this.pageNo === 2 && !this.goddessList.length && !this.noMorePage;
    },
    showEmpty () {
      // 是否显示内容为空提示
      return this.pageNo === 2 && !this.goddessList.length && this.noMorePage;
    },
  },
  components: {
    Abnormal,
    // Searchbox,
    // InviteImg,
  },
  watch: {
    showRingBell (o) {
      if (o) {
        this.getStatus(false);
      }
      this.checkLeaveIn(o);
    },
    $route (n, v) {
      const isIn = /GoddessWall|LiveChat/.test(n.name);
      const isOut = /GoddessWall|LiveChat/.test(v.name);

      if (v && v.name === 'IMMessageSession') {
        this.$store.commit('setImChatConfig', {
          show: false,
          friendId: 0
        });
      }
      if (n.name === 'VideoView' && this.showHostView === false) {
        this.$router.push({
          name: 'GoddessWall'
        });
      }

      if (isIn && v.name === 'VideoView') {
        this.showHostView = false;
      }

      if (v.name === 'LoginPage' && isIn && this.isMobile) {
        document.body.style.position = 'initial';
        document.body.style.top = '0';
      }
      // 进入页面
      if (isIn) {
        this.backToPage();
      }
      // 离开页面
      if (isOut) {
        this.leavePage();
      }

      if (isOut && n.name === 'LoginPage' && this.isMobile) {
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollTop}px`;
      }
    },
    isMobile (n, o) {
      this.removeScrollEvent && this.removeScrollEvent.removeEvent();
      this.removeScrollEvent = this.listenerScroll();
    },
    showVideoPop (o) {
      if (!o) {
        this.checkLeaveIn(o);
      }
    },

  },
  methods: {
    mouseup (e) {
      this.$refs.sortList.removeEventListener('mousemove', this.mouseover);
    },
    mousedown (e) {
      this.scrollLeft = this.$refs.sortList.scrollLeft;
      this.pageX = e.pageX;
      this.$refs.sortList.addEventListener('mousemove', this.mouseover);
    },
    mouseover (e) {
      const move = this.pageX - e.pageX;
      this.$refs.sortList.scrollLeft = this.scrollLeft + move;
    },
    mouseenter () {
      this.$refs.sortList.addEventListener('wheel', this.mousewheel) || this.$refs.sortList.addEventListener('DOMMouseScroll', this.mousewheel);
    },
    mouseleave () {
      this.$refs.sortList.removeEventListener('wheel', this.mousewheel) || this.$refs.sortList.removeEventListener('DOMMouseScroll', this.mousewheel);
    },

    checkLeaveIn (o) {
      const { name } = this.$route;
      if (!o) {
        if (this.showVideoPop) return;
        if (name === 'GoddessWall' || name === 'VideoView') {
          this.backToPage();
        }
      } else {
        if (name === 'GoddessWall') {
          this.leavePage();
        }
      }
    },

    loadImg (e, index) {
      const begin = e.target.getAttribute('data-begin');

      logReport({
        eventId: '106-1-1-27',
        free_name2: {
          loadTime: Date.now() - begin,
          index,
          url: e.target.src,
          group: this.curSortId
        },
        target_user_id: this.goddessList[index].id
      });
    },

    /**
     * 点击切换分类
     * 重置页码 清空列表数据 重新请求分类数据
     * 需要控制接口请求频次
     */
    changeSort (sortId, languageId, name) {
      this.groupName = this.$t(`groups.${sortId}`) || name;
      clearTimeout(this.statusTime);
      // 女神墙Tab切换上报
      logReport({
        eventId: '106-1-1-1',
        free_name2: {
          tagId: sortId,
          tageName: name
        },
      });
      if (!this.checkGuestRqNum('tab')) return;
      if (this.curSortId === sortId) return;
      this.curSortId = sortId;
      this.curSortCountryCode = languageId;
      this.pageNo = 1;
      this.goddessList = [];
      this.noMorePage = false;
      clearTimeout(this.sortTime);
      this.sortTime = setTimeout(() => {
        this.getGoddessListData(this.curSortId);
      }, 200);
    },

    /**
     * 获取女神墙分类列表
     */
    getGoddessGroupData () {
      this.$store.commit('setShowWallTips', false);
      localStorage.setItem('RC_WALL_TIP', true);
      apiGetGoddessGroup().then(({ code, data }) => {
        this.sortList = data || [];
        /**
         * 获得女神分类数据后 需要给定指定分类id 去取获取女神数据列表数据
         * 默认第一个分组
         */
        if (data && data.length) {
          this.curSortId = data[0].id;
          this.groupName = this.$t(`groups.${data[0].id}`) || data[0].name;
          this.curSortCountryCode = data[0].languageId || 0;
          this.getGoddessListData(this.curSortId);
        } else {
          this.curSortId = 0;
          this.getGoddessListData(this.curSortId);
        }
      }).catch(e => {
        this.networkError = true;
      });
    },

    /**
     * 请求女神墙分类数据
     * 接收参数为执行时的sortId 接口返回后需要和this.curSortId比对
     * 如果不一致 不作处理 (用户在接口请求时已经切换了当前sortId)
     */
    getGoddessListData (sortId) {
      if (!this.checkGuestRqNum('load')) return;

      this.loadLock = true;

      const params = {
        groupId: this.curSortId,
        pageSize: this.pageSize,
        // pageNo: this.pageNo
        pagingRequired: this.pageNo === 1 ? 0 : 1
      };
      if (this.pageNo === 1) {
        this.pageNo = 2;
      }

      if (this.maxAge) {
        params.maxAge = this.maxAge;
      }

      if (this.minAge) {
        params.minAge = this.minAge;
      }
      if (this.gender) {
        params.gender = this.gender;
      }

      if (this.countryId !== 0) {
        params.countryId = this.countryId;
      }
      const apiRsp = !this.isLogin ? apiVisitorGetGoddessList : apiGetGoddessList;

      if (!this.isLogin && this.userCountryId) {
        params.preferCountryId = this.userCountryId;
      }

      this.$store.commit('setHomeParams', params);
      apiRsp(params).then(({ code, data }) => {
        // data = mockData;
        this.loadLock = false;
        this.firstV = false;
        if (this.curSortId !== sortId) return;
        if (data && data.length) {
          if (!this.isLogin) {
            this.goddessList.push(...data.splice(0, this.pageSize));
            this.guestList.push(...data);
          } else {
            this.goddessList.push(...data);
          }
          this.$nextTick(() => {
            this.getInViewUid();
          });
        } else {
          // this.goddessList = [];
          this.noMorePage = true;
        }
      }).catch(err => {
        console.log(err);
      });
    },

    /**
     * 登录前的女神墙数据
     * 不让翻页
     */
    getVisitorGoddessData () {
      this.loadLock = true;
      const params = {
        groupId: 16,
      };
      apiVisitorGetGoddessList(params).then(res => {
        console.log(res, 'apiVisitorGetGoddessList------------');
        this.loadLock = false;
        // this.noMorePage = true;
        this.goddessList = res;
      }).catch(e => {
        this.networkError = true;
      });
    },

    /**
     * 挂载女神墙容器滚动监听
     * 1 加载下一页数据
     * 2 获取当前可视区域的起始坐标
     */
    listenerScroll () {
      // const { hostList } = this.$refs;
      const scrollDom = this.isMobile ? window : this.$refs.hostList;
      const loadDom = this.$refs.loadMore;

      // 窗体高度
      const dfHeight = this.isMobile ? scrollDom.innerHeight : scrollDom.clientHeight;

      // 初始可视区域值
      this.inViewPos = [0, dfHeight];

      const scrollHandler = debounce(() => {
        if (this.noPoll || this.stopOnScroll) return;
        clearTimeout(this.statusTime);

        const dfTop = this.isMobile ? 0 : scrollDom.offsetTop;
        const scrollTop = this.isMobile ? scrollDom.scrollY : scrollDom.scrollTop;

        const movePos = dfTop + scrollTop + dfHeight;
        const morePos = loadDom.offsetTop - 280;

        this.scrollTop = scrollTop;

        // 获取视窗范围 没登录不处理
        if (this.isLogin) {
          this.inViewPos = [scrollTop, movePos];
          this.getInViewUid();
        }

        // 加载更多
        if (this.loadLock) return;
        if (!this.goddessList.length) return;
        if (movePos >= morePos) {
          // 如果当前没有登录 翻到最后是自动跳出登录框
          // if (!this.isLogin) {
          //   this.$store.commit('setShowLoginPop', true);
          //   return;
          // }
          if (this.noMorePage) return;

          this.getGoddessListData(this.curSortId);
        }
      }, 100);

      const showBlur = () => {
        if (this.noPoll || this.stopOnScroll) return;
        const scrollTop = this.isMobile ? scrollDom.scrollY : scrollDom.scrollTop;
        const snum = this.isMobile ? 50 : 20;
        this.scrolled = scrollTop >= snum;

        if (this.isMobile) {
          const st = /ar|he|ur/.test(navigator.language) ? 'paddingLeft' : 'paddingRight';
          const dom = document.querySelector('.side-bar .side-coin') || document.querySelector('.side-bar .login');
          // document.querySelector('.filter-box .search').style[st] = this.scrolled ? dom.clientWidth + 10 + 'px' : '0';

          const myEnter = document.querySelector('#myEnter');
          if (myEnter) {
            // myEnter.style.top = this.scrolled ? '-100px' : '-5px';
          }
        }

        if (this.$refs.searchBox) {
          this.$refs.searchBox.showPop = false;
        }
      };

      scrollDom.addEventListener('scroll', scrollHandler);
      scrollDom.addEventListener('scroll', showBlur);

      // 抛出清除监听函数 方便后续清理
      return {
        removeEvent () {
          scrollDom.removeEventListener('scroll', scrollHandler);
          scrollDom.removeEventListener('scroll', showBlur);
        },
      };
    },
    /**
     * 获取可视区域内的女神用户uid
     * 用作轮询用户在线状态的参数
     */
    getInViewUid () {
      clearTimeout(this.statusTime);
      if (!this.$refs.goddessList) return;
      if (!this.goddessList.length) return;
      const goddessList = this.$refs.goddessList.querySelectorAll('.ogoddess');
      const [top, bottom] = this.inViewPos;

      const inViewHost = [];
      this.inViewUid = [];
      this.inViewIdx = [];

      goddessList.forEach((item, index) => {
        if (item.offsetTop >= top && item.offsetTop < bottom) {
          const uid = item.getAttribute('data-uid');
          if (!uid) return;
          this.inViewIdx.push(index);
          this.inViewUid.push(uid);
          inViewHost.push({ ...this.goddessList[index], index });
        }
      });

      // 女神墙曝光
      logReport({
        eventId: '106-1-1-14',
        free_name2: {
          hosts: inViewHost
        }
      });
      this.pollCheckStatus();
    },

    pollCheckStatus () {
      clearTimeout(this.statusTime);
      console.log('---女神墙的轮询-----');
      this.statusTime = setTimeout(() => {
        if (this.inViewUid.length < 1) return;
        apiGetGoddessStatus({ userIds: this.inViewUid.join(',') }).then(({ code, data }) => {
          if (data && data.length) {
            this.inViewIdx.forEach((v, i) => {
              if (this.goddessList[v]) {
                this.goddessList[v].onlineStatus = data[i].status;
              }
            });
          }
          this.pollCheckStatus();
        });
      }, 2 * 1000);
      // this.$once('hook:deactivated', () => {
      //   clearTimeout(this.statusTime);
      //   this.statusTime = null;
      // });
      // this.$once('hook:activated', () => {
      //   this.getInViewUid();
      // });
    },

    /**
     * 用户登录成功后 重新请求登录后数据
     */
    loginedAction () {
      this.noMorePage = false;
      this.loadLock = false;
      this.sortList = [];
      this.goddessList = [];
      this.inViewPos = [];
      this.inViewIdx = [];
      this.inViewUid = [];
      this.curSortId = null;
      this.curSortCountryCode = null;
      this.getGoddessGroupData();
    },

    /**
     * 发送电话邀请
     */
    sendCall (data, index) {
      this.showHostView = true;
      this.curHostIndex = index;
      this.goddessList[this.curHostIndex].groupName = this.groupName;
      // this.showHostView = true;
    },
    goddessProfile (item, online) {
      logReport({
        eventId: '106-1-1-13',
        target_user_id: item
      });
      this.$router.push({
        name: 'FriendPage',
        params: { friendId: endeUserId(item) }
      });
    },
    getSearchData (data) {
      if (!this.checkGuestRqNum('search')) return;
      this.countryId = data[0].id;
      this.gender = data[1].id;
      if (data[2].id === 0) {
        this.maxAge = '';
        this.minAge = '';
      } else if (data[2].id === 3) {
        this.minAge = 30;
        this.maxAge = '';
      } else {
        this.maxAge = data[2].value.split('-')[1];
        this.minAge = data[2].value.split('-')[0];
      }
      this.pageNo = 1;
      this.goddessList = [];
      this.noMorePage = false;
      this.getGoddessListData(this.curSortId);
    },
    getStatus (status) {
      if (this.$route.name === 'VideoView') {
        this.$router.push({
          name: 'GoddessWall'
        });
      }

      this.showHostView = status;
    },
    checkGuestRqNum (from) {
      if (this.isLogin || this.firstV) { return true; };
      if (this.scrollBack) return;
      return false;
    },
    countPageSize () {
      this.pageSize = 30;
    },
    mobileCall (item, index, isBtn) {
      if (this.payStatus) {
        this.$store.commit('setHomeHost', true);
        this.callAction(item, 104);
        const eventId = isBtn ? '106-1-1-28' : '106-1-1-12';
        logReport({
          eventId: eventId,
          target_user_id: item.id,
          free_name2: {
            target_user_video: item.videoUrl || item.headImg,
            target_user_tag: this.curSortId,
            target_user_index: index
          }
        });
      } else {
        const disCoin = getDiscountCoin();

        logReport({
          eventId: '106-1-3-35',
          target_user_id: item.id,
          payStatus: this.payStatus,
          callLocation: 104,
          coin: disCoin && disCoin.totalCoinNum,
        });
        let con = this.$t('webChat.callFreeTips');
        if (disCoin) {
          con = `<p>${con}</p>${disCoin.con}`;
        }
        this.$message({
          confirmBtnTxt: this.$t('webChat.becomeVIP'), // '充值',
          noCancelBtn: true,
          html: `<div class='pop-gold-message'>${con}</div>`,
        }).then(() => {
          logReport({
            eventId: '106-1-3-36',
            target_user_id: item.id,
            payStatus: this.payStatus,
            callLocation: 104,
            coin: disCoin && disCoin.totalCoinNum,
          });
          // if (disCoin) {
          //   this.$store.commit('setDisCoinIframe', true);
          // } else {
          // }
          this.$router.push({ name: 'CoinPage' });
        });
      }
    },
    jumpToCoin (type) {
      this.$router.push({ name: 'CoinPage' });
      logReport({
        eventId: '106-1-1-30',
        free_name2: type === 1 ? 'goddessWall' : 'goddessWallFirstPay'
      });
    },
    backToPage () {
      setTimeout(() => {
        this.noPoll = true;
        if (this.isMobile) {
          window.scrollTo(0, this.scrollTop);
          if (this.scrollTop && document.querySelector('#myEnter')) {
            // document.querySelector('#myEnter').style.top = '-100px';
          }
        } else {
          this.$refs.hostList.scrollTop = this.scrollTop;
        }
        this.stopOnScroll = false;
        setTimeout(() => {
          this.noPoll = false;
          this.getInViewUid();
        }, 200);
      }, 10);
    },
    leavePage () {
      this.stopOnScroll = true;
      clearTimeout(this.statusTime);

      if (document.querySelector('#myEnter')) {
        // document.querySelector('#myEnter').style.top = '-5px';
      }
      this.statusTime = null;
    }
  },
  async mounted () {
    this.countPageSize();
    this.getGoddessGroupData();
    this.removeScrollEvent = this.listenerScroll();
    this.stateCode = window.$mObj.userStatus;
  },
  beforeDestroy () {
    this.removeScrollEvent && this.removeScrollEvent.removeEvent();
    clearTimeout(this.statusTime);
  },
  activated () {
    logReport({
      eventId: '106-4-3-0',
    });
    if (this.scrollTop && document.querySelector('#myEnter')) {
      // document.querySelector('#myEnter').style.top = '-100px';
    }
    console.log('active', this.scrollTop);
  }
};
</script>

<style lang="less">
@import url("./index.less");
</style>
